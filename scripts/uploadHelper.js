// Upload file, tile, description, timestamp to firestore and fireabse storage
function upload(form) {
  // grab current signed in user's info
  const user = firebase.auth().currentUser;
  var userUID = "";
  // point to user's intended file to upload
  var input = form.file.files[0];
  // upload file into specified directory
  var uploadTask = storageRef
    .child("files/" + user.uid + "/" + input.name)
    .put(input)
    .then((e) => {
      // get permanent download url for the uploaded file
      storageRef
        .child("files/" + user.uid + "/" + input.name)
        .getDownloadURL()
        .then((url) => {
          console.log(url);
          // write description, title, timestamp, user id, and file download url into a upload doc under uploads collection
          db.collection("uploads")
            .add({
              description: form.description.value,
              title: form.title.value,
              date: firebase.firestore.FieldValue.serverTimestamp(),
              ID: user.uid,
              download: url,
            })
            .then(() => {
              // redirect user to upload overview page
              window.location.assign("newUploadOverview.html");
            });
        });
      // display current user's id in console for debug purpose
      if (user) {
        userUID = user.uid;
        console.log(userUID);
      }
    });
  uploadTask;
}
