//DATA

//Arrays
// this global 2 dimensional array represents the new deck
let newlyDeck = [["HEART", ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"]], ["DIAMOND", ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"]], ["CLUB", ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"]], ["SPADE", ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"]]];
// this global array stores the card text of ordered deck
let deck = [];

//Variables
// this global variable stores the generated random number
let randomNumber;

//Objects
//this object stores the properties, methods about player 
let player = {
  dealtCardCount: 0, // stores the count of delat cards by player
  dealtCardList: [], //stores the dealt cards by player as an array. e.g.-"SPAD10","HEAR9","DIAMK","CLUBA"
  dealtCardValueList: [], //stores the card value of all dealt cars by player. e.g.-10,9,10,1
  currentScore: 0, //stores the current score of player
  hasBusted: function () { //method for return true/false value for status for player busted or not.
    return this.currentScore > 21;
  }
};
//this object stores the properties, methods about computer
let computer = {
  dealtCardCount: 0, // stores the count of delat cards by computer
  dealtCardList: [], //stores the dealt cards by computer as an array. e.g.-"SPAD10","HEAR9","DIAMK","CLUBA"
  dealtCardValueList: [], //stores the card value of all dealt cars by computer. e.g.-10,9,10,1
  currentScore: 0, //stores the current score of computer
  hasBusted: function () { //method for return true/false value for status for computer busted or not.
    return this.currentScore > 21;
  }
};





// ABSTRACTIONS

// get the suit category with 4 characters from new deck. e.g.-"SPAD"
function selectSuit(newlyDeck, suitIndex) {
  return newlyDeck[suitIndex][0].slice(0, 4);
}

// get the ordered deck as one dimensional array with 52 elements. e.g.-one element as "SPAD10"  
function createDeck(newlyDeck) {
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 13; j++) {
      deck.push(selectSuit(newlyDeck, i) + newlyDeck[i][1][j]);
    }
  }
}

// get the random number between 1 and count of non-dealt cards(remining cards to deal) of the deck. initially random number between 1 to 52.
function ranNumGen(deckCardCount) {
  return Math.floor(Math.random() * deckCardCount) + 1;
}

// get the string value for dealt card. e.g.-"SPAD10"
function getDealtCard(randomNumber, deck) {
  return deck[randomNumber - 1];
}

// get the relavant value of dealt card.
function getCardValue(dealtCard) {
  let cardCharacter = dealtCard.slice(4, dealtCard.length);
  switch (cardCharacter) {
    case "A":
      return 1;
    case "2":
    case "3":
    case "4":
    case "5":
    case "6":
    case "7":
    case "8":
    case "9":
    case "10":
      return parseInt(cardCharacter);
    case "J":
      return 10;
    case "Q":
      return 10;
    case "K":
      return 10;
  }
}

// removing the dealt card from ordered deck.
function removeCard(randomNumber, deck) {
  deck.splice(randomNumber - 1, 1);
}

// store the relavant values of dealts cards of player and computer to arrays named "player.dealtCardValueList" and "computer.dealtCardValueList". Here user means "player" or "computer". 
function storeValues(getCardValue, user) {
  user.dealtCardValueList.push(getCardValue);
}

// get current score of player and computer. Here user means "player" or "computer".
function getScore(DealtCardValueList, user) {
  user.currentScore = 0;
  for (let i = 0; i < DealtCardValueList.length; i++) {
    user.currentScore = user.currentScore + DealtCardValueList[i];
  }
  return user.currentScore;
}

//get PNG image url for relavant dealt card.
function getCardImageLink(dealtCard) {
  let firstCharacter = dealtCard.slice(0, 1);
  switch (firstCharacter) {
    case "H":
      return "https://raw.githubusercontent.com/Prasadmadhusanka/blackjack-two-player-written-in-javascript/main/assets/Card_images/" + dealtCard.slice(4, dealtCard.length) + "_of_hearts.png";
    case "D":
      return "https://raw.githubusercontent.com/Prasadmadhusanka/blackjack-two-player-written-in-javascript/main/assets/Card_images/" + dealtCard.slice(4, dealtCard.length) + "_of_diamonds.png";
    case "C":
      return "https://raw.githubusercontent.com/Prasadmadhusanka/blackjack-two-player-written-in-javascript/main/assets/Card_images/" + dealtCard.slice(4, dealtCard.length) + "_of_clubs.png";
    case "S":
      return "https://raw.githubusercontent.com/Prasadmadhusanka/blackjack-two-player-written-in-javascript/main/assets/Card_images/" + dealtCard.slice(4, dealtCard.length) + "_of_spades.png";
  }
}

