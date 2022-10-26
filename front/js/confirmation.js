function renderConfirmPage() {
    let order = JSON.parse(localStorage.getItem("order"));
    const orderIdSpan = document.getElementById("orderId");
    orderIdSpan.innerHTML = "<br>" + "<br>" + order.orderId;
    localStorage.clear();
}

/********************* Execute *************************/
renderConfirmPage();