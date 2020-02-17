// cards variables declaration
let card = document.getElementsByClassName("card");
let cards = [...card];

// deck of all cards
const deck = document.getElementById("cardDeck");

// move variables declaration
let moves = 0;
let counter = document.querySelector(".moves");

 // array for opened cards
let displayDeck = [];

// time variables declaration
let time = 0;
let clockId;
let clockOff = true;

// game start onload and startGame function declaration
document.body.onload = startGame();

function startGame(){
    // remove all exisiting classes from each card
    for (let i = 0; i < cards.length; i++){
        deck.innerHTML = "";
        [].forEach.call(cards, function(item) {    // Array.prototype.forEach.call(...); 
                                    // Take the forEach function from Array.prototype and call it on cards, which is a non-Array object, with function as its argument with item = card.
       // cards.forEach(item =>  {...}  
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
  let currentIndex = array.length, temporaryValue, randomIndex;

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
let stars = document.querySelectorAll(".fa-star");

// function to count player's moves
function counterMoves(){
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
                stars[i].classList.add('hide');
            }
        }
    }
    else if (moves > 14){
        for( i= 0; i < 3; i++){
            if(i > 0){
                stars[i].classList.add('hide');
            }
        }
    } 
}

// function to add opened cards to OpenedCards list and check if cards are match
function cardOpen() {
    displayDeck.push(this);
                            // this -> li.card.open.show.disabled
                            // displayDeck -> array, length: 1,2
    let len = displayDeck.length;
    if(len === 2){
        counterMoves();
        if(displayDeck[0].type === displayDeck[1].type && displayDeck[0] !== displayDeck[1]){
                            // type: "bolt"
                            // type: "leaf"
            matched();
        } else {
            unmatched();
        }
    }
};

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
    for (let i= 0; i < stars.length; i++){
        stars[i].classList.remove('hide');
    }
}

//  toggle function to open and show class to display cards
let openDeck = function (){
    this.classList.toggle("open");
    this.classList.toggle("show");
    this.classList.toggle("disabled");
};

// checking when cards match function
function matched(){
    displayDeck[0].classList.add("match", "disabled");
    displayDeck[1].classList.add("match", "disabled");
    displayDeck[0].classList.remove("show", "open", "no-event");
    displayDeck[1].classList.remove("show", "open", "no-event");
    displayDeck = [];
}

// checking when cards do not match function
function unmatched(){
    displayDeck[0].classList.add("unmatched");
    displayDeck[1].classList.add("unmatched");
    disable();
    setTimeout(function(){
        displayDeck[0].classList.remove("show", "open", "no-event","unmatched");
        displayDeck[1].classList.remove("show", "open", "no-event","unmatched");
        enable();
        displayDeck = [];
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
        for(let i = 0; i < matchedCard.length; i++){
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
        let starRating = document.querySelector(".stars").innerHTML;
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
for (let i = 0; i < cards.length; i++){
    card = cards[i];
    card.addEventListener("click", openDeck);
    card.addEventListener("click", cardOpen);
    card.addEventListener("click",gameOver);
};
