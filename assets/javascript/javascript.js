$(document).ready()
// Initialize Firebase
    var config = {
        apiKey: "AIzaSyD6MJoIPaw97Dt86l0HMHZwVH_NYaKrFHg",
        authDomain: "train-scheduler-3e2fd.firebaseapp.com",
        databaseURL: "https://train-scheduler-3e2fd.firebaseio.com",
        projectId: "train-scheduler-3e2fd",
        storageBucket: "train-scheduler-3e2fd.appspot.com",
        messagingSenderId: "835655752517"
    };
    firebase.initializeApp(config);
    var database = firebase.database();

    $("#add-train").on("click", function(event) {
        event.preventDefault();
        // Save our user inputs into variables
        var trainName = $("#name-input").val().trim();
        var destination = $("#destination-input").val().trim();
        var frequency = $("#frequency-input").val().trim();
        var trainTime = $("#time-input").val().trim();

        // Store our 4 variables into the object completeTrainInfo
        var completeTrainInfo = {
            name: trainName,
            destination: destination,
            time: trainTime,
            frequency: frequency,
        };
        // Log the 4 variables to the console
        console.log(completeTrainInfo.name);
        console.log(completeTrainInfo.destination);
        console.log(completeTrainInfo.time);
        console.log(completeTrainInfo.frequency);
        // Push our variables onto firebase using the .push method which is used instead of .set because we want a new entry to save for each train rather than overwriting the same one
        database.ref().push(completeTrainInfo);
    });
    // Anytime the page is loaded or a new train is added we want to update all the trains using the firebase database.
    database.ref().on("child_added", function(childSnapshot) {
        console.log(childSnapshot.val());
        // Store firebase data into these variables
        var trainName = childSnapshot.val().name;
        var destination = childSnapshot.val().destination;
        var frequency = childSnapshot.val().frequency;

        // Use moment.js to find the time of nextTrain variable. Start by pulling the snapshot of the traintime data we saved to firebase earlier
        var trainTime = childSnapshot.val().time;
        // First Time (pushed back 1 year to make sure it comes before the current time)
        var firstTimeConverted = moment(trainTime, "h:mm A").subtract(1, "years");
        console.log(firstTimeConverted);
        // Current Time in hours and minutes format
        var currentTime = moment();
        console.log("CURRENT TIME: " + moment(currentTime).format("h:mm A"));
        // Difference between the times
        var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
        console.log("DIFFERENCE IN TIME: " + diffTime);
        // Time apart (remainder)
        var tRemainder = diffTime % frequency;
        console.log(tRemainder);
        // Minute Until Train
        var tMinutesTillTrain = frequency - tRemainder;
        console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);
        // Next Train
        var nextTrain = moment().add(tMinutesTillTrain, "minutes");
        console.log("ARRIVAL TIME: " + moment(nextTrain).format("h:mm A"));
        // Make the nextTrain variable in the hh:mm format
        var nextTrain = moment(nextTrain).format("h:mm A");

        //console our 5 variables to be displayed for each entry in our train schedule
        console.log(trainName);
        console.log(destination);
        console.log(frequency);
        console.log(nextTrain);
        console.log(tMinutesTillTrain);
        //append our variables into the schedule in our html and add the elements to be pushed into the chart's body for proper formatting using "#display"

        // If / Else statements convert minutes into hours and minutes for frequency and time until arrival
        var hours = Math.floor(tMinutesTillTrain / 60);
        var minutes = tMinutesTillTrain % 60;

        if (tMinutesTillTrain > 59) {
            var convertTime = hours + " hours " + minutes + " minutes";
        } 
        else {
            var convertTime = minutes + " minutes";
        }

        var hours = Math.floor(frequency / 60);
        var minutes = frequency % 60;

        if (frequency > 59) {
            var convertFrequency = "Every " + hours + " hours " + minutes + " minutes";
        } 
        else {
            var convertFrequency = "Every " + minutes + " minutes";
        }

        $("#display").append("<tr><td>" + trainName + "</td><td>" + destination + "</td><td>" +
            convertFrequency + "</td><td>" + nextTrain + "</td><td>" + convertTime + "</td></tr>");

        //clear out the add a train inputs
        $("#name-input").val("");
        $("#destination-input").val("");
        $("#time-input").val("");
        $("#frequency-input").val("");

    });

