// BackEnd
var winCombos = //make arrays inside array
[[0,1,2],
[0,3,6],
[1,4,7],
[2,5,8],
[3,4,5],
[6,7,8],
[0,4,8],
[2,4,6]];
var gameBoard = new Gameboard(); //calls the Gameboard function

function Gameboard(){
  this.board =
    [0,1,2
    ,3,4,5,
    6,7,8],
  this.player1 = new Player("X"),
  this.player2 = new Player("O"),
  this.over = false,
  this.turns = 0,
  this.player1.active = true;
}

Gameboard.prototype.checkWin = function(num){ //Makes a function to check to see if you win
  num = parseInt(num);
  var winCheck = winCombos.filter(function(ar) {
    return ar.includes(num);
  })
  winCheck.forEach(function(ar) {
  if (gameBoard.board[ar[0]] === gameBoard.board[ar[1]] && gameBoard.board[ar[0]] === gameBoard.board[ar[2]]){
    gameBoard.over = true;
  }
  })
}

Gameboard.prototype.swapActive = function(){ // makes a function to swap turns
  if(gameBoard.player1.active === true){
  gameBoard.player1.active = false;
  gameBoard.player2.active = true;
  }else{
  gameBoard.player1.active = true;
  gameBoard.player2.active = false;
  }
}

Gameboard.prototype.getActive = function(){ //Makes a function to set active player
  if(gameBoard.player1.active === true){
    return gameBoard.player1;
  }else{
    return gameBoard.player2;
  }
}
// AI section
Gameboard.prototype.checkAIWin = function(avail){ //checks to see if AI wins
var move = -1;
  avail.forEach(function(ar){
    var winCheck = winCombos.filter(function(a) { // checks every space to see if AI can win
      return a.includes(ar);
    })
    winCheck.forEach(function(a){
      var count = 0;
      if(gameBoard.board[a[0]]==='O'){ //checks 1st row for how many O's
        count++;
      }
      if(gameBoard.board[a[1]]==='O'){ //checks 2nd row for how many O's
        count++;
      }
      if(gameBoard.board[a[2]]==='O'){ //checks 3rd row for how many O's
        count++;
      }
      if(count === 2)
      {
        move = ar; // if there are 2 O's AI will place a third  in the open space
      }
    })
  })
  if(move>=0)
  {
    aiWins();
  }
return move;
}

Gameboard.prototype.checkAIBlock = function(avail){
  var move = -1;
    avail.forEach(function(ar){
      var winCheck = winCombos.filter(function(a) { // checks evey spot to see if AI can block player from winning
        return a.includes(ar);
      })
      winCheck.forEach(function(a){
        var count = 0;
        if(gameBoard.board[a[0]]==='X'){ //checks 1st row for how many X's
          count++;
        }
        if(gameBoard.board[a[1]]==='X'){ //checks 2nd row for how many X's
          count++;
        }
        if(gameBoard.board[a[2]]==='X'){  //checks 3rd row for how many X's
          count++;
        }
        if(count === 2)
        {
          move = ar; //if there are 2 X's AI will place a O to block player
        }
      })
    })
  return move;
}

Gameboard.prototype.aiMove = function () {
  var move = -1; //before there is a move
  gameBoard.swapActive();
  var available = this.board.filter(function(ar) { //checks the board for available spaces
    return !(isNaN(ar));
  })
  if(move < 0){
    move = gameBoard.checkAIWin(available); //AI will check to see if it can win
  }

  if(move<0){
    move = gameBoard.checkAIBlock(available); // AI will then check to see if it can block the Player

  }
  if (available.includes(4) && move < 0){ // AI will then check to see if the middle position is available
    move = 4;

  }
  if(move<0){
    var theMove = Math.floor(Math.random() * available.length); // AI will make a random move
    move = available[theMove];
  }
    gameBoard.board[move] = 'O';
    gameBoard.checkWin(move);
    return move;
};
function Player(letter){
  this.letter = letter,
  this.active = false,
  this.wins = 0
}
function Score(){
  this.xwins = 0,
  this.owins = 0
}

// user Interface
var score = new Score(); // calls the Score function
function attachListeners() {
  $(".container").on("click", ".click", function() {
    if(gameBoard.over === false){//if game starts, Activate player 1
    var active = gameBoard.getActive();
    $(this).append(active.letter); // places the letter of the active player
    gameBoard.swapActive(); // swap players
    gameBoard.board[parseInt($(this).prop('id'))] = active.letter; //checks index postion and changes in the backend with the active letter
    gameBoard.turns++; //keeps track of every turn
    gameBoard.checkWin(parseInt($(this).prop('id'))); //checks to see if you can win.
    if(gameBoard.over === true){ //when someone wins output who wins
      $('.gameover').append('<h1>'+active.letter+ ' wins!</h1>');
      if(active.letter==='X'){
        score.xwins++;
        $('.'+active.letter+'win').empty();
        $('.'+active.letter+'win').append("<h3 class="+active.letter+"win'>X: "+score.xwins+ "</h3>");
      }else{
        score.owins++;
        $('.'+active.letter+'win').empty();
        $('.'+active.letter+'win').append("<h3 class="+active.letter+"win'>O: "+score.owins+ "</h3>");
      }
    }else if(gameBoard.turns === 9){//when no more spaces are available and nobody wins
      $('.gameover').append('<h1>Nobody wins!</h1>');
    }

    if(gameBoard.player2.ai===true && gameBoard.over === false){//when it is the AI turn it will not move to a previous made move and player will be unable to access that square
      var aiMove = gameBoard.aiMove();
      $('#'+aiMove).append('O');
      $('#'+aiMove).removeClass('click');

    }
    $(this).removeClass('click'); //removes the ability to click on none-available squares

  }

  });
  $(".container").on("click", ".restart", function() {// will start a 2 player game and clear board of all prior input
    $('.col-lg-4').addClass('click');
    $('.col-lg-4').empty();
    $('.gameover').empty();
    gameBoard = new Gameboard;
    gameBoard.player2.ai=false;
  });
  $(".container").on("click", ".ai", function() {// will start a new game with the AI and clear board of all prior input
    $('.col-lg-4').addClass('click');
    $('.col-lg-4').empty();
    $('.gameover').empty();
    gameBoard = new Gameboard;
    gameBoard.player2.ai=true;
  });

};

$(document).ready(function() {
  attachListeners();
  aiWins = function(){
    score.owins++;
    $('.Owin').empty();
    $('.Owin').append("<h3 class='Owin'>O: "+score.owins+ "</h3>");
    $('.gameover').append('<h1>You, Stupid Human Lost!</h1>');
  }
})
