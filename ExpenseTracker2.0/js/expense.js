const expenseList = document.getElementById("expense-list");
async function displayExpenses() {
  try {
    const response = await fetch("http://localhost:4000/add-expense", {
      method: "GET",
    });
    const expenses = await response.json();
    console.log(expenses);
    expenses.forEach((expenses) => {
      const li = document.createElement("li");
      li.setAttribute("key", expenses.id);
      li.innerHTML = `${expenses.expendicture} - ${expenses.description} - ${expenses.category} <button class = "delete">Delete Expense</ button>`;
      expenseList.appendChild(li);
    });
  } catch (error) {
    console.log(error);
  }
}
displayExpenses();

function displayExpense(expense) {
  const li = document.createElement("li");
  li.setAttribute("key", expense.id);
  li.innerHTML = `${expense.expendicture} - ${expense.description} - ${expense.category} <button class = "delete">Delete Expense</ button>`;
  expenseList.appendChild(li);
}

function handlePostExpense(e) {
  e.preventDefault();
  const expenseData = {
    expendicture: e.target.expendicture.value,
    description: e.target.description.value,
    category: e.target.category.value,
  };
  fetch("http://localhost:4000/add-expense", {
    method: "post",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(expenseData),
  })
    .then((response) => {
      console.log(response);
      return response.json();
    })
    .then((result) => {
      console.log(result);
      //   document.getElementById("message").innerHTML = data.message;
      displayExpense(result);
    })
    .catch((err) => console.log(err));
}

expenseList.addEventListener("click", async (e) => {
  try {
    if ((e.target.className = "delete")) {
      // console.log("button is clicked");
      const response = await fetch(
        `http://localhost:4000/add-expense/${e.target.parentElement.getAttribute("key")}`,
        {
          method: "DELETE",
        }
      );
      if(response.status === 200){
        e.target.parentElement.remove();
      }
    }
  } catch (error) {
    console.log(error);
  }
});
