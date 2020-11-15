window.onload = () => {
  const id = document.getElementById("id");
  const username = document.getElementById("username");
  const password = document.getElementById("password");
  const password_a = document.getElementById("password_a");
  const email = document.getElementById("email");
  const male = document.getElementById("male");
  const age = document.getElementById("age");
  const area = document.getElementById("area");
  const registerBtn = document.getElementById("registerBtn");

  registerBtn.addEventListener("click", () => {
    checkFrom();

    axios({
      method: "post",
      url: "/users",
      data: {
        id: id.value,
        name: username.value,
        password: password.value,
        sex: male.checked ? "M" : "F",
        age: age.value,
        area: area.value,
        email: email.value,
      },
    }).then((response) => {
      console.log(response.data);
      if (response.data.code === 200) {
        location.href = "/login";
      } else {
        alert("오류!!");
        // errorMessageToogle(errorLabel, response.data.message);
      }
    });
  });

  checkFrom = () => {
    if (!checkId()) {
      alert("4~12자 영문소문자, 숫자, 언더라인(_)만 입력해주세요");
      return;
    }
    if (!checkName()) {
      alert("영어/숫자/한글만 입력해주세요");
      return;
    }
    if (!checkPassword()) {
      alert("비밀번호를 입력해주세요");
      return;
    }
    if (!checkPasswordEquals()) {
      alert("비밀번호가 일치하지 않습니다");
      return;
    }
    if (!checkEmail()) {
      alert("E-Mail의 형식이 올바르지 않습니다");
      return;
    }
    if (!checkAge()) {
      alert("나이를 설정해주세요");
      return;
    }
    if (!checkArea()) {
      alert("지역을 입력해주세요");
      return;
    }
  };

  checkId = () => {
    if (!id.value) return false;
    const regExpId = /^[a-z0-9]{4,12}$/;
    if (!regExpId.test(id.value)) return false;
    return true;
  };

  checkName = () => {
    if (!username.value) return false;
    const regExpName = /^[ㄱ-ㅎ|가-힣|a-z|A-Z|0-9|\*]+$/;
    if (!regExpName.test(username.value)) return false;
    return true;
  };

  checkPassword = () => {
    if (!password.value) return false;
    // const regExpPassword = /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,25}$/;
    // if (!regExpName.test(username.value)) return false;
    return true;
  };

  checkPasswordEquals = () => {
    if (password.value != password_a.value) return false;
    return true;
  };

  checkEmail = () => {
    if (!username.value) return false;
    const regExpEmail = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i;
    if (!regExpEmail.test(email.value)) return false;
    return true;
  };

  checkAge = () => {
    if (!age.value || age == "0") return false;
    return true;
  };

  checkArea = () => {
    if (!area.value) return false;
    return true;
  };
};
