var randomNum1 = Math.floor(Math.random()*6)+1;
var imgPath1 = "images/dice"+randomNum1.toString()+".png";
document.querySelector(".img1").setAttribute("src",imgPath1);
var randomNum2 = Math.floor(Math.random()*6)+1;
var imgPath2 = "images/dice"+randomNum2.toString()+".png";
document.querySelector(".img2").setAttribute("src",imgPath2);
if(randomNum1>randomNum2){
  document.querySelector("h1").innerHTML="<i class='fas fa-flag-checkered'></i> Player 1 wins";
}
else if(randomNum1<randomNum2){
  document.querySelector("h1").innerHTML="Player 2 wins <i class='fas fa-flag-checkered'></i>";
}
else{
  document.querySelector("h1").innerHTML="Draw!";
}
