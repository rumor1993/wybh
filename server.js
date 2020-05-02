const express = require('express') 
const app = express() 
const pgp = require("pg-promise")(/*options*/);
const config = require('./config/dev')


const db = pgp(config.pgURI);
const bodyParser = require('body-parser')


app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))

app.get('/users', function(req, res){
     db.many('SELECT * FROM Users' )
     .then(function (data) {
          console.log("DATA:", data);
          res.send(data);
      })
      .catch(function (error) {
          console.log("ERROR:", error);
      });
})

app.post('/users', function(req, res){
     db.one("INSERT INTO Users(id, password, name, sex, age, location, rgsn_dttm) VALUES($1, $2, $3, $4, $5, to_char(now(),'YYYY-MM-DD HH24:MI:SS')) RETURNING id",
      [req.body.id, req.body.password, req.body.name, req.body.sex, req.body.age, req.body.location])
      .then((data) => {
          jsonData = {"code" : 200, "message" : '성공적으로 데이터가 삽입되었습니다'}
          console.log("DATA:", data);
          res.send(jsonData);
     })
     .catch((error) => {
          jsonData = {"code" : "", "message" : "회원가입에 실패했습니다."}
     }) 
})

app.post("/login", (req,res) => {
     db.one("select count(0) from users where id = $1", [req.id])
     .then((data) => {
          db.one("select count(0) from users where = $1", [req.body.password])
          .then((data) => {
               jsonData = {"code" : 200, "message" : "로그인 되었습니다."}
          })
          .catch((error) => {
               jsonData = {"code" : 200, "message" : "비밀번호를 확인해주세요."}
          })
     })
     .catch((error) => {
          jsonData = {"code" : "", "message" : "아이디가 존재하지 않습니다."}
     }).finally(() => {
          res.send(jsonData);
     }) 
})

app.listen(3000, function(){
     console.log("Connected 3000 port!")
})
