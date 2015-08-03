/********************Requires********************/
var UI = require('ui');
var Vector2 = require('vector2');
var Accel = require('ui/accel');
var Vibe = require('ui/vibe');

//prepare the accelerometer
Accel.init();

/********************Local Storage********************/
//attempt to retrieve local storage value
var saved_high_score = localStorage.getItem("brain_tuner_high_score");
//if saved high score is not set, create it
if (saved_high_score === null) {
  //create save data for high score
  saved_high_score = "0";
  localStorage.setItem("brain_tuner_high_score", saved_high_score);
}
//convert saved string to integer
saved_high_score = parseInt(saved_high_score);

/********************Splash Windows********************/
//Create the starting screen
var splashScreen = new UI.Window({
  fullscreen: true,
});

//Create the end screen
var endScreen = new UI.Window({
  fullscreen: true,
});

//Create the background color for the splash screen
var background = new UI.Text({
  position: new Vector2(0, 0),
  size: new Vector2(144, 168),
  text:'',
  backgroundColor:'melon'
});

//Create a text element for the splash screen
var splashText = new UI.Text({
  position: new Vector2(0, 45),
  size: new Vector2(144, 88),
  text:'Brain Trainer',
  font:'BITHAM_30_BLACK',
  color:'black',
  textOverflow:'wrap',
  textAlign: 'center',
  backgroundColor:'melon'
});

//Create a text element for the end screen
var endTextTop = new UI.Text({
  position: new Vector2(0, 5),
  size: new Vector2(144, 168),
  text:'Game Over!',
  font:'BITHAM_30_BLACK',
  color:'black',
  textOverflow:'wrap',
  textAlign: 'center',
  backgroundColor:'melon'
});
var endTextLeft = new UI.Text({
  position: new Vector2(25, 67),
  size: new Vector2(62, 101),
  text:'Right:\nWrong:\nScore:',
  font:'GOTHIC_24_BOLD',
  color:'black',
  textOverflow:'wrap',
  textAlign: 'left',
  backgroundColor:'melon'
});
var endTextRight = new UI.Text({
  position: new Vector2(77, 67),
  size: new Vector2(37, 101),
  text:'',
  font:'GOTHIC_24_BOLD',
  color:'black',
  textOverflow:'wrap',
  textAlign: 'right',
  backgroundColor:'melon'
});
var endTextCenter = new UI.Text({
  position: new Vector2(0, 140),
  size: new Vector2(144, 28),
  text:'',
  font:'GOTHIC_24_BOLD',
  color:'black',
  textOverflow:'wrap',
  textAlign: 'center',
  backgroundColor:'melon'
});

//add text to the splash screen and display it
splashScreen.add(background);
splashScreen.add(splashText);
splashScreen.show();

//Create the action screen
var playWindow = new UI.Window({
  fullscreen: true,
  action: {
    up: 'images/white_check.png',
    down: 'images/white_x.png',
    select: '',
    backgroundColor: 'folly'
  }
});

var equationText = new UI.Text({
  position: new Vector2(0, 60),
  size: new Vector2(115, 40),
  text:'',
  font:'GOTHIC_24_BOLD',
  color:'black',
  textOverflow:'wrap',
  textAlign: 'center',
  backgroundColor:'melon'
});

//add the background to the play window and display it, hiding the splash screen
playWindow.add(background);
playWindow.add(equationText);
playWindow.show();
splashScreen.hide();

//Add functionality to the play window
playWindow.on('click', 'up', function(e) {
	checkAnswer('up');
});
playWindow.on('click', 'down', function(e) {
	checkAnswer('down');
});

/********************Main Code********************/
//initialize game variables before letting game_init() set them
var right;
var wrong;
var stop;
var int1;
var int2;
var int3;
var iSymb;
var sSymb;
var randError;
var sEqtn;
var answer;
var game_over;

//set acceleration function to reload the game
endScreen.on('accelTap', function(e) {
  //only vibrate and reload the game if the game is over
  if (game_over === true) {
    //vibrate
    Vibe.vibrate('short');
    
    playWindow.add(background);
    playWindow.add(equationText);
    playWindow.show();
    endScreen.hide();
    
    //reload the game
    game_init();
    loadEqn();
  }
});

