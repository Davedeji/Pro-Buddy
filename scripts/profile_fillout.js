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
                    // console.log(userName)
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

function editUserInfo() {
    // console.log("edit is clicked")
    document.getElementById('personalInfoFields').disabled = false;
}

function saveUserInfo() {
    // console.log("save is clicked")
    //grab values from the form that user populated, then put 
    userName = document.getElementById('nameInput').value;       //get the value of the field with id="nameInput"
    userAge = document.getElementById('ageInput').value;     //get the value of the field with id="schoolInput"
    userCity = document.getElementById('cityInput').value;
    userDescription = document.getElementById('introInput').value;      //get the value of the field with id="cityInput"
    // console.log("input is " userName, userAge, userCity)

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

    document.getElementById('personalInfoFields').disabled = true;
}





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


                    var pic = snap.data().profilePic;

                    $("#profilePic").attr("src", pic);
                    emptypic();


                })
        }
    })
}
displayProfilePic();

function emptypic() {
    var x = document.getElementById("profilePic").getAttribute("src");
    if (x == "" || x == null) {
        $("#profilePic").attr("src", "https://bootdey.com/img/Content/avatar/avatar7.png");
    }

}