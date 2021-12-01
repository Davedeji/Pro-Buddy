function CHECKIN() {
    let Notes = document.getElementById("comment").value;

    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        var currentUser = db.collection("users").doc(user.uid);
        var userID = user.uid;
        //get the document for current user.
        currentUser.get().then((userDoc) => {
          // Start a new collection and add all data in it.
          db.collection("checkin").add({
            Notes: Notes,
            User: userID,
            Time: firebase.firestore.Timestamp.now(),
          }).then(() => { window.location = "/checkin_complete.html" });
        });
      }
    });

  }