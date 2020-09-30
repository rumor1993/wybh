const express = require("express");
const db = require("../middleware/database");
const bcrypt = require("../bcrypt");
const router = express.Router();

router.get("/", function (req, res) {
  getUsersInfo(req, res);
});

router.get("/:id", function (req, res) {
  getUserInfo(req, res);
});

router.post("/", async (req, res) => {
  if (
    !req.body.id ||
    !req.body.password ||
    !req.body.name ||
    !req.body.sex ||
    !req.body.age ||
    !req.body.area
  ) {
    throw Error("모든 데이터를 적어주세요!.");
  }

  req.body.password = await bcrypt.encrypt(req.body.password);
  registerUser(req, res);
});

getUsersInfo = (req, res) => {
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

getUserInfo = (req, res) => {
  db.one(
    "SELECT ID, NAME, SEX, AGE, AREA, RGSN_DTTM, EDIT_DTTM FROM Users WHERE ID = $1 r",
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

registerUser = (req, res) => {
  db.one(
    "INSERT INTO Users(id, password, name, sex, age, area, rgsn_dttm) VALUES($1, $2, $3, $4, $5, $6, to_char(now(),'YYYY-MM-DD HH24:MI:SS')) RETURNING id",
    [
      req.body.id,
      req.body.password,
      req.body.name,
      req.body.sex,
      req.body.age,
      req.body.area,
    ]
  )
    .then((data) => {
      jsonData = { code: 200, message: "성공적으로 데이터가 삽입되었습니다" };
      console.log("DATA:", data);
      res.send(jsonData);
    })
    .catch((error) => {
      jsonData = { code: "", message: "회원가입에 실패했습니다." };
      console.log(error);
      res.send(jsonData);
    });
};

module.exports = router;
