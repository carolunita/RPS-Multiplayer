// Initialize Firebase
var config = {
    apiKey: "AIzaSyDJfXOTSzGWNPTv44UkPFMFEj8bCIVbj1w",
    authDomain: "rps-game-38ddb.firebaseapp.com",
    databaseURL: "https://rps-game-38ddb.firebaseio.com",
    projectId: "rps-game-38ddb",
    storageBucket: "rps-game-38ddb.appspot.com",
    messagingSenderId: "471233302442"
};

firebase.initializeApp(config);
var database = firebase.database();

// Player 1 variables
var name1 = "";
var p1select = "";
var p1wins = 0;
var p1ties = 0;
var p1losses = 0;
var player1 = false;

// Player 2 variables
var name2 = "";
var p2select = "";
var p2wins = 0;
var p2ties = 0;
var p2losses = 0;
var player2 = false;

// Icon color assignments
var rock1 = "white";
var rock2 = "white";
var paper1 = "white";
var paper2 = "white";
var scissors1 = "white";
var scissors2 = "white";

// Chat variables
var chatarray = ["Chat with your opponent here!"];
var chatindex = 0;
var addchat = false;

// Detect page refresh and remove the player who left
$(window).on("unload", function() {
    if (player1 == true) {
       resetPlayerOne();
    }

    if (player2 == true) {
       resetPlayerTwo();
    }

    sendToDatabase();
});

// Default state: hide start button, selection menu, and scores
$("#name-form").show();
$("#p1select").hide();
$("#p1score").hide();
$("#p2select").hide();
$("#p2score").hide();

// Pull data from firebase
database.ref().on("value", function(snapshot) {
    console.log(snapshot.val());
    name1 = snapshot.val().name1;
    p1select = snapshot.val().p1select;
    p1wins = snapshot.val().p1wins;
    p1losses = snapshot.val().p1losses;
    p1ties = snapshot.val().p1ties;
    name2 = snapshot.val().name2;
    p2select = snapshot.val().p2select;
    p2wins = snapshot.val().p2wins;
    p2losses = snapshot.val().p2losses;
    p2ties = snapshot.val().p2ties;
    rock1 = snapshot.val().rock1;
    rock2 = snapshot.val().rock2;
    paper1 = snapshot.val().paper1;
    paper2 = snapshot.val().paper2;
    scissors1 = snapshot.val().scissors1;
    scissors2 = snapshot.val().scissors2;
    chatarray = snapshot.val().chatarray;
    chatindex = snapshot.val().chatindex;
    addchat = snapshot.val().addchat;

    updateScreen();
    updateScores();

    // Hide or display the start button depending on current players
    if ((name1 == "" && player2 != true) || (name2 == "" && player1 != true)) {
        $("#name-form").show();
    } else {
        $("#name-form").hide();
    }

    // Hide or display scores depending on current players
    if (name1 == "" && player2 == true) {
        $("#p1score").hide();
    } else if (name2 == "" && player1 == true) {
        $("#p2score").hide();
    }

    // Set icon colors
    $("#rock1").css("background-color", rock1);
    $("#rock2").css("background-color", rock2);
    $("#paper1").css("background-color", paper1);
    $("#paper2").css("background-color", paper2);
    $("#scissors1").css("background-color", scissors1);
    $("#scissors2").css("background-color", scissors2);

    // Populate chat
    if (addchat == true) {
        for (var i = chatindex; i < chatarray.length; i++) {
            // create new chat line and add user input
            var p = $("<p>");
            p.html(chatarray[i]);
            
            // append to chat and scroll to show latest entry
            $("#chat").append(p);
            $("#chat").animate({scrollTop: p.offset().top}, 500);
        }

        addchat = false;
    }
});

