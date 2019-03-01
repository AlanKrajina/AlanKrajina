// cards variables declaration
let card = document.getElementsByClassName("card");
let cards = [...card];

// deck of all cards
const deck = document.getElementById("card-deck");

// move variables declaration
let moves = 0;
let counter = document.querySelector(".moves");

 // array for opened cards
let showDeck = [];

// time variables declaration
let time = 0;
let clockId;
let clockOff = true;

// game start onload and startGame function declaration
document.body.onload = startGame();

function startGame(){
    // remove all exisiting classes from each card
    for (var i = 0; i < cards.length; i++){
        deck.innerHTML = "";
        [].forEach.call(cards, function(item) {
            deck.appendChild(item);
        });
        cards[i].classList.remove("show", "open", "match", "disabled");
    }
    // setting moves to 0 on game start
    moves = 0;
    counter.innerHTML = moves;
}

// deck shuffling function
function shuffleDeck() {
  const cardsToShuffle = Array.from(document.querySelectorAll('.deck li'));
  const shuffledCards = shuffle(cardsToShuffle);
  for (card of shuffledCards) {
    deck.appendChild(card);
  }
} 
shuffleDeck();

// Fisher-Yates (aka Knuth) Shuffle
function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }
  return array;
}

 //declare variables for star icons
const stars = document.querySelectorAll(".fa-star");

// function to count player's moves
function moveCounter(){
    moves++;
    counter.innerHTML = moves;
    //start timer on first click
    if(moves == 1){
        second = 0;
        minute = 0; 
        startClock();
    }
    // setting rates based on moves 
    if (moves > 9 && moves < 11){
        for( i= 0; i < 3; i++){
            if(i > 1){
                stars[i].style.display = "none";
            }
        }
    }
    else if (moves > 14){
        for( i= 0; i < 3; i++){
            if(i > 0){
                stars[i].style.display = "none";
            }
        }
    } 
}

// clock and time functions
function startClock() {
    clockId = setInterval(() => {
        time++;
        displayTime();
    }, 1000);
}

function displayTime() {
    const clock = document.querySelector('.timer');
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;

    if (seconds < 10) {
        clock.innerHTML = `${minutes}:0${seconds}`;
    } else {
        clock.innerHTML = `${minutes}:${seconds}`;
    }
}

// functions for reseting the game, clock, moves and ratings
function resetGame() {
    resetClockAndTime();
    resetMoves(); 
    resetRatings();
    startGame();
    startClock()
}

function stopClock() {
    clearInterval(clockId);
}

function resetClockAndTime() {
    stopClock();
    clockOff = true;
    time = 0;
    displayTime();
}

function resetMoves() {
    let moves = 0;
    counter.innerHTML = moves;
}

function resetRatings(){
    for (var i= 0; i < stars.length; i++){
        stars[i].style.visibility = "visible";
    }
}

//  toggle function to open and show class to display cards
var openDeck = function (){
    this.classList.toggle("open");
    this.classList.toggle("show");
    this.classList.toggle("disabled");
};

// function to add opened cards to OpenedCards list and check if cards are match
function cardOpen() {
    showDeck.push(this);
    var len = showDeck.length;
    if(len === 2){
        moveCounter();
        if(showDeck[0].type === showDeck[1].type){
            matched();
        } else {
            unmatched();
        }
    }
};

// checking when cards match function
function matched(){
    showDeck[0].classList.add("match", "disabled");
    showDeck[1].classList.add("match", "disabled");
    showDeck[0].classList.remove("show", "open", "no-event");
    showDeck[1].classList.remove("show", "open", "no-event");
    showDeck = [];
}

// checking when cards do not match function
function unmatched(){
    showDeck[0].classList.add("unmatched");
    showDeck[1].classList.add("unmatched");
    disable();
    setTimeout(function(){
        showDeck[0].classList.remove("show", "open", "no-event","unmatched");
        showDeck[1].classList.remove("show", "open", "no-event","unmatched");
        enable();
        showDeck = [];
    },700);
}

// function for disabling cards temporarily
function disable(){
    Array.prototype.filter.call(cards, function(card){
        card.classList.add('disabled');
    });
}

// declaring variable of matchedCards
let matchedCard = document.getElementsByClassName("match");

// function to enable cards and disable matched cards
function enable(){
    Array.prototype.filter.call(cards, function(card){
        card.classList.remove('disabled');
        for(var i = 0; i < matchedCard.length; i++){
            matchedCard[i].classList.add("disabled");
        }
    });
}

// modal declaration
let modal = document.getElementById("win")

// winScreen popup
function gameOver(){
    if (matchedCard.length == 16){
        clearInterval(clockId);
        const clockTime = document.querySelector('.timer').innerHTML;
        // show winScreen modal
        modal.classList.add("show");
        // declare star rating variable
        var starRating = document.querySelector(".stars").innerHTML;
        //showing move, rating, time on modal
        document.getElementById("finalMove").innerHTML = moves;
        document.getElementById("starRating").innerHTML = starRating;
        document.getElementById("totalTime").innerHTML = clockTime;
    };
}

// function to reset game and play again
function playAgain(){
    modal.classList.remove("show");
    resetGame();
}

// loop to add function listeners on click 
for (var i = 0; i < cards.length; i++){
    card = cards[i];
    card.addEventListener("click", openDeck);
    card.addEventListener("click", cardOpen);
    card.addEventListener("click",gameOver);
};
