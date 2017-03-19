$(document).ready(function () {

// Global Variables
    var name,
        dest,
        time,
        freq;

// Initialize Firebase
    const config = {
        apiKey: "AIzaSyAKLnPNcYeNduFw4TOYkqbUr1mNoXvPLXg",
        authDomain: "rps-multi-bb0e5.firebaseapp.com",
        databaseURL: "https://rps-multi-bb0e5.firebaseio.com",
        storageBucket: "rps-multi-bb0e5.appspot.com",
        messagingSenderId: "153297396116"
    };
    firebase.initializeApp(config);

// define short variable name for database
    const db = firebase.database();

// Function to initialize inputs with blank values upon load
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
        name = childSnap.val().name,
            dest = childSnap.val().dest,
            time = childSnap.val().time,
            freq = childSnap.val().freq;

        // First Time (pushed back 1 year to make sure it comes before current time)
        let firstTimeConverted = moment(time, "hh:mm").subtract(1, "years");
        // Difference between the times
        let diffTime = moment().diff(moment(firstTimeConverted), "minutes");
        // Time apart (remainder)
        let tRemainder = diffTime % freq;
        // Minute Until Train
        let tMinutesTillTrain = freq - tRemainder;
        // Next Train - formatted for AM PM
        let nextTrain = moment().add(tMinutesTillTrain, 'minutes').format('hh:mm A');

        // take extracted values and report to table on page
        $('#train-display').append('<tr><td>' + name + '</td><td>' + dest + '</td><td>' + freq + '</td><td>' + nextTrain + '</td><td>' + tMinutesTillTrain + '</td></tr>')
    });


// Function to update train schedule based on values compared to current time
    function updatetable() {
        // variablize the schedule table
        var schedule = $('#train-display');

        // empty the train schedule table
        schedule.empty();

        // Database event listener for when a train child object is created
        db.ref('/trains').on('child_added', function (childSnap, prevChildKey) {
            // extract data from db record and store in variables
            name = childSnap.val().name,
                dest = childSnap.val().dest,
                time = childSnap.val().time,
                freq = childSnap.val().freq;
            // First Time (pushed back 1 year to make sure it comes before current time)
            let firstTimeConverted = moment(time, "hh:mm").subtract(1, "years");
            // Difference between the times
            let diffTime = moment().diff(moment(firstTimeConverted), "minutes");
            // Time apart (remainder)
            let tRemainder = diffTime % freq;
            // Minute Until Train
            let tMinutesTillTrain = freq - tRemainder;
            // Next Train - formatted for AM PM
            let nextTrain = moment().add(tMinutesTillTrain, 'minutes').format('hh:mm A');

            // take extracted values and report to table on page
            schedule.append('<tr><td>' + name + '</td><td>' + dest + '</td><td>' + freq + '</td><td>' + nextTrain + '</td><td>' + tMinutesTillTrain + '</td></tr>')
        });
    };

// Function that displays the current time to the 'clock' div
    function clockDisplay() {
        $('#clock').html(moment().format('hh:mm:ss A'));
    }

    // Function that starts the clock display to run every second
//  and table update every minute
    function start() {
        setInterval(clockDisplay, 1000);
        setInterval(updatetable, 60 * 1000)
    }

    start();
});// end of document ready