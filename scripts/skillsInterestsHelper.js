//creating card to populate interests
function createCard(title, id, imageLink) {
  return `<div class="col mb-4">
                    <div class="card" id="card-${id}">
                        <img src=${imageLink} class="card-img-top" alt="..." />
                        <div class="card-body">
                            <h5 class="card-title stretched-link">${title}</h5>
                        </div>
                    </div>
            </div>`;
}
// function to return boolean values if card is selected
function cardsSelected(firestoreDocID) {
  // declare selectedSkills
  var selectedSkills = {};
  // default boolean value set to false
  document.querySelectorAll(".card").forEach((item) => {
    selectedSkills[item.id] = false;
  });
  // if card is selected, value returns true
  document.querySelectorAll(".card.selected").forEach((item) => {
    selectedSkills[item.id] = true;
  });
  console.log(selectedSkills);
  // save values to firestore
  continueClicked(selectedSkills, firestoreDocID);
}

// retrieve the cards selected based on user
function retrieveSelectedCards(firestoreDocID) {
  // get the choices for the user that is logged in
  var user = firebase.auth().currentUser;

  firebase.auth().onAuthStateChanged((userN) => {
    if (userN) {
      console.log("retrieveing doc");
      // retrieve documents for the current user based on uid on their selection
      var docRef = db
        .collection("users")
        .doc(userN.uid)
        .collection("userChoices")
        .doc(firestoreDocID);

      docRef
        .get()
        .then((doc) => {
          // check if there are current documents for choices, if it exists:
          if (doc.exists) {
            console.log("Document data:", doc.data());
            // if doc.data().
            const cards = doc.data();

            for (var field in doc.data()) {
              console.log(field);
              console.log(cards[field]);
              // toggle the setting to display as a selected card
              if (cards[field]) {
                var elem = document.getElementById(field);
                elem.classList.toggle("selected");
                console.log("card selected");
              }
            }
          } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
          }
        })
        .catch((error) => {
          console.log("Error getting document:", error);
        });
    } else {
      // User is signed out.
      window.location.assign("login.html");
    }
  });
}

function continueClicked(data, firestoreDocID) {
  var user = firebase.auth().currentUser;
  // if user is logged in
  firebase.auth().onAuthStateChanged((userN) => {
    if (userN) {
      db.collection("users")
        .doc(userN.uid)
        .collection("userChoices")
        .doc(firestoreDocID)
        .set(data)
        .then(() => {
          console.log("Document successfully written!");
        })
        .catch((error) => {
          console.error("Error writing document: ", error);
        });

      for (key in data) {
        console.log(key.replace("card-", ""));
        const keyString = key.replace("card-", "");
        var docRef = db.collection(firestoreDocID).doc(keyString);
        if (data[key]) {
          //check if data value is true
          docRef
            .set(
              {
                userID: firebase.firestore.FieldValue.arrayUnion(user.uid),
              },
              {
                merge: true,
              }
            )
            .then(() => {
              switchPage(firestoreDocID);
            });
        } else {
          docRef
            .set(
              {
                userID: firebase.firestore.FieldValue.arrayRemove(user.uid),
              },
              {
                merge: true,
              }
            )
            .then(() => {
              switchPage(firestoreDocID);
            });
        }
      }
    } else {
      // User is signed out.
      window.location.assign("login.html");
    }
  });
}
function switchPage(firestoreDocID) {
  console.log("firID:", firestoreDocID);
  if (firestoreDocID == "interests") {
    console.log("switch page");
    window.location.assign("chooseSkills.html");
  }
  if (firestoreDocID == "skills") {
    window.location.assign("main.html");
  }
}
