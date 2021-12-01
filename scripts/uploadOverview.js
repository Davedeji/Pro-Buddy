function displayCards(collection) {
    let CardTemplate = document.getElementById("CardTemplate");

    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        db.collection("uploads").where("ID", "==", user.uid)
          .get().then(snap => {
            snap.forEach(doc => {
              var title = doc.data().title;
              var description = doc.data().description;
              var date = doc.data().date.toDate().toDateString();
              var download = doc.data().download;
              let newcard = CardTemplate.content.cloneNode(true);





              //update title and text and image
              newcard.querySelector('.card-title').innerHTML = title;
              newcard.querySelector('#uploadDate').innerHTML = date;
              newcard.querySelector('#uploadDescription').innerHTML = description;
              newcard.querySelector('.btn').setAttribute("href", download);

              //attach to gallery
              document.getElementById("uploads-go-here").appendChild(newcard);
            })




          })

      }
    })
  }
  displayCards();