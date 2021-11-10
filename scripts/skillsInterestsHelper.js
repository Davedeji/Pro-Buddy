function createCard(title, id, imageLink) {
    return `<div class="col mb-4">
                    <div class="card" id="card-${id}">
                        <img src=${imageLink} class="card-img-top" alt="..." />
                        <div class="card-body">
                            <h5 class="card-title stretched-link">${title}</h5>
                        </div>
                    </div>
            </div>`;
}

function cardsSelected(firestoreDocID) {
    var selectedSkills = {}

    document.querySelectorAll('.card').forEach(item => {
        selectedSkills[item.id] = false
    })
    document.querySelectorAll('.card.selected').forEach(item => {
        selectedSkills[item.id] = true
    })
    console.log(selectedSkills)
    continueClicked(selectedSkills, firestoreDocID)
}

function continueClicked(data, firestoreDocID) {
    db.collection("users").doc("user03").collection("userChoices").doc(firestoreDocID).set(data)
        .then(() => {
            console.log("Document successfully written!");
        })
        .catch((error) => {
            console.error("Error writing document: ", error);
        });
}