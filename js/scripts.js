// BackEnd
var winCombos =
[[0,1,2],
[0,3,6],
[1,4,7],
[2,5,8],
[3,4,5],
[6,7,8],
[0,4,8],
[2,4,6]];
var gameBoard = new Gameboard();

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

Gameboard.prototype.checkWin = function(num){
  num = parseInt(num);
  var winCheck = winCombos.filter(function(ar) {
    return ar.includes(num);
  })
  console.log(winCheck);
  winCheck.forEach(function(ar) {
  if (gameBoard.board[ar[0]] === gameBoard.board[ar[1]] && gameBoard.board[ar[0]] === gameBoard.board[ar[2]]){
    gameBoard.over = true;
  }
  })
}

Gameboard.prototype.swapActive = function(){
  if(gameBoard.player1.active === true){
  gameBoard.player1.active = false;
  gameBoard.player2.active = true;
  }else{
  gameBoard.player1.active = true;
  gameBoard.player2.active = false;
  }
}

Gameboard.prototype.getActive = function(){
  if(gameBoard.player1.active === true){
    return gameBoard.player1;
  }else{
    return gameBoard.player2;
  }
}

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
var score = new Score();
function attachListeners() {
  $(".container").on("click", ".click", function() {
    if(gameBoard.over === false){
    var active = gameBoard.getActive();
    $(this).append(active.letter);
    gameBoard.swapActive();
    gameBoard.board[parseInt($(this).prop('id'))] = active.letter;
    gameBoard.turns++;
    gameBoard.checkWin(parseInt($(this).prop('id')));
    if(gameBoard.over === true){
      $('.gameover').append('<h1>'+active.letter+ ' wins!</h1>');
      if(active.letter==='X'){
        score.xwins++;
        $('.'+active.letter+'win').empty();
        $('.'+active.letter+'win').append("<h3 class="+active.letter+"win'>X: "+score.xwins+ "</h3>");
      }else{
        score.owins++;
        $('.'+active.letter+'win').empty();
        $('.'+active.letter+'win').append("<h3 class="+active.letter+"win'>X: "+score.owins+ "</h3>");
      }
    }else if(gameBoard.turns === 9){
      $('.gameover').append('<h1>Nobody wins!</h1>');
    }
    $(this).removeClass('click');
  }

  });
  $(".container").on("click", ".restart", function() {
    $('.col-lg-4').addClass('click');
    $('.col-lg-4').empty();
    $('.gameover').empty();
    gameBoard = new Gameboard;
  });
  // $("#buttons").on("click", ".deleteButton", function() {
  //   addressBook.deleteContact(this.id);
  //   $("#show-contact").hide();
  //   displayContactDetails(addressBook);
  // });
};

$(document).ready(function() {
  attachListeners();
})
