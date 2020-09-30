// $(".login-form").validate({
//   rules: {
//     username: {
//       required: true,
//       minlength: 4,
//     },
//     password: {
//       required: true,
//       minlength: 5,
//     },
//   },
//   //For custom messages
//   messages: {
//     username: {
//       required: "Enter a username",
//       minlength: "Enter at least 4 characters",
//     },
//   },
//   errorElement: "div",
//   errorPlacement: function (error, element) {
//     var placement = $(element).data("error");
//     if (placement) {
//       $(placement).append(error);
//     } else {
//       error.insertAfter(element);
//     }
//   },
// });
window.onload = () => {
  const loginBtn = document.getElementById("loginBtn");
  const errorLabel = document.getElementById("errorLabel");
  const kakao = document.getElementById("kakao");
  const faceBook = document.getElementById("faceBook");

  kakao.addEventListener("click", () => {
    errorMessageToogle(errorLabel, "소셜로그인은 개발중입니다!");
  });

  faceBook.addEventListener("click", () => {
    errorMessageToogle(errorLabel, "소셜로그인은 개발중입니다!");
  });

  loginBtn.addEventListener("click", () => {
    const userName = document.getElementById("username").value;
    const passWord = document.getElementById("password").value;

    axios({
      method: "post",
      url: "/login",
      data: {
        id: userName,
        password: passWord,
      },
    }).then((response) => {
      if (response.data.code === 200) {
        location.href = "/chat";
      } else {
        errorMessageToogle(errorLabel, response.data.message);
      }
    });
  });
};

errorMessageToogle = (el, message) => {
  el.style.display = "block";
  setTimeout(() => {
    el.style.display = "none";
  }, 1000);
  el.textContent = message;
};
