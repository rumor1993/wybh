const userId = getCookie("userId");
const socket = io.connect("http://wybh.co.kr:3001", { rememberUpgrade: true });
socket.emit("join", userId);

$(document).ready(async () => {
  const chatListData = await getChatList(userId);
  drawChatList(chatListData.data);
  socketReceive();

  const sendBtn = document.getElementById("send");
  sendBtn.addEventListener("click", () => {
    drawChatMessage();
    sendChatMessage(userId);
  });

  $(".friend").each(function () {
    showMessageView(this);
  });
  legacyCode();
});

getChatList = async (userId) => {
  let newData = await axios({
    method: "get",
    url: `/chat/${userId}`,
  });
  return newData;
};

drawChatList = (el, elementId) => {
  if (el.code == 400) return;

  const chatList = document.getElementById("friends");
  el.map((element) => {
    console.log(element);
    let el = document.createElement("div");
    const friendObj = `
                      <div id=${element.room_srno} class="friend" sender="${element.sender}" recipient="${element.recipient}">
                      <img
                        src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/245657/5_copy.jpg"
                      />
                      <p>
                        <strong class="add-block"> ${element.sender} </strong>
                        <span> ${element.last_message} </span>
                      </p>
                      <div class="status inactive"></div>
                    </div>
                    `;
    el.innerHTML = friendObj;
    chatList.append(el);
  });
};

drawChatMessage = (messageData) => {
  const messageList = document.getElementById("chat-messages");
  const message = document.getElementById("messageInput");
  let el = document.createElement("div");
  let isSender = true;
  let cont = message.value;

  if (messageData) {
    console.log(messageData.cont);
    isSender = messageData.sender == userId;
    cont = messageData.cont;
  }
  const messageObj = `
  <div class="message ${isSender ? "" : "right"}">
    <img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/245657/1_copy.jpg" />
    <div class="bubble">
      ${cont}
      <div class="corner"></div>
      <span>3 min</span>
    </div>
  </div>
  `;
  el.innerHTML = messageObj;
  messageList.append(el);
  scrollBottom();
};

scrollBottom = () => {
  const messageList = document.getElementById("chat-messages");
  let messageClassObjs = document.querySelectorAll(".message");
  messageList.scrollTop = document.querySelectorAll(".message")[
    messageClassObjs.length - 1
  ].offsetTop;
};

sendChatMessage = () => {
  const message = document.getElementById("messageInput");
  const dataObj = document.getElementById("dataObj");
  const recipient = dataObj.getAttribute("recipient");
  const sender = dataObj.getAttribute("sender");
  const room_srno = dataObj.getAttribute("room_srno");
  let cont = message.value;
  message.value = "";

  sendData = {
    room_srno: room_srno,
    cont: cont,
    sender: userId,
    recipient: recipient == userId ? sender : recipient,
    notice_yn: "N",
  };
  axios({
    method: "post",
    url: `/message`,
    data: sendData,
  });

  socket.emit("message", sendData);
};

messageKeyPress = () => {
  if (window.event.keyCode == 13) {
    drawChatMessage();
    sendChatMessage(userId);
  }
};

showMessageView = async (obj) => {
  $(obj).click(async function () {
    const messageData = await axios({
      method: "get",
      url: `/message/${$(obj).attr("id")}`,
    });

    await messageData.data.map((element) => {
      drawChatMessage(element);
    });

    var childOffset = $(obj).offset();
    var parentOffset = $(obj).parent().parent().offset();
    var childTop = childOffset.top - parentOffset.top;
    var clone = $(obj).find("img").eq(0).clone();
    var top = childTop + 12 + "px";

    let dataObj = document.createElement("div");
    dataObj.id = "dataObj";
    dataObj.setAttribute("room_srno", $(obj).attr("id"));
    dataObj.setAttribute("sender", $(obj).attr("sender"));
    dataObj.setAttribute("recipient", $(obj).attr("recipient"));
    dataObj.style.display = "none";
    $("#profile").append(dataObj);

    $(clone).css({ top: top }).addClass("floatingImg").appendTo("#chatbox");

    setTimeout(function () {
      $("#profile p").addClass("animate");
      $("#profile").addClass("animate");
    }, 100);
    setTimeout(function () {
      $("#chat-messages").addClass("animate");
      $(".cx, .cy").addClass("s1");
      setTimeout(function () {
        $(".cx, .cy").addClass("s2");
      }, 100);
      setTimeout(function () {
        $(".cx, .cy").addClass("s3");
      }, 200);
      scrollBottom();
    }, 150);

    $(".floatingImg").animate(
      {
        width: "68px",
        left: "108px",
        top: "20px",
      },
      200
    );

    var name = $(obj).find("p strong").html();
    var email = $(obj).find("p span").html();
    $("#profile p").html(name);
    $("#profile span").html(email);

    $(".message").not(".right").find("img").attr("src", $(clone).attr("src"));
    $("#friendslist").fadeOut();
    $("#chatview").fadeIn();
    $("#messageInput").focus();

    $("#close")
      .unbind("click")
      .click(function () {
        $("#chat-messages, #profile, #profile p").removeClass("animate");
        $("#chat-messages").attr("room_srno", "");
        $(".cx, .cy").removeClass("s1 s2 s3");
        $(".floatingImg").animate(
          {
            width: "40px",
            top: top,
            left: "12px",
          },
          200,
          function () {
            $(".floatingImg").remove();
          }
        );

        setTimeout(function () {
          $("#chatview").fadeOut();
          $("#friendslist").fadeIn();
        }, 50);
      });
  });
};
legacyCode = () => {
  var preloadbg = document.createElement("img");
  preloadbg.src =
    "https://s3-us-west-2.amazonaws.com/s.cdpn.io/245657/timeline1.png";

  $("#searchfield").focus(function () {
    if ($(this).val() == "Search contacts...") {
      $(this).val("");
    }
  });
  $("#searchfield").focusout(function () {
    if ($(this).val() == "") {
      $(this).val("Search contacts...");
    }
  });

  $("#sendmessage input").focus(function () {
    if ($(this).val() == "Send message...") {
      $(this).val("");
    }
  });
  $("#sendmessage input").focusout(function () {
    if ($(this).val() == "") {
      $(this).val("Send message...");
    }
  });
};

socketReceive = () => {
  socket.on("message", function (data) {
    console.log("message", data);
    drawChatMessage(data);
  });
};
