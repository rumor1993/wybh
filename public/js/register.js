window.onload = () => {
  const id = document.getElementById("id");
  const username = document.getElementById("username");
  const password = document.getElementById("password");
  const password_a = document.getElementById("password_a");
  const sex = document.getElementById("sex");
  const age = document.getElementById("age");
  const area = document.getElementById("area");
  const registerBtn = document.getElementById("registerBtn");

  registerBtn.addEventListener("click", () => {
    if (!id.value) {
      alert("아이디를 입력해주세요");
    } else if (!username.value) {
      alert("닉네임을 입력해주세요");
    } else if (!password.value) {
      alert("비밀번호를 입력해주세요");
    } else if (!sex.value) {
      alert("성별을 입력해주세요");
    } else if (!age.value) {
      alert("나이를 입력해주세요");
    } else if (!area.value) {
      alert("지역을 입력해주세요");
    } else if (password.value != password_a.value) {
      alert("비밀번호가 일치하지 않습니다");
      return;
    } else {
      axios({
        method: "post",
        url: "/users",
        data: {
          id: id.value,
          name: username.value,
          password: password.value,
          sex: sex.value,
          age: age.value,
          area: area.value,
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
    }
  });
};
// $(".login-form").validate({
//   rules: {
//     username: {
//       required: true,
//       minlength: 4,
//     },
//     email: {
//       required: true,
//       email: true,
//     },
//     password: {
//       required: true,
//       minlength: 5,
//     },
//     cpassword: {
//       required: true,
//       minlength: 5,
//       equalTo: "#password",
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
