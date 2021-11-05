var popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'))
var popoverList = popoverTriggerList.map(function (popoverTriggerEl) {
  return new bootstrap.Popover(popoverTriggerEl)
})
document.getElementById('popUp').addEventListener("click",
   function(){
     console.log("click détecté !");
    window.setTimeout(function () {
      location.href = "../home";
  }, 5000);
   })