//inject the image to HTML file with creating HTML <img> tags, attributes. For player's cards and computer's cards.  
function injectImage(dealtCard, parentId, newChildClassName) {
  let newImageElement = document.createElement("img");
  newImageElement.setAttribute("src", getCardImageLink(dealtCard));
  newImageElement.setAttribute("class", newChildClassName);
  document.getElementById(parentId).appendChild(newImageElement);
}

//setting the image to existing <img> tag with existing id. For Current delat card. 
function imageSetter(dealtCard, imageId) {
  document.getElementById(imageId).setAttribute("src", getCardImageLink(dealtCard));
}

//setting the texts to existing HTML tags with existing ids.
function labelSetter(id, newText) {
  document.getElementById(id).innerHTML = newText;
}

//playing the mp3 audio sounds
function audioPlay(task) {
  let audio = new Audio();
  if (task == "Final Result") {
    audio.src = "https://raw.githubusercontent.com/Prasadmadhusanka/blackjack-two-player-written-in-javascript/main/assets/Sounds/FinalResultSound.mp3";
  }
  if (task == "Shuffling") {
    audio.src = "https://raw.githubusercontent.com/Prasadmadhusanka/blackjack-two-player-written-in-javascript/main/assets/Sounds/ShufflingCards.mp3";
  }
  audio.play();
}

//clear the existing values of arrays, variables and HTML tags and assign new initial values.
function newGame() {
  removeCardImages();
  deck = [];
  player.dealtCardCount = 0;
  player.dealtCardList = [];
  player.dealtCardValueList = [];
  player.currentScore = 0;
  player.hasBusted();

  computer.dealtCardCount = 0;
  computer.dealtCardList = [];
  computer.dealtCardValueList = [];
  computer.currentScore = 0;
  computer.hasBusted();

  document.getElementById("imgCurrentCard").removeAttribute("src");
  labelSetter("lblHint", "Shuffling");
  labelSetter("lblPlayerScore", 0);
  labelSetter("lblComputerScore", 0);
}

//remove the <img> childrens from <div> tags called "divPlayerCards" and "divComputerCards"   
function removeCardImages() {
  for (let i = player.dealtCardCount + 2; i > 2; i--) {
    document.getElementById("divPlayerCards").children[i - 1].remove();
  }

  let playerCardsDiv = document.getElementById("divPlayerCards");
  if (playerCardsDiv) {
    playerCardsDiv.style.overflowY = "";
  }
  for (let i = computer.dealtCardCount + 2; i > 2; i--) {
    document.getElementById("divComputerCards").children[i - 1].remove();
  }

  let computerCardsDiv = document.getElementById("divComputerCards");
  if (computerCardsDiv) {
    computerCardsDiv.style.overflowY = "";
  }
}



//MAIN PROGRAM

//add two button click event listners for initial Game intro window.
document.getElementById("btnPlayGame1").addEventListener("click", appearGameWindow);
document.getElementById("btnBlackJackRules1").addEventListener("click", appearGameRulesWindow);