//initialize game
game_init();

//start the game
loadEqn();

function game_init() {
  //set game_over to false when game is playing
  game_over = false;
  
  //initialize variables to count the number of right and wrong questions
  right = 0;
  wrong = 0;
  
  //initialize boolean to determine if the timer has expired
  stop = false;
  
  //set timer for 30 seconds to terminate the questions after the timer expires
  setTimeout(function() {
    stop = true;
    end();
  }, 30000);
  
  //initialize global variables to use in the equation function
  int1 = 0;
  int2 = 0;
  int3 = 0;
  iSymb = 0;
  sSymb = "";
  randError = 0;
  sEqtn = "";
  answer = "";
}

//function to load equations
function loadEqn() {
	//randomize integers between 1 and 20 for the equations
	int1 = Math.floor( Math.random() * 20 + 1);
	int2 = Math.floor( Math.random() * 20 + 1);
	//random integer to determine addition or subtraction
	iSymb = Math.floor( Math.random() * 2 + 1);
	//initialize whether or not to display the correct or incorrect answer
	randError = Math.floor( Math.random() * 50 + 1);
	
	//set addition or subtraction symbol, and set the answer to the equation to int3
	if (iSymb == 1) {
		int3 = int1 + int2;
		sSymb = '+';
	} else {
		int3 = int1 - int2;
		sSymb = '-';
	}
	
  //adjust the answer based off of randError
  if (randError <= 1) {
    int3 *= -1;
  } else if (randError <= 4) {
    int3 -= 10;
  } else if (randError <= 7) {
    int3 += 10;
  } else if (randError <= 11) {
    int3 -= 2;
  } else if (randError <= 15) {
    int3 += 2;
  } else if (randError <= 20) {
    int3--;
  } else if (randError <= 25) {
    int3++;
  }
  
	//construct the equation string
	sEqtn = int1 + ' ' + sSymb + ' ' + int2 + ' = ' + int3;
	
	//remove play window equation text
	playWindow.remove(equationText);
	
	//add the equation string to the window
	equationText.text(sEqtn);
	
	//display equation on the play window
	playWindow.add(equationText);
}

function checkAnswer(btn) {
	if (btn == 'up') {
		//set variable answer and adjust right and wrong
		if (randError > 25) {
			answer = 'Yes!';
			right++;
		} else {
			answer = 'No!';
			wrong++;
		}
	} else {
		//set variable answer and adjust right and wrong
		if (randError > 25) {
			answer = 'No!';
			wrong++;
		} else {
			answer = 'Yes!';
			right++;
		}
	}
	
	//remove equation from the window
	playWindow.remove(equationText);
	
	//modify the equation window text to yes or no
	equationText.text(answer);
	
	//add the response to the user to the window (yes or no)
	playWindow.add(equationText);
	
	//check if the 30 second timer has tripped
	if (stop) {
		//if tripped, load end screen
		end();
	} else {
		//if not tripped, display another equation after pausing on the current screen
		setTimeout(loadEqn, 800);
	}
}

function end() {
  //update game_over boolean
  game_over = true;
  
  //calculate score based off of right and wrong answers
  var score = right - wrong;
  
  //save high score if its new
  if (parseInt(saved_high_score) < score) {
    saved_high_score = score.toString();
    localStorage.setItem("brain_tuner_high_score", saved_high_score);
    //set center end text to show that the player got the high score
    endTextCenter.text('New High Score!');
  } else {
    //set center end text to display saved high score
    endTextCenter.text('High Score: ' + saved_high_score);
  }
  
  //set the end right text
  endTextRight.text(right + '\n' + wrong + '\n' + score);
  
  //display end game text
  endScreen.add(background);
  endScreen.add(endTextTop);
  endScreen.add(endTextLeft);
  endScreen.add(endTextRight);
  endScreen.add(endTextCenter);
  endScreen.show();
  playWindow.hide();
}
