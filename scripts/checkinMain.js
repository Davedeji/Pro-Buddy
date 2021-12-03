// function for user checkin processs
function checkIn() {
  // Notes firebase document
    let Notes = document.getElementById("comment").value;
    //check if user is logged in
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        // if user is logged in, find the user by uid.
        var currentUser = db.collection("users").doc(user.uid);
        var userID = user.uid;
        //get the document for current user.
        currentUser.get().then((userDoc) => {
          // Start a new collection and add all data in it.
          db.collection("checkin").add({
            // any notes that the user chose to comment
            Notes: Notes,
            // linking the checkin with useriD
            User: userID,
            // automatically using firebase builtin to record time of checkin
            Time: firebase.firestore.Timestamp.now(),
            // redirct page to checkinComplete
          }).then(() => { window.location = "/html/checkinComplete.html" });
        });
      }
    });

  }