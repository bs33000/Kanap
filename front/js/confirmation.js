/**
 * get orderId as param and display order conf
 */
function renderConfirmPage() {
    let params = new URLSearchParams(document.location.search);
    const orderId = params.get("id");
    document.getElementById("orderId").innerHTML += "<br>" + "<br>" + `${orderId}`;
}

/********************* Execute *************************/
renderConfirmPage();