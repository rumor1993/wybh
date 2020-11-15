window.onload = () => {
  const loginBtn = document.getElementById("loginBtn");
  const errorLabel = document.getElementById("errorLabel");
  const forgotPassword = document.getElementById("forgotPassword");
  const kakao = document.getElementById("kakao");
  const faceBook = document.getElementById("faceBook");
  const userName = document.getElementById("username");
  const passWord = document.getElementById("password");

  kakao.addEventListener("click", () => {
    errorMessageToogle(errorLabel, "소셜로그인은 개발중입니다!");
  });

  faceBook.addEventListener("click", () => {
    errorMessageToogle(errorLabel, "소셜로그인은 개발중입니다!");
  });

  forgotPassword.addEventListener("click", () => {
    alert("Email로 비밀번호를 보냈습니다");
    //errorMessageToogle(errorLabel, "Email로 비밀번호를 보냈습니다");
  });

  loginBtn.addEventListener("click", () => {
    if (!userName.value) {
      errorMessageToogle(errorLabel, "ID를 입력해주세요");
      return;
    }

    if (!passWord.value) {
      errorMessageToogle(errorLabel, "PassWord를 입력해주세요");
      return;
    }

    axios({
      method: "post",
      url: "/login",
      data: {
        id: userName.value,
        password: passWord.value,
      },
    }).then((response) => {
      if (response.data.code === 200) {
        setCookie("userId", userName.value);
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

setCookie = (cname, cvalue, exdays) => {
  var d = new Date();
  d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
  var expires = "expires=" + d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
};
