function getMatchedUser() {
    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            var uid = user.uid;
            var docRef = db.collection("users").doc(user.uid)

            docRef.get().then((doc) => {
                if (doc.exists) {
                    matchedUserID = doc.data().match
                    getMatchedUserProperties(matchedUserID)
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

function getMatchedUserProperties(userID) {
    name = ""
    description = ""
    var docRef = db.collection("users").doc(userID)

    docRef.get().then((doc) => {
        if (doc.exists) {
            name = doc.data().name
            description = doc.data().description
            updateMatchedUserDisplay(name, description)
        } else {
            console.log("No such document!");
        }
    }).catch((error) => {
        console.log("Error getting document:", error);
    });
}

function updateMatchedUserDisplay(name, description) {
    document.getElementById("matchedUserName").innerHTML = name
    document.getElementById("matchedUserDescription").innerHTML = description
}
getMatchedUser()

function getRecentCheckIn() {
    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            db.collection("checkin").where("User", "==", user.uid).limit(3)
                .get()
                .then((querySnapshot) => {
                    querySnapshot.forEach((doc) => {
                        // doc.data() is never undefined for query doc snapshots
                        let date = doc.data().Time
                        date = date.toDate()
                        let time = date.toLocaleTimeString("en-us", {
                            timeStyle: 'short'
                        });
                        date = date.toLocaleDateString("en-us", {
                            dateStyle: 'medium'
                        });
                        addCheckinCard(doc.id, date, time, doc.data().Notes)
                    });
                })
                .catch((error) => {
                    console.log("Error getting documents: ", error);
                });
        } else {

        }
    });
}

function addCheckinCard(id, date, time, notes) {
    var card = $(createCheckinCard(id, date, time, notes))
    $('#check-ins').append(card);
}

function createCheckinCard(id, date, time, notes) {
    return `<div class="col-4 mb-3 ">
    <div class="card" id="${id}">
      <div class="card-body">
        <div class="d-flex flex-column align-items-start text-start">
          <p class="text-left">Date: ${date}</p>
          <p class="font-weight-bold">Time: ${time}</p>
          <p class="font-weight-bold">Notes: ${notes}</p>
        </div>
      </div>
    </div>
  </div>`;
}
getRecentCheckIn()

function getRecentUploads() {
    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            db.collection("uploads").where("ID", "==", user.uid).limit(3)
                .get()
                .then((querySnapshot) => {
                    querySnapshot.forEach((doc) => {
                        // doc.data() is never undefined for query doc snapshots
                        console.log(doc.id, " => ", doc.data());
                        let date = doc.data().date
                        date = date.toDate()
                        let time = date.toLocaleTimeString("en-us", {
                            timeStyle: 'short'
                        });
                        date = date.toLocaleDateString("en-us", {
                            dateStyle: 'medium'
                        });

                        addUploadCard(doc.id, doc.data().title, date)
                    });
                })
                .catch((error) => {
                    console.log("Error getting documents: ", error);
                });
        } else {

        }
    });
}

function addUploadCard(id, title, date) {
    var card = $(createUploadCard(id, title, date))
    $('#uploads').append(card);
}

function createUploadCard(id, title, date) {
    return `<div class="col-4 mb-3">
      <div class="card" id="${id}">
        <div class="card-body">
          <div class="d-flex flex-column align-items-start text-start">
            <img src="/images/guitar.jpg" alt="Admin" class="" style="width: 100%;">
            <p class="text-left">Title: ${title}</p>
            <p class="text-left">Date: ${date}</p>
          </div>
        </div>
      </div>
    </div>`;
}
getRecentUploads()

function AddUploadListener() {
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            console.log(user.uid)
            const fileInput = document.getElementById("profilePicFile"); // pointer #1
            const image = document.getElementById("profilePic"); // pointer #2

            //attach listener to input file
            //when this file changes, do something
            fileInput.addEventListener('change', function (e) {

                //the change event returns a file "e.target.files[0]"
                var blob = URL.createObjectURL(e.target.files[0]);
                var targetfile = (e.target.files[0]);

                //change the DOM img element source to point to this file
                image.src = blob; //assign the "src" property of the "img" tag

                //do database stuff:  add to menu collection
                storeImage(user.uid, targetfile);
            })
        } else { console.log("no user signed in") }
    });
}

AddUploadListener();

function storeImage(userid, pickedfile) {
    var storageRef = firebase.storage().ref("images/" + userid + ".jpg"); // Get reference
    var metadata = {
        contentType: 'image/jpeg',
    };

    // Upload picked file to cloud storage
    storageRef.put(pickedfile, metadata)
        .then(function () {
            storageRef.getDownloadURL() //get URL of the uploade file
                .then(function (url) {
                    console.log(url); // Save the URL into users collection
                    db.collection("users").doc(userid).update({
                        "profilePic": url
                    })
                })
        });

}

function displayProfilePic() {
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
    db.collection("users").doc(user.uid)
        .get()
        .then(function (snap) {

            //console.log(doc.data());
            var profilePic = snap.data().profilePic;
            //console.log("#" + doc.data().name + "menu");
            //console.log(menuPic);
            $("#profilePic").attr("src", profilePic);

        })
    }
})
}
displayProfilePic();