//function for appearing the Main game window
function appearGameWindow(e) {
  //if click the "btnPlayGame1" in Game intro window, execute the following if estatement only
  if (e.target.id == "btnPlayGame1") {
    document.getElementById("divIntroPage").style.display = "none";
    document.getElementById("divHeaderButtons").style.visibility = "hidden";
    document.getElementById("divCurrentCard").style.visibility = "hidden";
    document.getElementById("divHitStay").style.visibility = "hidden";
    document.getElementById("lblHint").style.display = "block";
    document.getElementById("divGamePage").style.display = "block";
    createDeck(newlyDeck); //create the 52 element ordered deck from newly deck
    setTimeout(animationShuffling, 600); //run the Shuffling text animation.
  }
  //if click the "btnPlayGame2" in Game rules window, execute the following if estatement only
  if (e.target.id == "btnPlayGame2") {
    document.getElementById("divBlackJackRulesPage").style.display = "none";
    document.getElementById("divHeaderButtons").style.visibility = "hidden";
    document.getElementById("divCurrentCard").style.visibility = "hidden";
    document.getElementById("divHitStay").style.visibility = "hidden";
    document.getElementById("lblHint").style.display = "block";
    document.getElementById("divGamePage").style.display = "block";
    createDeck(newlyDeck); //create the 52 element ordered deck from newly deck
    setTimeout(animationShuffling, 600); //run the Shuffling text animation.
  }
  //if click the "btnResumeGame" in Main game window, execute the following if estatement only
  if (e.target.id == "btnResumeGame") {
    document.getElementById("divBlackJackRulesPage").style.display = "none";
    document.getElementById("btnResumeGame").style.display = "none";
    document.getElementById("divGamePage").style.display = "block";
  }
  //if click the "btnPlayAgain" in Final result window, execute the following if estatement only
  if (e.target.id == "btnPlayAgain") {
    newGame();
    document.getElementById("divFinalResult").style.display = "none";
    document.getElementById("divBJWelcome").style.visibility = "visible";
    document.getElementById("lblHint").style.display = "block";
    createDeck(newlyDeck);
    setTimeout(animationShuffling, 600);
  }
  //if click the "btnNewGame" in Main gamewindow, execute the following if estatement only
  if (e.target.id == "btnNewGame") {
    newGame();
    document.getElementById("divHeaderButtons").style.visibility = "hidden";
    document.getElementById("divCurrentCard").style.visibility = "hidden";
    document.getElementById("divHitStay").style.visibility = "hidden";
    document.getElementById("lblHint").style.display = "block";
    createDeck(newlyDeck);
    setTimeout(animationShuffling, 600);
  }
}

//add text animation with displaying the delay for shuffling. Around 2400ms.
function animationShuffling() {
  audioPlay("Shuffling"); //play the audio for shuffling
  document.getElementById("lblHint").innerHTML = document.getElementById("lblHint").innerHTML + " .";
  setTimeout(animationShuffling1, 600);
  function animationShuffling1() {
    document.getElementById("lblHint").innerHTML = document.getElementById("lblHint").innerHTML + " .";
    setTimeout(animationShuffling2, 600);
    function animationShuffling2() {
      document.getElementById("lblHint").innerHTML = document.getElementById("lblHint").innerHTML + " .";
      setTimeout(animationShuffling3, 600);
      function animationShuffling3() {
        document.getElementById("lblHint").innerHTML = document.getElementById("lblHint").innerHTML + " .";
        document.getElementById("divHeaderButtons").style.visibility = "visible";
        document.getElementById("divCurrentCard").style.visibility = "visible";
        document.getElementById("divHitStay").style.visibility = "visible";
        document.getElementById("lblHint").style.display = "none";
        playerTurn();
      }
    }
  }
}

//execute the player turns
function playerTurn() {
  playerDealCard(); //deal the first card by player
  playerDealCard(); //deal the second card by player

  //add four button click event listners for Main game window.
  document.getElementById("btnHit").addEventListener("click", playerDealCard);
  document.getElementById("btnStay").addEventListener("click", computerTurn);
  document.getElementById("btnBlackJackRules2").addEventListener("click", appearGameRulesWindow);
  document.getElementById("btnNewGame").addEventListener("click", appearGameWindow);
}

//function for dealing one card for player
function playerDealCard() {

  randomNumber = ranNumGen(deck.length); //generate random number for player's deal
  player.dealtCardList.push(getDealtCard(randomNumber, deck)); //deal the card from deck by player and store this string value
  removeCard(randomNumber, deck); //remove the dealt card from deck
  storeValues(getCardValue(player.dealtCardList[player.dealtCardCount]), player); //storing the value of dealt.
  player.dealtCardCount++; //player dealt card count increment by 1.
  imageSetter(player.dealtCardList[player.dealtCardCount - 1], "imgCurrentCard"); //current dealt card set to <img id="imgCurrentCard"> 
  injectImage(player.dealtCardList[player.dealtCardCount - 1], "divPlayerCards", "imgPlayerCards"); //inject current image to <div id="divPlayerCards"> as children 
  labelSetter("lblPlayerScore", getScore(player.dealtCardValueList, player)); //set the current player score to <span id="lblPlayerScore"> 
  //add vertical scroll bar when inject 6 dealt cards to <div id="divPlayerCards"> as childrens 
  if (player.dealtCardCount == 6) {
    document.getElementById("divPlayerCards").style.overflowY = "scroll";
  }
  //If the player is busted (player score is higher than 21) 
  if (player.hasBusted() == true) {
    labelSetter("lblFinalResult", "YOU BUSTED . . .<br>YOU LOST . . . "); //set final result
    document.getElementById("divFinalResult").style.backgroundColor = "rgba(242,59,26,0.5)"; //set color "Green" with opacity 50% for final result window.
    document.getElementById("divHeaderButtons").style.visibility = "hidden";
    document.getElementById("divHitStay").style.visibility = "hidden";
    setTimeout(appearFinalResultWindow, 1500); //add 1500ms time delay to appear the final result window
  }
}

