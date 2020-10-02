const express = require("express");
const db = require("../middleware/database");
const router = express.Router();

router.get("/:room_srno", (req, res) => {
  db.many(
    `
        select * from message where room_srno = ${req.params.room_srno}
    `
  ).then((data) => {
    jsonData = {
      code: 200,
      message: "성공적으로 데이터가 삽입되었습니다",
    };
    res.send(data);
  });
});

router.post("/", async (req, res) => {
  console.log(req.body);
  const room_srno = req.body.room_srno
    ? req.body.room_srno
    : await db
        .one(`Select nextval('seq_room_srno')`)
        .then((data) => data.nextval);

  db.one(
    `INSERT INTO message(msg_srno, room_srno, cont, sender, recipient, send_dttm, notice_yn  ) 
     VALUES ( nextval('seq_msg_srno'), $1, $2, $3, $4, to_char(now(),'YYYY-MM-DD HH24:MI:SS'), $5) RETURNING room_srno`,
    [
      parseInt(room_srno),
      req.body.cont,
      req.body.sender,
      req.body.recipient,
      req.body.notice_yn,
    ]
  )
    .then((data) => {
      db.any(
        `INSERT INTO message_participant(room_srno, user_id) 
         SELECT t.room_srno , t.sender as user_id
         FROM 
            (
                select room_srno , sender from message
                where room_srno = ${data.room_srno}
                union  
                select room_srno ,recipient from message
                where room_srno =  ${data.room_srno}
            ) as t
            WHERE
            not exists ( select * from message_participant where room_srno =  ${data.room_srno} ) 
        `
      )
        .then((data) => {
          db.any(
            `
                insert into message_list (
                    room_srno,
                    last_message,
                    rgsn_dttm
                )
                select t.room_srno, t.cont, t.msg_srno
                from 
                (
                select room_srno , cont  , msg_srno 
                from message 
                    where   
                        sender = '${req.body.sender}'
                        or recipient = '${req.body.recipient}'
                        and room_srno = ${room_srno} 
                        order by send_dttm desc limit 1
                ) as t
                where 
                not exists ( select 1 from message_list where room_srno = ${room_srno})
                `
          );
          jsonData = {
            code: 200,
            message: "성공적으로 데이터가 삽입되었습니다",
          };
          res.send(jsonData);
        })
        .catch((error) => {
          console.log(error);
          jsonData = { code: "", message: "채팅방 생성에 실패했습니다." };
          res.send(jsonData);
        });
    })
    .catch((error) => {
      console.log(error);
      jsonData = { code: "", message: "채팅방 생성에 실패했습니다." };
      res.send(jsonData);
    });
});
module.exports = router;
