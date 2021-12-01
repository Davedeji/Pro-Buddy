var currentUser

function populateInfo() {
    firebase.auth().onAuthStateChanged(user => {
        // Check if user is signed in:
        if (user) {
            //go to the correct user document by referencing to the user uid
            currentUser = db.collection("users").doc(user.uid)
            //get the document for current user.
            currentUser.get()
                .then(userDoc => {
                    //get the data fields of the user
                    var userName = userDoc.data().name;
                    var userAge = userDoc.data().age;
                    var userCity = userDoc.data().city;
                    var userDescription = userDoc.data().description;

                    //if the data fields are not empty, then write them in to the form.
                    if (userName != null) {
                        document.getElementById("nameInput").value = userName;
                    }
                    if (userAge != null) {
                        document.getElementById("ageInput").value = userAge;
                    }
                    if (userCity != null) {
                        document.getElementById("cityInput").value = userCity;
                    }
                    if (userDescription != null) {
                        document.getElementById("introInput").value = userDescription;
                    }
                })
        } else {
            // No user is signed in.
            console.log("No user is signed in");
        }
    });
}



//call the function to run it 
populateInfo();

// enable the form to be editable
function editUserInfo() {
    document.getElementById('personalInfoFields').disabled = false;
}

// write form's data into user's doc in database
function saveUserInfo() {
    //grab values from the form that user populated, then put 
    userName = document.getElementById('nameInput').value;       //get the value of the field with id="nameInput"
    userAge = document.getElementById('ageInput').value;     //get the value of the field with id="ageInput"
    userCity = document.getElementById('cityInput').value;   //get the value of the field with id="cityInput"
    userDescription = document.getElementById('introInput').value;      //get the value of the field with id="introInput"

    // write the values into database:
    currentUser.update({
        name: userName,
        age: userAge,
        city: userCity,
        description: userDescription
    })
        .then(() => {
            console.log("Document successfully updated!");
        })
    // disable the form to be uneditable
    document.getElementById('personalInfoFields').disabled = true;
}



// listen to any change to profile picture
function AddUploadListener() {
    firebase.auth().onAuthStateChanged(function (user) {
        // Check if user is signed in
        if (user) {
            console.log(user.uid)
            const fileInput = document.getElementById("profilePicFile"); // pointer #1
            const image = document.getElementById("profilePic"); // pointer #2

            //attach listener to input file
            //when this file changes, do something
            fileInput.addEventListener('change', function (e) {

                //the change event returns a file "e.target.files[0]"
                var blob = URL.createObjectURL(e.target.files[0]);
                var targetfile = (e.target.files[0]);  // save the file to a variable

                //change the DOM img element source to point to this file
                image.src = blob; //assign the "src" property of the "img" tag

                //do database stuff:  add to user doc under users collection
                storeImage(user.uid, targetfile);
            })
        } else { console.log("no user signed in") }
    });
}
// call the function to run it
AddUploadListener();

// upload and write profile picture into storage and firestore database
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
                    console.log(url);
                    db.collection("users").doc(userid).update({
                        "profilePic": url   // Save the URL into users collection
                    })
                })
        });
}

// read from database to display current user's profile picture
function displayProfilePic() {
    firebase.auth().onAuthStateChanged(function (user) {
        // check if user is signed in
        if (user) {
            db.collection("users").doc(user.uid)  // get current user's doc
                .get()
                .then(function (snap) {
                    var pic = snap.data().profilePic; // get url for the profile picture
                    $("#profilePic").attr("src", pic);  // change the DOM img element source to point to this url
                    // run emptypic function
                    emptypic();


                })
        }
    })
}
// call the function to run it
displayProfilePic();

// display default picture for empty user profile picture situation
function emptypic() {
    var x = document.getElementById("profilePic").getAttribute("src");  // reference to DOM image element's source attribute
    // if source attribute is empty or null, do something
    if (x == "" || x == null) {
        $("#profilePic").attr("src", "https://bootdey.com/img/Content/avatar/avatar7.png"); // set source attribute to default picture
    }
}