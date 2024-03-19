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
                status: "SUCCESSFULL"
              }),
            }
          );
          const responseData = await updateTransactionResponse.json();
          console.log(responseData);
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
            status: "FAILED"
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
