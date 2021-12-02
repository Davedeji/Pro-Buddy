function getUserIDs() {
    // Check auth state and retrieve user id and matched user id
    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            var docRef = db.collection("users").doc(user.uid)
            docRef.get().then((doc) => {
                if (doc.exists) {
                    otherUserID = doc.data().match
                    startMessage(user.uid, otherUserID)
                    getOtherUserProperties(otherUserID)
                } else {
                    console.log("No such document!");
                }
            }).catch((error) => {
                console.log("Error getting document:", error);
            });
        } else {

        }
    });
}
getUserIDs()

// Create a new messaging document and store the id. only triggered if there isnt an existing message doc
function createMessage(userID, otherUserID) {
    setData = {}
    users = {}
    users[otherUserID] = true
    users[userID] = true
    setData["users"] = users
    console.log(setData)
    var doc = db.collection("messages").doc()
    doc.set(setData).then(() => {
        window.localStorage.setItem('chatID', doc.id);
        getMessages(doc.id)
    })
}
// Query messaging collection to find the doc for both matched users. if it doesnt exist create one
function startMessage(userID, otherUserID) {
    let ref = db.collection("messages").where('users.' + userID, '==', true).where('users.' + otherUserID, '==',
        true)
    ref.get()
        .then((querySnapshot) => {
            if (!querySnapshot.empty) {
                getMessages(querySnapshot.docs[0].id)
                window.localStorage.setItem('chatID', querySnapshot.docs[0].id);
            } else {
                createMessage(userID, otherUserID)
            }
        })
}

// retrieve the name and description of the other user
function getOtherUserProperties(userID) {
    username = ""
    description = ""
    var docRef = db.collection("users").doc(userID)

    docRef.get().then((doc) => {
        if (doc.exists) {
            username = doc.data().name
            description = doc.data().description
            updateMatchedUserDisplay(username, description)
        } else {
            console.log("No such document!");
        }
    }).catch((error) => {
        console.log("Error getting document:", error);
    });
}

// display the name and description of the other user
function updateMatchedUserDisplay(name, description) {
    document.getElementById("matchedUserName").innerHTML = name
    document.getElementById("matchedUserDescription").innerHTML = description
}

// listen to all message collection and update display
function getMessages(chatID) {
    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            var docRef = db.collection("messages").doc(chatID).collection("messages")
            docRef.orderBy("sentAt").onSnapshot((querySnapshot) => {
                querySnapshot.docChanges().forEach((change) => {
                    // doc.data() is never undefined for query doc snapshots
                    const timeStampDate = change.doc.data().sentAt;
                    let date = change.doc.data().sentAt
                    date = date.toDate()
                    let time = date.toLocaleTimeString("en-us", {
                        timeStyle: 'short'
                    });
                    date = date.toLocaleDateString("en-us", {
                        dateStyle: 'medium'
                    });
                    let finalDate = date + " " + time
                    var card = $(createCard("", change.doc.data().messageText, finalDate,
                        user
                        .uid == change.doc.data().sentBy))
                    var element = document.getElementById("cardGroup");
                    $('#cardGroup').append(card);
                });
                window.scrollTo(0, document.body.scrollHeight)
            });
        } else {
            // User is signed out
            // ...
        }
    });

}

// post a new message to the messages collection
function writeMessage() {
    const user = firebase.auth().currentUser;
    if (user) {
        // User logged in already or has just logged in.sd
        var chatID = window.localStorage.getItem('chatID');
        var docRef = db.collection("messages").doc(chatID).collection("messages");
        docRef.add({
                "messageText": document.getElementById("messageInput").value,
                "sentAt": firebase.firestore.Timestamp.fromDate(new Date()),
                "sentBy": user.uid
            })
            .then(() => {
                console.log("Document successfully written!");
                document.getElementById("messageInput").value = ""
            })
            .catch((error) => {
                console.error("Error writing document: ", error);
            });
    } else {
        // User not logged in or has just logged out.
    }

}

// create new text card for each message
function createCard(title, message, sentAt, isSender) {
    console.log(isSender)
    if (isSender == true) {
        return `<div class="card text-end" style="">
            <div class="card-body ">
                <h5 class="card-title">${title}</h5>
                <h6 class="card-subtitle mb-2 text-muted">${sentAt}</h6>
                <p class="card-text">${message}</p>
            </div>
        </div>`;
    } else {
        return `<div class="card" style="">
            <div class="card-body ">
                <h5 class="card-title">${title}</h5>
                <h6 class="card-subtitle mb-2 text-muted">${sentAt}</h6>
                <p class="card-text">${message}</p>
            </div>
        </div>`;
    }

}