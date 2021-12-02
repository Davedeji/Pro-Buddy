// Retrieve and display checkin data from user doc
function displayCards(collection) {
    let CardTemplate = document.getElementById("CardTemplate");
    firebase.auth().onAuthStateChanged(user => {
      // check if user is signed in
      if (user) {
        db.collection("checkin").where("User", "==", user.uid) 
          .get().then(snap => {
            snap.forEach(doc => {
              
              var description = doc.data().Notes;
              var date = doc.data().Time.toDate().toDateString();
              let newcard = CardTemplate.content.cloneNode(true);

              //update title and text and image
              newcard.querySelector('#uploadDate').innerHTML = date;
              newcard.querySelector('#uploadDescription').innerHTML = description;

              //attach to gallery
              document.getElementById("uploads-go-here").appendChild(newcard);
            })
          })
      }
    })
  }
  displayCards();