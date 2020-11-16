const express = require("express");
const db = require("../middleware/database");
const bcrypt = require("../bcrypt");
const router = express.Router();

router.get("/", (req, res) => {
  findUserList(req, res);
});

router.get("/:id", (req, res) => {
  findUserById(req, res);
});

router.get("/exists/:id", (req, res) => {
  isExistsId(req, res)
})

router.post("/", async (req, res) => {
  console.log(req.body);
  
  if (
    !req.body.id ||
    !req.body.name ||
    !req.body.sex ||
    !req.body.age ||
    !req.body.area
  ) {
    throw Error("모든 데이터를 적어주세요!.");
  }

  req.body.password = await bcrypt.encrypt(req.body.password);
  createUser(req, res);
});

function findUserList(req, res) {
  db.many(
    "SELECT ID, NAME, SEX, AGE, AREA, password,RGSN_DTTM, EDIT_DTTM FROM Users"
  )
    .then(function (data) {
      console.log("DATA:", data);
      res.send(data);
    })
    .catch(function (error) {
      res.send(error);
      console.log("ERROR:", error);
    });
};

function findUserById(req, res) {
  db.one(
    "SELECT ID, NAME, SEX, AGE, AREA, RGSN_DTTM, EDIT_DTTM FROM Users WHERE ID = $1",
    [req.params.id]
  )
    .then(function (data) {
      console.log("DATA:", data);
      res.send(data);
    })
    .catch(function (error) {
      console.log("ERROR:", error);
      res.send(error);
    });
};

function createUser(req, res) {
  db.one(
    `SELECT ID FROM USERS WHERE ID = $1`,
    [req.body.id]
  ).then(data => console.log(data))


  db.one(
    "INSERT INTO Users(id, password, name, sex, age, area, email ,token, rgsn_dttm) VALUES($1, $2, $3, $4, $5, $6, $7, $8, to_char(now(),'YYYY-MM-DD HH24:MI:SS')) RETURNING id",
    [
      req.body.id,
      req.body.password,
      req.body.name,
      req.body.sex,
      req.body.age,
      req.body.area,
      req.body.email,
      req.body.token
    ]
  )
    .then((data) => {
      jsonData = { code: 200, message: "성공적으로 데이터가 삽입되었습니다" };
      res.send(jsonData);
    })
    .catch((error) => {
      jsonData = { code: "", message: "회원가입에 실패했습니다." };
      res.send(jsonData);
    });
};

function isExistsId(req, res) {
  db.one(
    "SELECT COUNT(0) as count FROM Users WHERE ID = $1",
    [req.params.id]
  )
    .then((data) => {
      console.log(data)
      res.status(204);
    })
    .catch((error) => {

    });
}

module.exports = router;

