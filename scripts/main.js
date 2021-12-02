// redirects to messages page
function messageClicked() {
  location.href = "/messages.html";
}
// getting matched users info based on user uid
function getMatchedUser() {
  firebase.auth().onAuthStateChanged((user) => {
    // check if user is signed in
    if (user) {
      var uid = user.uid;
      var docRef = db.collection("users").doc(user.uid)  // get current user's document
      console.log(user.uid)
      // return matched user's uid if there is one
      docRef.get().then((doc) => {
        if (doc.exists) {
          matchedUserID = doc.data().match
          // call function to retrieve matched user's info
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

// Retrieve matched user's info
function getMatchedUserProperties(userID) {
  var name = ""
  var description = ""
  var docRef = db.collection("users").doc(userID)
  // get matched user's doc
  docRef.get().then((doc) => {
    if (doc.exists) {
      name = doc.data().name
      description = doc.data().description
      // call function to display retrieved data onto webpage
      updateMatchedUserDisplay(name, description)
    } else {
      console.log("No such document!");
    }
  }).catch((error) => {
    console.log("Error getting document:", error);
  });
}

// Display info into corresponding html element
function updateMatchedUserDisplay(name, description) {
  document.getElementById("matchedUserName").innerHTML = name
  document.getElementById("matchedUserDescription").innerHTML = description
}

// call the funtion to run it
getMatchedUser()

// Generates cards to display three most recent checkin
function getRecentCheckIn() {
  firebase.auth().onAuthStateChanged((user) => {
    // check if user is signed in
    if (user) {
      // filter only most recent three checkin from current user
      db.collection("checkin").orderBy("Time", "desc").where("User", "==", user.uid).limit(3)
        .get()
        .then((querySnapshot) => {
          // get data from each entry
          querySnapshot.forEach((doc) => {
            console.log(doc.id, " => ", doc.data())
            let date = doc.data().Time
            date = date.toDate()
            // convert timestamp object into time
            let time = date.toLocaleTimeString("en-us", {
              timeStyle: 'short'
            });
            //// convert timestamp object into date
            date = date.toLocaleDateString("en-us", {
              dateStyle: 'medium'
            });
            // call the funtion to generate cards
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

// inserts cards filled with checkin data onto webpage
function addCheckinCard(id, date, time, notes) {
  var card = $(createCheckinCard(id, date, time, notes))
  $('#check-ins').append(card); // insert card into html element with id check-ins
}

// Creates card using following template
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
// call the function to run it
getRecentCheckIn()

// Generates cards to display three most recent uploads
function getRecentUploads() {
  firebase.auth().onAuthStateChanged((user) => {
    // check if user is signed in
    if (user) {
      // filter three most recent uploads done by current user
      db.collection("uploads").orderBy("date", "desc").where("ID", "==", user.uid).limit(3)
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            console.log(doc.id, " => ", doc.data());
            let date = doc.data().date
            date = date.toDate()
            // convert timestamp into time
            let time = date.toLocaleTimeString("en-us", {
              timeStyle: 'short'
            });
            // convert timestamp into date
            date = date.toLocaleDateString("en-us", {
              dateStyle: 'medium'
            });
            // call the function to display three cards with upload info
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

// Inserts cards into html element with id uploads
function addUploadCard(id, title, date) {
  var card = $(createUploadCard(id, title, date))
  $('#uploads').append(card);
}

// Creates cards using the following template
function createUploadCard(id, title, date) {
  return `<div class="col-4 mb-3">
      <div class="card" id="${id}">
        <div class="card-body">
          <div class="d-flex flex-column align-items-start text-start">
            <p class="text-left">Title: ${title}</p>
            <p class="text-left">Date: ${date}</p>
          </div>
        </div>
      </div>
    </div>`;
}

// call the function to run it
getRecentUploads()


// Diaplay matched user's profile picture
function displayMatchedProfilePic() {
  firebase.auth().onAuthStateChanged(function (user) {
    // check if user is signed in
    if (user) {
      // get current user's user document
      db.collection("users").doc(user.uid)
        .get()
        .then(function (snap) {
          // get matched user's uid
          var match = snap.data().match;
          console.log(match)
          // get matched user's document using matched user's uid
          db.collection("users").doc(match).get().then(e => {
            // get matched user's profile picture url value
            var matchProfilePic = e.data().profilePic
            console.log(matchProfilePic)
            // set img element's src attribute with id matchedProfilePic to profile picture url
            $("#matchedProfilePic").attr("src", matchProfilePic);
            // call the function to display default picture if none is found for matched user's profilePic field
            emptypic();
          })


        })
    }
  })
}
// call the function to run it
displayMatchedProfilePic();

// display default picture if none is found for matched user's profilePic field
function emptypic() {
  var picture_source = document.getElementById("matchedProfilePic").getAttribute("src");
  // if img element's src attribute is empty or null
  if (picture_source == "" || x == null) {
    // set src to default picture url
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
      }, { merge: true });

    })
  })
}

function sync_match() {
  const user = firebase.auth().currentUser;
  db.collection("users").doc(user.uid).get().then(snap => {
    var matched_user_uid = snap.data().match
    db.collection("users").doc(matched_user_uid).set({
      match: user.uid
    }, { merge: true });
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