//function for dealing one card for comuter
function computerTurn() {
  //as long as the computer is not bust and the player's score is greater than the computer's score 
  while (!computer.hasBusted() && player.currentScore > computer.currentScore) {
    randomNumber = ranNumGen(deck.length); //generate random number for computer's deal
    computer.dealtCardList.push(getDealtCard(randomNumber, deck)); //deal the card from deck by computer and store this string value
    removeCard(randomNumber, deck); //remove the dealt card from deck
    storeValues(getCardValue(computer.dealtCardList[computer.dealtCardCount]), computer); //storing the value of dealt.
    computer.dealtCardCount++; //computer dealt card count increment by 1.
    imageSetter(computer.dealtCardList[computer.dealtCardCount - 1], "imgCurrentCard"); //current dealt card set to <img id="imgCurrentCard"> 
    injectImage(computer.dealtCardList[computer.dealtCardCount - 1], "divComputerCards", "imgComputerCards"); //inject current image to <div id="divComputerCards"> as children 
    labelSetter("lblComputerScore", getScore(computer.dealtCardValueList, computer)); //set the current computer score to <span id="lblComputerScore"> 
    //add vertical scroll bar when inject 6 dealt cards to <div id="divComputerCards"> as childrens 
    if (computer.dealtCardCount == 6) {
      document.getElementById("divComputerCards").style.overflowY = "scroll";
    }
  }
  //If the computer is busted (computer score is higher than 21) 
  if (computer.hasBusted() == true) {
    labelSetter("lblFinalResult", "COMPUTER HAS BUSTED . . .<br>YOU WON. CONGRATULATIONS . . . !!!"); //set final result
    document.getElementById("divFinalResult").style.backgroundColor = "rgba(100,240,47,0.5)"; //set color "Red" with opacity 50% for final result window.
    document.getElementById("divHeaderButtons").style.visibility = "hidden";
    document.getElementById("divHeaderButtons").style.visibility = "hidden";
    document.getElementById("divHitStay").style.visibility = "hidden";
    setTimeout(appearFinalResultWindow, 1500); //add 1500ms time delay to appear the final result window
  }
  //If the computer is not busted and computer's score is equal to the player's score 
  if (computer.hasBusted() == false && computer.currentScore == player.currentScore) {
    labelSetter("lblFinalResult", "COMPUTER SCORED SAME SCORE . . .<br>YOU LOST . . . "); //set final result
    document.getElementById("divFinalResult").style.backgroundColor = "rgba(242,59,26,0.5)"; //set color "Red" with opacity 50% for final result window.
    document.getElementById("divHeaderButtons").style.visibility = "hidden";
    document.getElementById("divHitStay").style.visibility = "hidden";
    setTimeout(appearFinalResultWindow, 1500); //add 1500ms time delay to appear the final result window
  }
  //If the computer is not busted and computer's score is grater than to the player's score 
  if (computer.hasBusted() == false && computer.currentScore > player.currentScore) {
    labelSetter("lblFinalResult", "COMPUTER SCORED HIGHER THAN YOU . . .<br>YOU LOST . . . "); //set final result
    document.getElementById("divFinalResult").style.backgroundColor = "rgba(242,59,26,0.5)"; //set color "Red" with opacity 50% for final result window.
    document.getElementById("divHeaderButtons").style.visibility = "hidden";
    document.getElementById("divHitStay").style.visibility = "hidden";
    setTimeout(appearFinalResultWindow, 1500); //add 1500ms time delay to appear the final result window
  }
}

