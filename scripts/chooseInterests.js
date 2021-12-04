let x = 0;
//populate card data with preset interests
let cardData = [
  ["Music", "music", "/images/skills_interests/music.jpg"],
  ["Nature", "nature", "/images/skills_interests/nature.jpg"],
  ["Arts & Crafts", "arts_crafts", "/images/skills_interests/arts_crafts.jpg"],
  ["Cooking", "cooking", "/images/skills_interests/cooking.jpg"],
  ["Dance", "dance", "/images/skills_interests/dance.jpg"],
  ["Film & TV", "film_tv", "/images/skills_interests/film_tv.jpg"],
];
// creating cards to display interests
while (x < 6) {
  var card = $(createCard(cardData[x][0], cardData[x][1], cardData[x][2]));
  var element = document.getElementById("cardGroup");
  $("#cardGroup").append(card);
  x += 1;
}
// add eventlistener for onlick toggle change
document.querySelectorAll(".col").forEach((item) => {
  item.addEventListener("click", (event) => {
    item.firstElementChild.classList.toggle("selected");
  });
});
retrieveSelectedCards("interests");