// Begin the game by adding your name
$("#add-name").on("click", function(event) {
    // prevents form from submitting
    event.preventDefault();

    // Grabs user input and trims excess spaces
    var name = $("#name-input").val().trim();

    if (name1 == "" && name2 == "") {
        name1 = name;
        player1 = true;

        // Announce that player 1 has joined
        var chat = "<b style='color: red'>" + name1 + " has joined the game.</b>";
        chatarray.push(chat);
        chatindex++;
        addchat = true;

    } else if (name1 != "" && name2 == "") {
        name2 = name;
        player2 = true;
        $("#name-form").hide();

        // Announce that player 2 has joined
        var chat = "<b style='color: blue'>" + name2 + " has joined the game.</b>";
        chatarray.push(chat);
        chatindex++;
        addchat = true;

    } else if (name1 == "" && name2 != "") {
        name1 = name;
        player1 = true;
        $("#name-form").hide();

        // Announce that player 1 has joined
        var chat = "<b style='color: red'>" + name1 + " has joined the game.</b>";
        chatarray.push(chat);
        chatindex++;
        addchat = true;

    } else {
        $("#name-form").hide();
    }

    sendToDatabase();
});

// Chat functionality
$("#send-chat").on("click", function(event) {
    // prevents form from submitting
    event.preventDefault();

    // Grabs user input and trims excess spaces
    var chat = $("#chat-input").val().trim();

     if (player1 == true) {
            chat = "<b style='color: red'>" + name1 + ":</b> " + chat;
        } else if (player2 == true) {
            chat = "<b style='color: blue'>" + name2 + ":</b> " + chat;
        } else {
            chat = chat;
        }

    chatarray.push(chat);
    chatindex++;
    addchat = true;

    // Clears user input
    $("#chat-form").each(function() {
        this.reset();
    });

    sendToDatabase();
});

// Selection of rock
$(".rock").on("click", function() {
    if (player1 == true && p1select == "") {
        p1select = "rock";
        rock1 = "red";
    } 

    if (player2 == true && p2select == "") {
        p2select = "rock";
        rock2 = "blue";
    } 

    sendToDatabase();
    showResult();
})

// Selection of paper
$(".paper").on("click", function() {
    if (player1 == true && p1select == "") {
        p1select = "paper";
        paper1 = "red";
    } 

    if (player2 == true && p2select == "") {
        p2select = "paper";
        paper2 = "blue";
    } 

    sendToDatabase();
    showResult();
})

// Selection of scissors
$(".scissors").on("click", function() {
    if (player1 == true && p1select == "") {
        p1select = "scissors";
        scissors1 = "red";
    } 

    if (player2 == true && p2select == "") {
        p2select = "scissors";
        scissors2 = "blue";
    } 

    sendToDatabase();
    showResult();
})

// End game
$("button").on("click", function() {
    // ensure name field input is empty
    $("#name-form").each(function() {
        this.reset();
    });

    // If player 1 quits
    if (player1 == true) {
        resetPlayerOne();
    } 

    // if player 2 quits
    if (player2 == true) {
        resetPlayerTwo();
    }

    sendToDatabase();
})

function resetPlayerOne() {
    // Announce that player 1 has left
    var chat = "<b style='color: red'>" + name1 + " has left the game.</b>";
    chatarray.push(chat);
    chatindex++;
    addchat = true;

    // Reset player 1
    $("#player1").text("Player 1");
    $("#result").text("Waiting on Player 1...");
    p1wins = 0;
    p1losses = 0;
    p1ties = 0;
    p1select = "";
    name1 = "";
    rock1 = "white";
    paper1 = "white";
    scissors1 = "white";
    $("#name-form").show();
    $("#p1select").hide();
    $("#p1score").hide();
}

function resetPlayerTwo() {
    // Announce that player 2 has left
    var p = $("<p>");
    var chat = "<b style='color: blue'>" + name2 + " has left the game.</b>";
    chatarray.push(chat);
    chatindex++;
    addchat = true;

    // Reset player 2
    $("#player2").text("Player 2");
    $("#result").text("Waiting on Player 2...");
    p2wins = 0;
    p2losses = 0;
    p2ties = 0;
    p2select = "";
    name2 = "";
    rock2 = "white";
    paper2 = "white";
    scissors2 = "white";
    $("#name-form").show();
    $("#p2select").hide();
    $("#p2score").hide();
}

// Allow players to make a selection
function runGame() {
    updateScores();

    if (player1 == true) {
        $("#p1select").show();
        $("#p2select").hide();
    } 

    if (player2 == true) {
        $("#p1select").hide();
        $("#p2select").show();
    }
}

