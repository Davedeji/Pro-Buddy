// Display all uploads retrieved from database
function displayCards(collection) {
  let CardTemplate = document.getElementById("CardTemplate");
  // check if current user is signed in
  firebase.auth().onAuthStateChanged(user => {
    if (user) {
      // query through uploads collection to get current user's uploads
      db.collection("uploads").where("ID", "==", user.uid)
        .get().then(snap => {
          // read data of all uploads that meet query specification
          snap.forEach(doc => {
            var title = doc.data().title;
            var description = doc.data().description;
            var date = doc.data().date.toDate().toDateString();
            var download = doc.data().download;
            // create a card using existing template
            let newcard = CardTemplate.content.cloneNode(true);

            // insert data into card
            newcard.querySelector('.card-title').innerHTML = title;
            newcard.querySelector('#uploadDate').innerHTML = date;
            newcard.querySelector('#uploadDescription').innerHTML = description;
            newcard.querySelector('.btn').setAttribute("href", download);

            //attach to container
            document.getElementById("uploads-go-here").appendChild(newcard);
          })
        })
    }
  })
}
displayCards();