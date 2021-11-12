    function getUserInterests() {
        var fullString = ""
        var docRef = db.collection("users").doc("user03").collection("userChoices").doc("interests");
        docRef.get().then((doc) => {
            if (doc.exists) {
                console.log("Document data:", doc.data());
                // if doc.data().
                const cards = doc.data()
                for (var field in doc.data()) {
                    if (cards[field]) {
                        let fieldName = field.replace("card-", "")
                        fieldName = fieldName.replace("_", " & ")
                        fieldName = capitalizeFirstLetter(fieldName)
                        fullString += fieldName + '<br>'
                    }
                }
                console.log(fullString)
                displayUserInterests(fullString)
            } else {
                // doc.data() will be undefined in this case
                console.log("No such document!");
            }
        }).catch((error) => {
            console.log("Error getting document:", error);
        });
    }

    function displayUserInterests(string) {
        var elem = document.getElementById("card-text-interests");
        elem.innerHTML = string
    }

    function getUserSkills() {
        var fullString = ""
        var docRef = db.collection("users").doc("user03").collection("userChoices").doc("skills");
        docRef.get().then((doc) => {
            if (doc.exists) {
                console.log("Document data:", doc.data());
                // if doc.data().
                const cards = doc.data()
                for (var field in doc.data()) {
                    if (cards[field]) {
                        let fieldName = field.replace("card-", "")
                        fieldName = fieldName.replace("_", " & ")
                        fieldName = capitalizeFirstLetter(fieldName)
                        fullString += fieldName + '<br>'
                    }
                }
                console.log(fullString)
                displayUserSkills(fullString)
            } else {
                // doc.data() will be undefined in this case
                console.log("No such document!");
            }
        }).catch((error) => {
            console.log("Error getting document:", error);
        });
    }

    function displayUserSkills(string) {
        var elem = document.getElementById("card-text-skills");
        elem.innerHTML = string
    }

    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
    getUserInterests();
    getUserSkills();