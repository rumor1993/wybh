const express = require("express");
const bcrypt = require("../bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../middleware/database");
const router = express.Router();

router.get("/", async (req, res) => {
  res.render("login.html");
});

router.post("/", async (req, res) => {
  const userInfo = await getUserInfoId(req, res);
  comparePasswordCheck(req, res, userInfo);
});

getUserInfoId = async (req, res) => {
  try {
    const data = await db.one("select * from users where id = $1", [
      req.body.id,
    ]);
    return data;
  } catch (error) {
    jsonData = { code: "", message: "아이디가 존재하지 않습니다." };
    res.send(jsonData);
  }
};

comparePasswordCheck = async (req, res, userInfo) => {
  console.log(userInfo);
  const isMatch = await bcrypt.comparePassword(
    req.body.password,
    userInfo.password
  );
  console.log("isMacth", isMatch);
  if (isMatch) {
    jsonData = { code: 200, message: "로그인 성공." };
    let token = jwt.sign(userInfo.id, "wybhSecretToken");
    db.none("update users set token = $1 where id = $2", [token, userInfo.id])
      .then((data) => {
        res.cookie("x_auth", token).status(200).json(jsonData);
      })
      .catch((error) => {
        console.error(error);
      });
  } else {
    jsonData = { code: 401, message: "비밀번호를 확인해주세요." };
    res.send(jsonData);
  }
};

module.exports = router;
