function signUpUser() {
    var email = document.getElementById('inputEmail').value
    var password = document.getElementById('inputPassword').value
    firebase.auth().createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            // Signed in
            var user = userCredential.user;
            console.log("signed in succesfully")
            window.open("/main.html", "_self")
            // ...
        })
        .catch((error) => {
            authFailed(error)
        });
}

function signInuser() {
    var email = document.getElementById('inputEmail').value
    var password = document.getElementById('inputPassword').value
    firebase.auth().signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            // Signed in
            var user = userCredential.user;
            console.log("signed in succesfully")
            window.open("/main.html", "_self")
            // ...
        })
        .catch((error) => {
            authFailed(error)
        });
}

function googleSignIn() {
    var provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().useDeviceLanguage();
    provider.setCustomParameters({
        'login_hint': 'user@example.com'
    });
    firebase.auth().signInWithRedirect(provider);
    firebase.auth()
        .getRedirectResult()
        .then((result) => {
            if (result.credential) {
                /** @type {firebase.auth.OAuthCredential} */
                var credential = result.credential;

                // This gives you a Google Access Token. You can use it to access the Google API.
                var token = credential.accessToken;
                // ...
            }
            // The signed-in user info.
            var user = result.user;
        }).catch((error) => {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            console.log(errorMessage)
            // The email of the user's account used.
            var email = error.email;
            // The firebase.auth.AuthCredential type that was used.
            var credential = error.credential;
            // ...
        });
}

function authFailed(error) {
    var errorCode = error.code;
    var errorMessage = error.message;
    console.log(errorMessage)
    console.log(errorCode)


    // Handle
    if (errorCode == "auth/email-already-in-use") {
        signInuser()
    }
    if (errorCode == "auth/invalid-email") {
        document.getElementById("error-label").innerHTML = "Invalid Email!"
        clearError(document.querySelector('#inputEmail'))
    }
    if (errorCode == "auth/weak-password") {
        document.getElementById("error-label").innerHTML = "Weak Password!"
        clearError(document.querySelector('#inputPassword'))
    }
}

function clearError(input) {
    console.log("called this")

    // Listen for `keydowm` event
    input.addEventListener('keydown', (e) => {
        document.getElementById("error-label").innerHTML = ""
    });
}
