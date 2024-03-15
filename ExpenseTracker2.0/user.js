function handleRegister(e) {
    e.preventDefault();
    const userData = {
      name: e.target.name.value,
      email: e.target.email.value,
      password: e.target.password.value,
    };
    fetch(
      "http://localhost:4000/user/register",
  
      {
        method: "post",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      }
    )
      .then((response) => {
        console.log(response);
        //   return JSON.parse(response);
        return response.json();
      })
      .then((data) => {
        console.log(data);
        document.getElementById("message").innerHTML = data.message;
      })
      .catch((err) => console.log(err));
  }
  function handleLogin(e) {
    e.preventDefault();
    const userData = {
      email: e.target.email.value,
      password: e.target.password.value,
    };
    fetch(
      "http://localhost:4000/user/login",
      {
        method: "post",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      }
    )
      .then((response) => {
        console.log(response);
        return response.json();
      })
      .then((data) => {
        console.log(data);
        document.getElementById("message").innerHTML = data.message;
      })
      .catch((err) => console.log(err));
  }
    