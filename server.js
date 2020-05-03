const express = require('express')
const app = express()
const pgp = require("pg-promise")(/*options*/);
const config = require('./config/dev')
const bcrypt = require('./bcrypt')
const jwt = require('jsonwebtoken')
const cookieParser0 = require('cookie-parser')
const { auth } = require("./middleware/auth")
//const bcrypt = require('bcrypt')


const db = pgp(config.pgURI);
const bodyParser = require('body-parser')


app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.get('/users', function (req, res) {
     db.many('SELECT * FROM Users')
          .then(function (data) {
               console.log("DATA:", data);
               res.send(data);
          })
          .catch(function (error) {
               console.log("ERROR:", error);
          });
})

/*
app.post('/users', function(req, res){
     db.one("INSERT INTO Users(id, password, name, sex, age, location, rgsn_dttm) VALUES($1, $2, $3, $4, $5, to_char(now(),'YYYY-MM-DD HH24:MI:SS')) RETURNING id",
      [req.body.id, bcrypt.encrypt(req.body.password), req.body.name, req.body.sex, req.body.age, req.body.location])
      .then((data) => {
          jsonData = {"code" : 200, "message" : '성공적으로 데이터가 삽입되었습니다'}
          console.log("DATA:", data);
          res.send(jsonData);
     })
     .catch((error) => {
          jsonData = {"code" : "", "message" : "회원가입에 실패했습니다."}
     }) 
})
*/

app.post('/users', function (req, res) {
     let encryptPW
     insertOne = ((password) => {
          db.one("INSERT INTO Users(id, password, name, sex, age, area, rgsn_dttm) VALUES($1, $2, $3, $4, $5, $6, to_char(now(),'YYYY-MM-DD HH24:MI:SS')) RETURNING id",
               [req.body.id, password, req.body.name, req.body.sex, req.body.age, req.body.area])
               .then((data) => {
                    jsonData = { "code": 200, "message": '성공적으로 데이터가 삽입되었습니다' }
                    console.log("DATA:", data);
                    res.send(jsonData);
               })
               .catch((error) => {
                    jsonData = { "code": "", "message": "회원가입에 실패했습니다." }
                    console.log(error)
                    res.send(jsonData);
               })
     })
     // awiat , async , promise 에 대해서 공부하기
     // 동기처리관련해서 공부필요
     encryptPW = bcrypt.encrypt(req.body.password, insertOne)
})

app.post("/login", (req, res) => {
     db.one("select * from users where id = $1", [req.body.id])
          .then((data) => {
               comparePasswordCheck = ((err, isMatch) => {
                    if (isMatch) {
                         jsonData = { "code": 200, "message": "로그인 성공." }
                         let token = jwt.sign(data.id , "wybhSecretToken")
                         console.log("token", token)
                         db.none("update users set token = $1 where id = $2", [token, data.id])
                         .then((data) => {
                              console.log("cookie send")
                              res.cookie("x_auth", token).status(200).json(jsonData)
                         }).catch((error) => {
                              console.error(error)
                         })
                    } else {
                         jsonData = { "code": 200, "message": "비밀번호를 확인해주세요." }
                         res.send(jsonData);
                    }
               })
               bcrypt.comparePassword(req.body.password, data.password,  comparePasswordCheck)
          }).catch((error) => {
               console.error(error)
               jsonData = { "code": "", "message": "아이디가 존재하지 않습니다." }
               res.send(jsonData);
          })
        
})

app.get("/auth", auth, (req,res) => {
     console.log("auth")
     //jwt.verity(token, 'wybhSecretToken', ((err, decoded) =>{
         // db.one("select * from users where id =")
     // }))
})



app.listen(3000, function () {
     console.log("Connected 3000 port!")
})

