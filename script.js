let isFetching = false;

const API_KEY = "live_YZfNQqKCn3UBeTNVaQ8DRMC1NJWwdK5nGkdCaSH4iGhNi9rify1vggjCUVeT4VCo";
const CAT_API_URL = "https://api.thecatapi.com/v1/images/search?limit=10";

const container = document.getElementById("card-container");

async function fetchCats() {
  if (isFetching) return;

  isFetching = true;

  try {
    const response = await fetch(CAT_API_URL, {
      headers: {
        "x-api-key": API_KEY
      }
    });

    const data = await response.json();
    loadCardsFromAPI(data);
  } catch (error) {
    console.error("Failed to load cats 😿", error);
  } finally {
    isFetching = false;
  }
}


let startX = 0;
let currentX = 0;
let currentCard = null;

function createCard(image) {
  const card = document.createElement("div");
  card.className = "card";
  card.style.backgroundImage = `url(${image})`;

  const like = document.createElement("div");
  like.className = "label like";
  like.innerText = "LIKE";

  const nope = document.createElement("div");
  nope.className = "label nope";
  nope.innerText = "NOPE";

  card.appendChild(like);
  card.appendChild(nope);

  card.addEventListener("pointerdown", pointerDown);
  return card;
}

function loadCardsFromAPI(cats) {
  cats.reverse().forEach(cat => {
    const card = createCard(cat.url);
    container.appendChild(card);
  });
}


function pointerDown(e) {
  currentCard = e.currentTarget;
  startX = e.clientX;

  currentCard.setPointerCapture(e.pointerId);
  currentCard.addEventListener("pointermove", pointerMove);
  currentCard.addEventListener("pointerup", pointerUp);
}

function pointerMove(e) {
  currentX = e.clientX - startX;
  currentCard.style.transform = `translateX(${currentX}px) rotate(${currentX / 10}deg)`;

  const like = currentCard.querySelector(".like");
  const nope = currentCard.querySelector(".nope");

  if (currentX > 80) {
    like.style.opacity = 1;
    nope.style.opacity = 0;
  } else if (currentX < -80) {
    nope.style.opacity = 1;
    like.style.opacity = 0;
  } else {
    like.style.opacity = 0;
    nope.style.opacity = 0;
  }
}

function pointerUp() {
  currentCard.removeEventListener("pointermove", pointerMove);
  currentCard.removeEventListener("pointerup", pointerUp);

  if (currentX > 120) {
    swipe("right");
  } else if (currentX < -120) {
    swipe("left");
  } else {
    resetCard();
  }
}

function swipe(direction) {
  const moveOut = direction === "right" ? 1000 : -1000;
  currentCard.style.transform = `translateX(${moveOut}px) rotate(${moveOut / 10}deg)`;
  currentCard.style.opacity = 0;

  setTimeout(() => {
    currentCard.remove();

    if (container.children.length <= 2) {
      fetchCats();
    }
  }, 300);
}


function resetCard() {
  currentCard.style.transform = "translateX(0) rotate(0)";
}

fetchCats();

