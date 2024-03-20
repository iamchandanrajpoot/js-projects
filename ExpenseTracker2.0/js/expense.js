const p = document.getElementById("premium-p");
async function displayUserUi() {
  try {
    const response = await fetch("http://localhost:4000/user", {
      method: "GET",
      headers: { Authorization: localStorage.getItem("authToken") },
    });
    const user = await response.json();
    console.log(user);

    if (user.isPremiumUser) {
      p.innerHTML =
        "Your premium user now <button id='leader-board-btn'>Leader Board </button>";
      const leaderBoardBtn = document.getElementById("leader-board-btn");
      leaderBoardBtn.addEventListener("click", displayLeaderBoadrd);
    } else {
      p.innerHTML = '<button id="rozorpay-btn">Purchase Premium</button>';
      const rozorpayBtn = document.getElementById("rozorpay-btn");
      rozorpayBtn.addEventListener("click", async (e) => {
        try {
          const response = await fetch(
            "http://localhost:4000/purchase/premium-membership",
            {
              method: "GET",
              headers: { Authorization: localStorage.getItem("authToken") },
            }
          );
          console.log(response);
          const result = await response.json();
          console.log(result);

          const options = {
            key: result.key_id,
            currency: "INR",
            order_id: result.order.id,
            handler: async function (response) {
              try {
                console.log(response);
                // Handle successful payment response
                const updateTransactionResponse = await fetch(
                  "http://localhost:4000/purchase/update-transaction-status",
                  {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                      Authorization: localStorage.getItem("authToken"),
                    },
                    body: JSON.stringify({
                      order_id: result.order.id,
                      payment_id: response.razorpay_payment_id,
                      status: "SUCCESSFULL",
                    }),
                  }
                );
                const responseData = await updateTransactionResponse.json();
                console.log(responseData);
                p.innerHTML =
                  "Your premium user now <button id='leader-board-btn'>Leader Board </button>";
                const leaderBoardBtn =
                  document.getElementById("leader-board-btn");
                leaderBoardBtn.addEventListener("click", displayLeaderBoadrd);
                alert("You are now a premium user");
              } catch (error) {
                console.error("Error updating transaction status:", error);
                alert("Error updating transaction status");
              }
            },
          };

          const rzp1 = new Razorpay(options);
          rzp1.open();
          e.preventDefault();
          // Handle FAILED payment response
          rzp1.on("payment.failed", async function (response) {
            alert(response.error.code);
            const updateTransactionResponse = await fetch(
              "http://localhost:4000/purchase/update-transaction-status",
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: localStorage.getItem("authToken"),
                },
                body: JSON.stringify({
                  order_id: result.order.id,
                  payment_id: response.razorpay_payment_id,
                  status: "FAILED",
                }),
              }
            );

            const responseData = await updateTransactionResponse.json();
            console.log(responseData);
            alert("payment failed");
          });
        } catch (error) {
          console.log(error);
        }
      });
    }
  } catch (error) {
    console.log(error);
  }
}

displayUserUi();
// -----------------------------------------------
const expenseList = document.getElementById("expense-list");
async function displayExpenses() {
  try {
    const response = await fetch("http://localhost:4000/api/expenses", {
      method: "GET",
      headers: {
        Authorization: localStorage.getItem("authToken"),
      },
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

// ----------------------------------
function displayExpense(expense) {
  const li = document.createElement("li");
  li.setAttribute("key", expense.id);
  li.innerHTML = `${expense.expendicture} - ${expense.description} - ${expense.category} <button class = "delete">Delete Expense</ button>`;
  expenseList.appendChild(li);
}

//----------------------------------------
function handlePostExpense(e) {
  e.preventDefault();
  const expenseData = {
    expendicture: e.target.expendicture.value,
    description: e.target.description.value,
    category: e.target.category.value,
  };
  fetch("http://localhost:4000/api/add-expense", {
    method: "post",
    headers: {
      "Content-Type": "application/json",
      Authorization: localStorage.getItem("authToken"),
    },
    body: JSON.stringify(expenseData),
  })
    .then((response) => {
      console.log(response);
      return response.json();
    })
    .then((result) => {
      console.log(result);
      if (result.successful) {
        displayExpense(result.expense);
        //   document.getElementById("message").innerHTML = data.message;
      }
    })
    .catch((err) => console.log(err));
}
// -------------------------------------------
expenseList.addEventListener("click", async (e) => {
  try {
    if ((e.target.className = "delete")) {
      // console.log("button is clicked");
      const response = await fetch(
        `http://localhost:4000/api/expenses/${e.target.parentElement.getAttribute(
          "key"
        )}`,
        {
          method: "DELETE",
          headers: {
            Authorization: localStorage.getItem("authToken"),
          },
        }
      );
      if (response.status === 200) {
        e.target.parentElement.remove();
      }
    }
  } catch (error) {
    console.log(error);
  }
});

// ---------------------------------------------

async function displayLeaderBoadrd() {
  try {
    const response = await fetch(
      "http://localhost:4000/purchase/leader-board",
      {
        method: "GET",
        headers: { Authorization: localStorage.getItem("authToken") },
      }
    );
    const premiumUsers = await response.json();

    const leaderboard = document.getElementById("leader-board");
    leaderboard.style.display = "block";
    leaderboard.innerHTML = "";
    const h1 = document.createElement("h1");
    h1.innerHTML = "Leader Board";
    leaderboard.appendChild(h1);
    const ul = document.createElement("ul");
    premiumUsers.forEach((premiumUser) => {
      const li = document.createElement("li");
      li.innerHTML = `Name: ${premiumUser.name}, Total Expense : ${premiumUser.totalExpense}`;
      ul.appendChild(li);
    });
    leaderboard.appendChild(ul);
  } catch (error) {
    console.log(error);
  }
}
