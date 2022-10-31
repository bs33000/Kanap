function renderConfirmPage() {
/* get orderId as param and display order conf
*/

    let params = new URLSearchParams(document.location.search);
    const orderId = params.get("id");
    console.log(params);
    document.getElementById("orderId").innerHTML += "<br>" + "<br>" + `${orderId}`;
}



/********************* Execute *************************/
renderConfirmPage();