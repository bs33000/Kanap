function renderConfirmPage() {
/* get orderId as param and display order conf
*/

    let params = new URLSearchParams(window.location.search);
    const orderId = params.get("id");
    document.getElementById("orderId").innerHTML += "<br>" + "<br>" + `${orderId}`;
    localStorage.clear();
}



/********************* Execute *************************/
renderConfirmPage();