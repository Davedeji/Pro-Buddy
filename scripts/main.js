function getMatchedUser() {
    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            var uid = user.uid;
            var docRef = db.collection("users").doc(user.uid)
            console.log(user.uid)

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



function displayMatchedProfilePic() {
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
    db.collection("users").doc(user.uid)
        .get()
        .then(function (snap) {

            
            var match = snap.data().match;
            console.log(match)
            db.collection("users").doc(match).get().then(e => {
                var matchProfilePic = e.data().profilePic
                console.log(matchProfilePic)
                $("#matchedProfilePic").attr("src", matchProfilePic);
                emptypic();
            })
            

        })
    }
})
}
displayMatchedProfilePic();

function emptypic() {
    var x = document.getElementById("matchedProfilePic").getAttribute("src");
    if (x == "" || x == null) {
        $("#matchedProfilePic").attr("src", "https://bootdey.com/img/Content/avatar/avatar7.png");
    }
    
}



function create_UUID() {
    var dt = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = (dt + Math.random() * 16) % 16 | 0;
      dt = Math.floor(dt / 16);
      return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return uuid;
  }
  function match() {
    const user = firebase.auth().currentUser;
    var matched = [];
    search(first_half => {
      second_search(second_half => {
        const secondItems = new Set(second_half)
        const intersection = first_half.filter(x => secondItems.has(x))
        console.log(intersection)
        db.collection("users").doc(user.uid).set({
          match: intersection[0]
        }, {merge: true});
        
      })
    })
  }

  function sync_match() {
    const user = firebase.auth().currentUser;
    db.collection("users").doc(user.uid).get().then(snap => {
      var matched_user_uid = snap.data().match
      db.collection("users").doc(matched_user_uid).set({
        match: user.uid
      }, {merge: true});
      console.log("writing current user ID into matched user doc")
    })
  }

 
  function search(callback) {
    const user = firebase.auth().currentUser;
    console.log(user.uid)
    let first_half = [];
    let list_one = [];
    db.collection("interests").where('userID', 'array-contains', user.uid).get().then(snap => {
      snap.forEach(doc => {
        list_one.push(doc.id)
      });

      for (let i = 0; i < list_one.length; i++) {
        db.collection('skills').doc(list_one[i]).get().then(l => {
          for (let w of l.data().userID) {
            first_half.push(w)
          }
          callback(first_half)
        })
      }
    })
  }


  function second_search(callback) {
    const user = firebase.auth().currentUser;
    const second_half = [];
    db.collection("skills").where('userID', 'array-contains', user.uid).get().then(snap => {
      let list_two = []
      snap.forEach(doc => {
        list_two.push(doc.id)
      });
    
      for (let i = 0; i < list_two.length; i++) {
        db.collection('skills').doc(list_two[i]).get().then(l => {
          for (let w of l.data().userID) {              
            second_half.push(w)
          }           
          callback(second_half)
        })
      }
    });

  }


