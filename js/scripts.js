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

Gameboard.prototype.checkAIWin = function(avail){
var move = -1;
  avail.forEach(function(ar){
    var winCheck = winCombos.filter(function(a) {
      return a.includes(ar);
    })
    winCheck.forEach(function(a){
      var count = 0;
      if(gameBoard.board[a[0]]==='O'){
        count++;
      }
      if(gameBoard.board[a[1]]==='O'){
        count++;
      }
      if(gameBoard.board[a[2]]==='O'){
        count++;
      }
      if(count === 2)
      {
        move = ar;
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
      var winCheck = winCombos.filter(function(a) {
        return a.includes(ar);
      })
      winCheck.forEach(function(a){
        var count = 0;
        if(gameBoard.board[a[0]]==='X'){
          count++;
        }
        if(gameBoard.board[a[1]]==='X'){
          count++;
        }
        if(gameBoard.board[a[2]]==='X'){
          count++;
        }
        if(count === 2)
        {
          move = ar;
        }
      })
    })
  return move;
}

Gameboard.prototype.aiMove = function () {
  var move = -1; //before there is a move
  gameBoard.swapActive();
  var available = this.board.filter(function(ar) {
    return !(isNaN(ar));
  })
  if(move < 0){
    move = gameBoard.checkAIWin(available);
  }

  if(move<0){
    move = gameBoard.checkAIBlock(available);

  }
  if (available.includes(4) && move < 0){
    move = 4;

  }
  if(move<0){
    var theMove = Math.floor(Math.random() * available.length);
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
        $('.'+active.letter+'win').append("<h3 class="+active.letter+"win'>O: "+score.owins+ "</h3>");
      }
    }else if(gameBoard.turns === 9){
      $('.gameover').append('<h1>Nobody wins!</h1>');
    }

    if(gameBoard.player2.ai===true && gameBoard.over === false){
      var aiMove = gameBoard.aiMove();
      $('#'+aiMove).append('O');
      $('#'+aiMove).removeClass('click');

    }
    $(this).removeClass('click');

  }

  });
  $(".container").on("click", ".restart", function() {
    $('.col-lg-4').addClass('click');
    $('.col-lg-4').empty();
    $('.gameover').empty();
    gameBoard = new Gameboard;
    gameBoard.player2.ai=false;
  });
  $(".container").on("click", ".ai", function() {
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
