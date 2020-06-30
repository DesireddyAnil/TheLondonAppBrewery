// vanilla js
// for(var i= 0; i<document.querySelectorAll("button").length; i++){
//   document.querySelectorAll("button")[i].addEventListener("click", function(){
//     document.querySelector("h1").classList.add("change-color");     //selects only the very first h1 encounterd in the html doc.
//   })
// }
// document.querySelector("input").addEventListener("keydown",function(){
//   console.log(event.key);
// });


// same thing using jquery

$("button").click(function(){                        //directly applies event listener to all the buttons with out need of looping as above.
  $("h1").addClass("change-color");                 //adds the classes(multiple classes as well) to all the h1s in the html doc
});
$("input").keydown(function(){
  console.log(event.key);
});
$(document).keydown(function(){
  $("h1").text(event.key);
});
