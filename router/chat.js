const express = require("express");
const db = require("../middleware/database");
const router = express.Router();

router.get("/", (req, res) => {
  res.render("chat.html");
});

router.get("/:id", (req, res) => {
  db.many(
    `
    select * from message m inner join message_list ml on m.room_srno = ml.room_srno
    where sender = '${req.params.id}' or recipient = '${req.params.id}' order by send_dttm desc limit 5
    `
  )
    .then((data) => {
      jsonData = { code: 200, message: "성공적으로 데이터가 삽입되었습니다" };
      res.send(data);
    })
    .catch((error) => {
      console.log(error);
      jsonData = { code: 400, message: "채팅방 리스트가 없습니다." };
      res.send(jsonData);
    });
});

router.post("/", (req, res) => {
  db.one(
    "INSERT INTO message_list(room_srno, last_message, last_sender, rgsn_dttm ) VALUES (nextval('seq_room_srno'), $1, $2, to_char(now(),'YYYY-MM-DD HH24:MI:SS')) RETURNING room_srno",
    [req.body.lastMessage, req.body.lastSender]
  )
    .then((data) => {
      jsonData = { code: 200, message: "성공적으로 데이터가 삽입되었습니다" };
      res.send(jsonData);
    })
    .catch((error) => {
      console.log(error);
      jsonData = { code: "", message: "채팅방 생성에 실패했습니다." };
      res.send(jsonData);
    });
});

module.exports = router;
