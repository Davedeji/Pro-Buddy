
function upload(form) {
    const user = firebase.auth().currentUser;
    var userUID = ""
    var input = form.file.files[0]
    var uploadTask = storageRef.child('files/' + user.uid + '/' + input.name).put(input).then((e) => {
        storageRef.child('files/' + user.uid + '/' + input.name).getDownloadURL().then((url) => {
            console.log(url)

            db.collection("uploads").add({
                description: form.description.value,
                title: form.title.value,
                date: firebase.firestore.FieldValue.serverTimestamp(),
                ID: user.uid,
                download: url
            });
        })
        if (user) {
            userUID = user.uid
            console.log(userUID)
        }
        uploadTask
    })
}