// Send data to firebase
function sendToDatabase() {
    database.ref().set({
        name1: name1,
        p1select: p1select,
        p1wins: p1wins,
        p1losses: p1losses,
        p1ties: p1ties,
        name2: name2,
        p2select: p2select,
        p2wins: p2wins,
        p2losses: p2losses,
        p2ties: p2ties,
        rock1: rock1,
        rock2: rock2,
        paper1: paper1,
        paper2: paper2,
        scissors1: scissors1,
        scissors2: scissors2,
        chatarray: chatarray,
        chatindex: chatindex,
        addchat: addchat
    });
}

// Determine winner, show result, and reset for next turn
function showResult() {
    // show user selections in console
    console.log(p1select);
    console.log(p2select);

    // Once both users have selected, determine a winner
    if (p1select != "" && p2select != "") {
        if (p1select == p2select) {
            p1ties++;
            p2ties++;
            $("#result").text("It's a tie!");
        } else if (p1select == "rock" && p2select == "paper") {
            p1losses++;
            p2wins++;
            $("#result").text(name2 + " wins!");
            $("#middle").css("background-color", "blue");
        } else if (p1select == "rock" && p2select == "scissors") {
            p1wins++;
            p2losses++;
            $("#result").text(name1 + " wins!");
            $("#middle").css("background-color", "red");
        } else if (p1select == "paper" && p2select == "rock") {
            p1wins++;
            p2losses++;
            $("#result").text(name1 + " wins!");
            $("#middle").css("background-color", "red");
        } else if (p1select == "paper" && p2select == "scissors") {
            p1losses++;
            p2wins++;
            $("#result").text(name2 + " wins!");
            $("#middle").css("background-color", "blue");
        } else if (p1select == "scissors" && p2select == "rock") {
            p1losses++;
            p2wins++;
            $("#result").text(name2 + " wins!");
            $("#middle").css("background-color", "blue");
        } else if (p1select == "scissors" && p2select == "paper") {
            p1wins++;
            p2losses++;
            $("#result").text(name1 + " wins!");
            $("#middle").css("background-color", "red");
        } else {
            alert("Oops! Something went wrong!");
        }

        sendToDatabase();

        // Show player choices
        $("#p1select").show();
        $("#p2select").show();

        // Reset selections for next turn
        setTimeout(function() {
            $("#result").text("Waiting for players to choose!");
            $("#middle").css("background-color", "black");

            // Reset selections
            p1select = "";
            p2select = "";

            // Reset all background colors of icons
            rock1 = "white";
            rock2 = "white";
            paper1 = "white";
            paper2 = "white";
            scissors1 = "white";
            scissors2 = "white";

            sendToDatabase();
            runGame();
        }, 2000);
    }
}

// Display scores
function updateScores() {
    // Updating scores
    $("#p1score").html("<b>Wins:</b> " + p1wins + ", <b>Ties:</b> " + p1ties + ", <b>Losses:</b> " + p1losses);
    $("#p2score").html("<b>Wins:</b> " + p2wins + ", <b>Ties:</b> " + p2ties + ", <b>Losses:</b> " + p2losses);
}

// Display player names
function updateScreen() {
    // Displaying player names and status
    if (name1 == "" && name2 == "") {
        $("#result").text("Waiting on Player 1 and Player 2...");
        $("#player1").text("Player 1");
        $("#player2").text("Player 2");
    } else if (name1 != "" && name2 == "") {
        $("#result").text("Waiting on Player 2...");
        $("#player1").text(name1);
        $("#p1score").show();
        $("#player2").text("Player 2");
    } else if (name1 == "" && name2 != "") {
        $("#result").text("Waiting on Player 1...");
        $("#player1").text("Player 1");
        $("#player2").text(name2);
        $("#p2score").show();
    } else if (name1 != "" && name2 != "" && p1select == "" && p2select == "") {
        $("#result").text("Waiting for players to choose!");
        $("#player1").text(name1);
        $("#p1score").show();
        $("#player2").text(name2);
        $("#p2score").show();
        runGame();
    } else if (name1 != "" && name2 != "") {
        $("#player1").text(name1);
        $("#p1score").show();
        $("#player2").text(name2);
        $("#p2score").show();
        runGame();
    } else {
        alert("Oops! Something went wrong!");
    }
}