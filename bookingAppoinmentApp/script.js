// display data on screen -----------------------------------

function displayUserOnScreen(userDetails) {
  const userItem = document.createElement("li");
  userItem.setAttribute("key", userDetails.id);
  userItem.appendChild(
    document.createTextNode(
      `${userDetails.username} - ${userDetails.email} - ${userDetails.phone}`
    )
  );

  const deleteBtn = document.createElement("button");
  deleteBtn.appendChild(document.createTextNode("Delete"));
  deleteBtn.className = "delete-btn";
  userItem.appendChild(deleteBtn);

  const editBtn = document.createElement("button");
  editBtn.appendChild(document.createTextNode("Edit"));
  editBtn.className = "edit-btn";
  userItem.appendChild(editBtn);

  const userList = document.querySelector("ul");
  userList.appendChild(userItem);
}

// ------------------------------------------------------------------------

// displaying all users data from database--------------------------
axios
  .get("http://localhost:8000/")
  .then((response) => {
    response.data.forEach((user) => {
      displayUserOnScreen(user);
    });
  })
  .catch((err) => {
    console.log(err);
  });

// handling form submission----------------------------------------
function handleFormSubmit(event) {
  event.preventDefault();
  const userDetails = {
    username: event.target.username.value,
    email: event.target.email.value,
    phone: event.target.phone.value,
  };
  axios
    .post("http://localhost:8000/", userDetails)
    .then((response) => displayUserOnScreen(response.data))
    .catch((error) => console.log(error));

  // Clearing the input fields
  document.getElementById("username").value = "";
  document.getElementById("email").value = "";
  document.getElementById("phone").value = "";
}

// handling edit-------------------------------------------
const ul = document.querySelector("ul");
ul.addEventListener("click", function (event) {
  if (event.target.className === "edit-btn") {
    let valueOfKey = event.target.parentElement.getAttribute("key");
    console.log(valueOfKey);
    // getting data
    axios
      .get(`http://localhost:8000/${valueOfKey}`)
      .then((response) => {
        console.log(response);
        document.getElementById("username").value = response.data.username;
        document.getElementById("email").value = response.data.email;
        document.getElementById("phone").value = response.data.phone;

       return response
      }).then(()=>{
        axios
        .delete(`http://localhost:8000/${valueOfKey}`)
        .then((response) => {
          console.log(response);
        })
        .catch((err) => {
          console.log(err);
        });
      })
      .catch((err) => {
        console.log(err);
      });

    // cleaning ui

    ul.removeChild(event.target.parentElement);
    // delete data of editing user
  }
});

//deleting data--------------------------------------------------------

ul.addEventListener("click", function (event) {
  if (event.target.className === "delete-btn") {
    let valueOfKey = event.target.parentElement.getAttribute("key");
    console.log(valueOfKey);
    axios
      .delete(`http://localhost:8000/${valueOfKey}`)
      .then((response) => {
        console.log(response);
      })
      .catch((err) => {
        console.log(err);
      });
    ul.removeChild(event.target.parentElement);
  }
});
