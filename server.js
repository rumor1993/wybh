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
     db.one("INSERT INTO Users(id, name, sex, age, location, rgsn_dttm) VALUES($1, $2, $3, $4, $5, to_char(now(),'YYYY-MM-DD HH24:MI:SS')) RETURNING id",
      [req.body.id, req.body.name, req.body.sex, req.body.age, req.body.location])
     .then(function (data) {
          jsonData = {"code" : 200, "msg" : '성공적으로 데이터가 삽입되었습니다'}
          console.log("DATA:", data);
          res.send(jsonData);
     })
     .catch(function (error) {
         console.log("ERROR:", error);
     });
})


app.listen(3000, function(){
     console.log("Connected 3000 port!")
})
