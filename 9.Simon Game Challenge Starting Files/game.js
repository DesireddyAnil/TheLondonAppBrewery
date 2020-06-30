var gameOn = false;
var level = 0;
var clickCounter = 0;
var userClickedPattern = [];
var gamePattern = [];
var buttonColors = ["red", "blue", "green", "yellow"];

function playSound(color) {
  var audioPath = "sounds/" + color + ".mp3";
  var audio = new Audio(audioPath);
  audio.play();
}

function animatePress(color) {
  $("#" + color).addClass("pressed");
  setTimeout(function() {
    $("#" + color).removeClass("pressed");
  }, 100);
}

function nextSequence() {
  var randomNumber = Math.floor(Math.random() * 4);
  var randomChoosenColor = buttonColors[randomNumber];
  gamePattern.push(randomChoosenColor);
  $("#" + randomChoosenColor).fadeOut(100).fadeIn(100);
  playSound(randomChoosenColor);
  updateClicksLeft();
}

function updateClicksLeft() {
  var clicksUpdate = "clicks left : " + (gamePattern.length - userClickedPattern.length);
  $("p").text(clicksUpdate);
  $(".clicks-update").css("visibility","visible");

}

function clickHandler() {
  clickCounter++;
  var userChosenColor = this.getAttribute("id");
  userClickedPattern.push(userChosenColor);
  animatePress(userChosenColor);
  if (userChosenColor !== gamePattern[clickCounter - 1]) {
    gameOver();
  } else {
    playSound(userChosenColor);
    if (userClickedPattern.length === gamePattern.length) {
      setTimeout(levelUp, 1000);
    }
    updateClicksLeft();
  }

}
$(".btn").on("click", clickHandler);

$(document).on("keydown", function() {
  if (!gameOn) {
    console.log("game started");
    gameOn = true;
    startGame();
  }
});

function displayLevel() {
  $("h1").text("level " + level);
}
function resetPatterns(){
  gamePattern = [];
  userClickedPattern = [];
}
function startGame() {
  level = 1;
  clickCounter = 0;
  resetPatterns();
  displayLevel();
  nextSequence();
}

function levelUp() {
  clickCounter = 0;
  level++;
  displayLevel();
  userClickedPattern = [];
  nextSequence();
}

function gameOver() {

  $("h1").text("Game over, Press any key to start agian.");
  $(".clicks-update").css("visibility","hidden");
  $("body").addClass("game-over");
  setTimeout(function() {
    playSound("wrong");
    $("body").removeClass("game-over");
  }, 100);
  gameOn = false;



}
