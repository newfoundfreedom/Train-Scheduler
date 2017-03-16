// Initialize Firebase
var config = {
    apiKey: "AIzaSyAKLnPNcYeNduFw4TOYkqbUr1mNoXvPLXg",
    authDomain: "rps-multi-bb0e5.firebaseapp.com",
    databaseURL: "https://rps-multi-bb0e5.firebaseio.com",
    storageBucket: "rps-multi-bb0e5.appspot.com",
    messagingSenderId: "153297396116"
};
firebase.initializeApp(config);

var db = firebase.database();


// Initialize inputs with blank values upon load
function clearInputs() {
    $('#train-name-input').val("");
    $('#destination-input').val("");
    $('#train-time-input').val("");
    $('#train-frequency').val("");
}

// Submit button click listener - when user clicks submit
$('#add-btn').on('click', function () {
    // prevent default action of form submission
    event.preventDefault();

    // collect input values from user and push those to the database in a new train child object
    db.ref('/trains').push({
        name: $('#train-name-input').val().trim(),
        dest: $('#destination-input').val().trim(),
        time: $('#train-time-input').val().trim(),
        freq: $('#train-frequency').val().trim()
    });

    // clear all values from input fields - blanking them back out
    clearInputs();
});

// Database event listener for when a train child object is created
db.ref('/trains').on('child_added', function (childSnap, prevChildKey) {

    // extract data from db record and store in variables
    var name = childSnap.val().name,
        dest = childSnap.val().dest,
        time = childSnap.val().time,
        freq = childSnap.val().freq;

    // calculate time of next train based on current time
    var next = moment(time, "HH:mm").subtract(1, "years");
    console.log(next);
    var currentTime = moment();
    console.log("CURRENT TIME: " + moment(currentTime).format("HH:mm"))


    // take extracted values and report to table on page
    $('#train-display').append('<tr><td>'+name+'</td><td>'+dest+'</td><td>'+freq+'</td><td>'+currentTime+'</td><td>'+time+'</td></tr>')
});

clearInputs();