const expenseListUl = document.getElementById("expences");
const form = document.getElementById("expence-form");

function displayDataInsideUl(details) {
  const expence = document.createElement("li");
  expence.setAttribute("key", details.id);
  const textNode = document.createTextNode(
    `${details.amount} ${details.description} ${details.category}`
  );
  expence.append(textNode);

  // creating delete button when adding expence data on dom
  const deleteBtn = document.createElement("button");
  deleteBtn.className = "delete";
  deleteBtn.innerHTML = "delete";
  expence.appendChild(deleteBtn);

  // creating edit button when adding expence data on dom
  const editBtn = document.createElement("button");
  editBtn.className = "edit";
  editBtn.innerHTML = "edit";
  expence.appendChild(editBtn);

  expenseListUl.appendChild(expence);
}

// getting data of database before adding , deleting , editing data

axios
  .get("http://localhost:8000/api/")
  .then((expences) => {
    console.log(expences);
    expences.data.map((expence) => displayDataInsideUl(expence));
  })
  .catch((err) => console.log(err));

// handle sumbit form action ------------------------------------
form.addEventListener("submit", (event) => {
  event.preventDefault();
  const expenceData = {
    amount: event.target.amount.value,
    description: event.target.description.value,
    category: event.target.category.value,
  };

  // post expense data on db
  console.log(expenceData);

  axios
    .post("http://localhost:8000/api/", expenceData)
    .then((expence) => {
      console.log(expence);
      displayDataInsideUl(expence.data);
      document.getElementById("amount").value = "";
      document.getElementById("description").value = "";
      document.getElementById("category").value = " ";
    })
    .catch((err) => console.log(err));
});

// --------------------------------------------------------------

// handling delete functionalites
expenseListUl.addEventListener("click", (e) => {
  if (e.target.className == "delete") {
    e.target.parentElement.remove();
    console.log(e.target.parentElement.textContent);
    axios
      .delete(
        `http://localhost:8000/api/${e.target.parentElement.getAttribute(
          "key"
        )}`
      )
      .then(() => {
        console.log("removed expense");
      })
      .catch((err) => {
        console.log(err);
      });
  }
});

// handling edit functionalites
expenseListUl.addEventListener("click", (e) => {
  if (e.target.className == "edit") {
    e.target.parentElement.style.display = "none";
    console.log(e.target.parentElement.textContent);

    axios
      .get(
        `http://localhost:8000/api/${e.target.parentElement.getAttribute(
          "key"
        )}`
      )
      .then((expence) => {
        console.log(expence)
        document.getElementById("amount").value = expence.data.amount;
        document.getElementById("description").value = expence.data.description;
        document.getElementById("category").value = expence.data.category;
        return expence;
      })
      .then((expence) => {
        // setting db values to input boxes
        axios.delete(
          `http://localhost:8000/api/${e.target.parentElement.getAttribute(
            "key"
          )}`
        );
      })
      .catch((err) => console.log(err));
  }
});

// module.exoprts = handleFormSubmit;
