    let cardCount = 0
    let cardData = [
        ["Music", "music", "/images/skills_interests/music.jpg"],
        ["Nature", "nature", "/images/skills_interests/nature.jpg"],
        ["Arts & Crafts", "arts_crafts", "/images/skills_interests/arts_crafts.jpg"],
        ["Cooking", "cooking", "/images/skills_interests/cooking.jpg"],
        ["Dance", "dance", "/images/skills_interests/dance.jpg"],
        ["Film & TV", "film_tv", "/images/skills_interests/film_tv.jpg"],
    ];
    while (cardCount < cardData.length) {
        var card = $(createCard(cardData[cardCount][0], cardData[cardCount][1], cardData[cardCount][2]))
        var element = document.getElementById("cardGroup");
        $('#cardGroup').append(card);
        cardCount += 1
    }

    document.querySelectorAll('.col').forEach(item => {
        item.addEventListener('click', event => {
            item.firstElementChild.classList.toggle('selected')
        })
    })
    retrieveSelectedCards('skills');