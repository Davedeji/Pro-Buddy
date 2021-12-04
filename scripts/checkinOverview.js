// Retrieve and display checkin data from user doc
function displayCards(collection) {
  let CardTemplate = document.getElementById("CardTemplate");
  firebase.auth().onAuthStateChanged((user) => {
    // check if user is signed in
    if (user) {
      // get the checkin collection based on the users uid
      db.collection("checkin")
        .where("User", "==", user.uid)
        .get()
        .then((snap) => {
          snap.forEach((doc) => {
            // for each document get the notes written
            var description = doc.data().Notes;
            // return the date time stamp in a nice format for the users to read
            var date = doc.data().Time.toDate().toDateString();
            // produce a new card template for each checkin
            let newcard = CardTemplate.content.cloneNode(true);

            //update title and text and image
            newcard.querySelector("#uploadDate").innerHTML = date;
            newcard.querySelector("#uploadDescription").innerHTML = description;

            //attach to gallery
            document.getElementById("uploads-go-here").appendChild(newcard);
          });
        });
    }
  });
}
displayCards();