//function for appearing the Game rules window
function appearGameRulesWindow(e) {
  //if click the "btnBlackJackRules1" in Game intro window, execute the following if estatement only
  if (e.target.id == "btnBlackJackRules1") {
    document.getElementById("divIntroPage").style.display = "none";
    document.getElementById("divBlackJackRulesPage").style.display = "block";
    document.getElementById("imgBlackJackRules").setAttribute("src", "https://raw.githubusercontent.com/Prasadmadhusanka/blackjack-two-player-written-in-javascript/main/assets/Other_images/GameRule_CARDVALUES.png");
  }
  //if click the "btnBlackJackRules2" in Main game window, execute the following if estatement only
  if (e.target.id == "btnBlackJackRules2") {
    document.getElementById("divGamePage").style.display = "none";
    document.getElementById("btnPlayGame2").style.display = "none";
    document.getElementById("btnClose").style.display = "none";
    document.getElementById("btnResumeGame").style.display = "block";
    document.getElementById("divBlackJackRulesPage").style.display = "block";
    document.getElementById("imgBlackJackRules").setAttribute("src", "https://raw.githubusercontent.com/Prasadmadhusanka/blackjack-two-player-written-in-javascript/main/assets/Other_images/GameRule_CARDVALUES.png");
  }
  //add three button click event listners for Game rules window.
  document.getElementById("btnPlayGame2").addEventListener("click", appearGameWindow);
  document.getElementById("btnClose").addEventListener("click", appearIntroPage);
  document.getElementById("btnResumeGame").addEventListener("click", appearGameWindow);
  //add four button mouseover event listners for Game rules window.
  document.getElementById("btnCardValues").addEventListener("mouseover", gameRuleSetter);
  document.getElementById("btnPlayersTurn").addEventListener("mouseover", gameRuleSetter);
  document.getElementById("btnComputersTurn").addEventListener("mouseover", gameRuleSetter);
  document.getElementById("btnWinnerSelection").addEventListener("mouseover", gameRuleSetter);
}

//function for setting the PNG images to <img id="imgBlackJackRules"> in Game rules window
function gameRuleSetter(e) {
  switch (e.target.id) {
    case "btnCardValues":
      document.getElementById("imgBlackJackRules").setAttribute("src", "https://raw.githubusercontent.com/Prasadmadhusanka/blackjack-two-player-written-in-javascript/main/assets/Other_images//GameRule_CARDVALUES.png");
      break;
    case "btnPlayersTurn":
      document.getElementById("imgBlackJackRules").setAttribute("src", "https://raw.githubusercontent.com/Prasadmadhusanka/blackjack-two-player-written-in-javascript/main/assets/Other_images/GameRule_PLAYERSTURN.png");
      break;
    case "btnComputersTurn":
      document.getElementById("imgBlackJackRules").setAttribute("src", "https://raw.githubusercontent.com/Prasadmadhusanka/blackjack-two-player-written-in-javascript/main/assets/Other_images/GameRule_COMPUTERSTURN.png");
      break;
    case "btnWinnerSelection":
      document.getElementById("imgBlackJackRules").setAttribute("src", "https://raw.githubusercontent.com/Prasadmadhusanka/blackjack-two-player-written-in-javascript/main/assets/Other_images/GameRule_WINNERSELECTION.png");
      break;
  }
}

//function for appearing the Game intro window
function appearIntroPage(e) {
  //if click the "btnClose" in Game rules window, execute the following if estatement only
  if (e.target.id == "btnClose") {
    document.getElementById("divBlackJackRulesPage").style.display = "none";
    document.getElementById("divIntroPage").style.display = "flex";
  }
  //if click the "btnMainWindow" in Final result window, execute the following if estatement only
  if (e.target.id == "btnMainWindow") {
    newGame();
    document.getElementById("divGamePage").style.display = "none";
    document.getElementById("divFinalResult").style.display = "none";
    document.getElementById("divBJWelcome").style.visibility = "visible";
    document.getElementById("lblHint").style.visibility = "visible";
    document.getElementById("divIntroPage").style.display = "flex";
  }
}

//function for appearing the Final result window
function appearFinalResultWindow() {
  audioPlay("Final Result"); //play the audio for appearing the final result window 
  document.getElementById("divBJWelcome").style.visibility = "hidden";
  document.getElementById("divCurrentCard").style.visibility = "hidden";
  document.getElementById("divFinalResult").style.display = "block";
  //add two button click event listners for Final result window.
  document.getElementById("btnPlayAgain").addEventListener("click", appearGameWindow);
  document.getElementById("btnMainWindow").addEventListener("click", appearIntroPage);
}
