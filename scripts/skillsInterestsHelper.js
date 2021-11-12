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

function cardsSelected(firestoreDocID) {
    var selectedSkills = {}

    document.querySelectorAll('.card').forEach(item => {
        selectedSkills[item.id] = false
    })
    document.querySelectorAll('.card.selected').forEach(item => {
        selectedSkills[item.id] = true
    })
    console.log(selectedSkills)
    continueClicked(selectedSkills, firestoreDocID)
}

function retrieveSelectedCards(firestoreDocID) {
    console.log("retrieveing doc")
    var docRef = db.collection("users").doc("user03").collection("userChoices").doc(firestoreDocID);

    docRef.get().then((doc) => {
        if (doc.exists) {
            console.log("Document data:", doc.data());
            // if doc.data().
            const cards = doc.data()
            for (var field in doc.data()) {
                console.log(field)
                console.log(cards[field])

                if (cards[field]) {
                    var elem = document.getElementById(field);
                    elem.classList.toggle('selected')
                    console.log('card selected')
                }
                

            }
        } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
        }
    }).catch((error) => {
        console.log("Error getting document:", error);
    });
}

function continueClicked(data, firestoreDocID) {
    const user = firebase.auth().currentUser;

    if (user) {
        console.log(user.uid)
    }
    db.collection("users").doc("user03").collection("userChoices").doc(firestoreDocID).set(data)
        .then(() => {
            console.log("Document successfully written!");
        })
        .catch((error) => {
            console.error("Error writing document: ", error);
        });
}