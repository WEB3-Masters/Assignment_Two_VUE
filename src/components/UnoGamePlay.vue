<template>
  <div class="gameplay">
    <h1>UNO</h1>
    <p>Target score: {{ targetScore }}</p>
    <p>Current player: {{ currentPlayer + 1 }}</p>
    <p class="message">{{ message }}</p>

    <div class="decks">

      <div class='card'>
        <button class='card-number' @click="drawCard">Draw A Card {{ drawPileSize }}</button>
      </div>

      <div class="card">
      <div :class="[topDiscardCard?.color ? topDiscardCard?.color.toLowerCase():'']">
        <div class="discard">
        {{ cardDisplay(topDiscardCard) }}
      </div>
    </div>
      </div>
    </div>

    <div class="playerhand" ref="cardsContainer">
      <h2>Player {{ currentPlayer + 1 }}'s hand</h2>
      <div class="cards">
        <div
          v-for="(card, index) in playerHand"
          :key="index"
          :class="['card', { playable: isPlayable(index)},card.color?.toLowerCase(),card.type.toLowerCase()]"
        >
        <button @click="playCard(index)">
          <div class="card-content">
          <span class="card-number">{{ cardDisplay(card) }}</span>
        </div>
          </button>
        </div>
      </div>
    </div>

    <p v-if="winner">Player {{ winner + 1 }} wins the round!</p>

    <button class="testBtn" @click="newRound()">Break</button>
    <button class="testBtn" @click="endGame()">End</button>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { createGame, Game } from "../model/uno";

const route = useRoute();
const numPlayers = Number(route.query.numPlayers);
const targetScore = Number(route.query.targetScore); //These don't work
const players = Array.from({ length: numPlayers }, (_, i) => `Player ${i + 1}`);

const game = ref<Game | undefined>(undefined);
const currentPlayer = ref<number>(0);
const winner = ref<number | undefined>(undefined);

let message = "";

const startGame = () => {
  game.value = createGame({
    players: players,
    targetScore: targetScore,
    cardsPerPlayer: 7,
  });
  currentPlayer.value = game.value?.hand?.playerInTurn() ?? 0;
  message +=
    "First card is: " +
    topDiscardCard.value?.type +
    " " +
    topDiscardCard.value?.color +
    " " +
    topDiscardCard.value?.number;
  console.log(
    "First card is: " +
      topDiscardCard.value?.type +
      " " +
      topDiscardCard.value?.color +
      " " +
      topDiscardCard.value?.number
  );
};

const playerHand = computed(
  () => game.value?.hand?.playerHand(currentPlayer.value) ?? []
);
const topDiscardCard = computed(() => game.value?.hand?.discardPile().top());
const drawPileSize = computed(() => game.value?.hand?.drawPile().size ?? 0);

//<---- In game methods ---->
const playCard = (cardIndex: number) => {
  try {
    let card = game.value?.hand?.play(cardIndex);
    message = "";
    message +=
      "Player " +
      (currentPlayer.value + 1) +
      " played: " +
      card?.type +
      " " +
      card?.color +
      " " +
      card?.number;
    console.log(
      "Player " +
        currentPlayer.value +
        " played: " +
        card?.type +
        " " +
        card?.color +
        " " +
        card?.number
    );

    currentPlayer.value = game.value?.hand?.playerInTurn() ?? 0;
    console.log("Player " + (currentPlayer.value + 1) + "'s turn");
  } catch (error) {
    console.error("Cannot play this card");
  }
};

//TODO: Handle not being able to draw more than 1 card - and only play the drawn card
const drawCard = () => {
  try {
    game.value?.hand?.draw();
    console.log("player " + currentPlayer.value + " has drawn a card.");
    if (!game.value?.hand?.canPlay(playerHand.value.length - 1)) {
      currentPlayer.value = game.value?.hand?.playerInTurn() ?? 0;
      console.log("Player " + currentPlayer.value + "'s turn");
    }
  } catch (error) {
    console.error("Cannot draw a card");
  }
};
//<---- Card display ---->
const cardsContainer = ref<HTMLDivElement | null>(null);
watch(
  () => game.value?.hand?.playerHand(currentPlayer.value),
  () => {
    if (cardsContainer.value) {
      cardsContainer.value.scrollTo({
        left: cardsContainer.value.scrollWidth,
        behavior: "smooth", // Smooth scrolling
      });
    }
  }
);

const cardDisplay = (card: {type: string, color?: string, number?:number}) => {
  if (card.type === 'NUMBERED')
  {return card.number;}
  else
  {return card.type;}
};

const isPlayable = (cardIndex: number) => {
  return game.value?.hand?.canPlay(cardIndex);
};

//<--- Navigation --->
const router = useRouter();
const newRound = () => {
  router.push({
    name: "Break",
  });
};
const endGame = () => {
  router.push({
    name: "End",
  });
};

startGame();
</script>

<style scoped lang="css">
.playerhand {
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 100%;
}

.cards {
  display: flex;
  max-width: 100%;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  scroll-behavior: smooth;
  justify-content: start;
  gap: 2px;
}

.card {
  display: flex;
  border: 1px solid black;
  border-radius: 10px;
  flex-direction: column;
  align-items: center;
  padding: 0px;
  scroll-snap-align: start;
}

.card:first-child {
  scroll-margin-left: 10px;
}

.card-number {
  color:white;
  text-shadow: 1px 1px 0px #000, -1px -1px 0px #000, 1px -1px 0px #000, -1px 1px 0px #000;
  font-family:Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif;
  font-size: 20px;
}

.red {
  background-color: red;
  border-radius: 10px;
}
.green {
  background: green;
  border-radius: 10px;
}
.yellow {
  background-color: yellow;
  border-radius: 10px;
}
.blue {
  background-color: blue;
  border-radius: 10px;
}
.wild {
  background: linear-gradient(45deg, red,yellow, green, blue);
  border-radius: 100%;
}



.playable:hover {
  border: 2px solid rgb(2, 200, 255);
  border-radius: 10px;
  background-color: rgb(144, 233, 238);
}

.decks {
  display: flex;
  justify-content: center;
  max-width: 100%;
  align-items: center;
  gap: 5px;
}

.discard {
  width: 150px;
  height: 225px;
  background-color: inherit;
  border: 2px solid white;
  border-radius: 10px;
  text-align: center;
  align-items: center;
  font-size: 30px;
  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.15);
  display: flex;
  justify-content: center;
  color:white;
  text-shadow: 1px 1px 0px #000, -1px -1px 0px #000, 1px -1px 0px #000, -1px 1px 0px #000;
  font-family:Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif;
}

button {
  width: 100px;
  height: 150px;
  background-color: inherit;
  border: 2px solid white;
  border-radius: 10px;
  text-align: center;
  font-size: 12px;
  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.2);
  cursor: pointer;
  color: #1f1f1f;
}

button:hover {
  background-color: #f0f0f062;
}

.gameplay {
  text-align: center;
}

.testBtn {
  width: 50px;
  height: 30px;
  background-color: red;
  border: 2px solid black;
  border-radius: 10px;
  text-align: center;
}

.testBtn:hover {
  background-color: rgb(249, 171, 171);
}
</style>
