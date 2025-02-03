// Here I'm declaring that I need the module prompt to get the userChoice through the console
var prompt = require('prompt');

prompt.start();

// This function is for asking for an user input (userChoice) and check if it is valid

function askUserChoice() {
    // Here I'm asking to the user to choice an option between Rock, Paper or Scissors
    prompt.get(["Please choose your option: Rock, Paper or Scissors"], function (err, result) {
        const userChoice = result["Please choose your option: Rock, Paper or Scissors"];
        
        if (['Rock', 'Paper', 'Scissors'].includes(userChoice)) {
            console.log("User choice: " + userChoice);
            // If the userChoice is valid I'll call the method to get the computerChoice
            const computerChoice = askComputerChoice();
            // After to get the computerChoice I'll call the method to determine who is the Winner
            determineWinner(userChoice, computerChoice);
        } else {
            console.log('Please choose an option between: "Rock", "Paper" or "Scissors".');
            askUserChoice();
        }
    });
}

// This function is getting a choice from the computer (computerChoice) according to the values of a Random number

function askComputerChoice() {
    let randomValue = Math.random();
    let computerChoice;

    if (randomValue <= 0.34) {
        computerChoice = "Paper";
    } else if (randomValue <= 0.67) {
        computerChoice = "Scissors";
    } else {
        computerChoice = "Rock";
    }

    console.log("Computer Choice: " + computerChoice);
    return computerChoice;
}

// This function is for checking who is the winner comparing the userChoice and computerChoice

function determineWinner(userChoice, computerChoice) {
    if (userChoice === computerChoice) {
        console.log("It's a tie!");
    } else if (
        (userChoice === 'Rock' && computerChoice === 'Scissors') ||
        (userChoice === 'Scissors' && computerChoice === 'Paper') ||
        (userChoice === 'Paper' && computerChoice === 'Rock')
    ) {
        console.log("You win!");
    } else {
        console.log("Computer wins!");
    }
}

// Here I'm calling the principal function to start the application

askUserChoice();