//when the document loads, run all the stuff inside here
document.addEventListener('DOMContentLoaded', () => {
    //just declaring/initializing stuff here
    let hasFlippedCard = false; 
    let lockBoard = false; 
    let firstCard, secondCard; 
    const score = document.querySelector('#score');
    var cardsMatched = [];
    var audio = new Audio('sound.mp3');
    var count = 0;
    const fruits = ["avocado","watermellon","grapes","kiwi","pineapple","cherry","apple","bananna","blueberry","orange"];
    var music = new Audio('music.mp3');
    music.loop = true;
    var gong = new Audio("gong.mp3");

    /* This is a cascading for loop system I created which basically 
       condenses the code I would need to write in the index.html document.
       
       These for loops sets up all the cards on the board which get accessed later on */
    for(var i = 1; i <= 10; i++){
        for(var j = 1; j <=2; j++){
            var newDiv = document.createElement("div");
            newDiv.setAttribute('class', "memory-card")
            newDiv.setAttribute('data-id', i);

            var card = document.createElement("img");
            card.setAttribute('class',"front-face");
            card.setAttribute('src', "./img/" + i +".png");
            card.setAttribute('alt', fruits[i-1]);
            newDiv.appendChild(card);

            var placeholder = document.createElement("img");
            placeholder.setAttribute('class',"back-face");
            placeholder.setAttribute('src', "./img/placeholder.png");
            placeholder.setAttribute('alt',"placeholder");
            newDiv.appendChild(placeholder);

            document.getElementById("memory-game").appendChild(newDiv);
        }
    }

    /* searches for all elements with the memory-card class inside of the document (the things made by the for loops)
       and throws them into a card array which gets used next on line 109*/
    const cards = document.querySelectorAll('.memory-card'); 
    
    /*This function is the first one to run and basically, once any card is clicked, it will run.
      It's main roles are making sure the music is playing for the background audio, the card flip sounds,
      updating the score/number of attempts, and calling the checkForMatch function */
    function flipCard() {
       music.play();  
       if (lockBoard) return; 
       if (this === firstCard) return; 
        
       this.classList.add('flip');
       audio.play();

       if (!hasFlippedCard) {
        hasFlippedCard = true;
        firstCard = this; 
  
        return; 
      }
  
      secondCard = this; 
      score.textContent++;
      checkForMatch(); 
    }
    /*This function is ran after the flip card function runs. It is responsible for checking if
        The two selected cards are a match. If it IS a match then disableCards function runs. If it IS NOT a match,
        then unflipCards function runs*/
    function checkForMatch() {
      let isMatch = firstCard.dataset.id === secondCard.dataset.id; 
      isMatch ? disableCards() : unflipCards(); 
    }
    /*This function is in charge of removing the event listener from the cards that are identified matches
    since we no longer need to be clicking on them. Also it contains a counter which increments each time a match
    is found.*/
    function disableCards() {
      
      firstCard.removeEventListener('click', flipCard); 
      secondCard.removeEventListener('click', flipCard);
      cardsMatched.push(firstCard);
      cardsMatched.push(secondCard);
      count++;
      // if the count reaches 10, then that means all matches were found so run the endgame stuff
      if (count >= 10){
        document.getElementById("message").innerHTML = "\nCongratulations! You found all the pairs!";
        music.pause();
        gong.play();
      }
      resetBoard(); 
    }
    /*This function is incharge of reversing the flip process and is ran when the cards are NOT a match.
        so basically, you look at the cards, see they don't match, and then this function runs flipping them back*/
    function unflipCards() {
      lockBoard = true; 
  
      setTimeout(() => {
        firstCard.classList.remove('flip'); 
        secondCard.classList.remove('flip'); 
        
        resetBoard(); 
      }, 500); 
    }
    
    // This function simply resets the boolean and card containers
    function resetBoard() {
      [hasFlippedCard, lockBoard] = [false, false]; 
      [firstCard, secondCard] = [null, null]; 
    }
    
    // This function is in charge of randomizing the card positions so every game is unique :D
    (function shuffle() {
      cards.forEach(card => {
        let randomPos = Math.floor(Math.random() * 20); 
        card.style.order = randomPos; 
      }) 
    })() 
    /* This line of code goes through the card array and adds event listeners for each card so when clicked,
     run the flipcard function */
    cards.forEach(card => card.addEventListener('click', flipCard));
  
  })