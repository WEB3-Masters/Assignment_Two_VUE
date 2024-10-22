<template>
  <div class="gameplay">
    <h1>UNO</h1>
    <p>Target score: {{ targetScore }}</p>
    <p>Current player: {{ currentPlayer + 1 }}</p>
    <p class="message">
      First card is: {{ topDiscardCard?.value?.type }}
      {{ topDiscardCard.value?.color }} {{ topDiscardCard.value?.number }}
    </p>

    <div class="decks">
      <div class="card">
        <button @click="drawCard">Draw Card {{ drawPileSize }}</button>
      </div>
      <div class="discard">
        {{ topDiscardCard?.type }} {{ topDiscardCard?.color }}
        {{ topDiscardCard?.number }}
      </div>
    </div>

    <div class="playerhand" ref="cardsContainer">
      <h2>Player {{ currentPlayer + 1 }}'s hand</h2>
      <div class="cards">
        <div
          v-for="(card, index) in playerHand"
          :key="index"
          :class="['card', { playable: isPlayable(index) }]"
        >
          <button @click="playCard(index)">
            {{ card.type }} {{ card.color }} {{ card.number }}
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
import { Game } from "../model/uno";
import { Hand } from "../model/hand";
import { decideMove } from "../model/BotAI";
import { useGameStore } from "../stores/GameStore";

const route = useRoute();
const numPlayers = Number(route.query.numPlayers);
const targetScore = Number(route.query.targetScore); //These don't work
const players = Array.from({ length: numPlayers }, (_, i) => `Player ${i + 1}`);

const game = ref<Game | undefined>(undefined);
const currentPlayer = ref<number>(0);
const winner = ref<number | undefined>(undefined);

let message = "";
// let gameTwo = useGameStorecreateGame({
//   players: players,
//   targetScore: targetScore,
//   cardsPerPlayer: 7,
// });

const playerHand = computed(
  () => game.value?.hand?.playerHand(currentPlayer.value) ?? []
);
const topDiscardCard = computed(() => game.value?.hand?.discardPile().top());
const drawPileSize = computed(() => game.value?.hand?.drawPile().size ?? 0);

//<---- In game methods ---->
const playCard = (cardIndex: number) => {
  try {
    game.value?.hand?.play(cardIndex);
    currentPlayer.value = game.value?.hand?.playerInTurn() ?? 0;
    if (currentPlayer.value !== 0) {
      decideNextMove();
    }
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
//<---- Card behaviour ---->
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

const isPlayable = (cardIndex: number) => {
  return game.value?.hand?.canPlay(cardIndex);
};

const router = useRouter();
//<--- Navigation --->
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

const decideNextMove = () => {
  // Safely access the hand property, ensure it's not undefined and valid
  const bots: ("easy" | "medium" | "hard")[] = [];
  const hand: Hand | undefined = game?.value?.hand;

  if (!hand) {
    console.error("Hand is undefined or not properly initialized");
    return;
  }

  // Validate if hand has all required properties
  // if (!hand.players || !hand.playerHands || !hand._drawPile) {
  //   console.error("Hand is missing required properties");
  //   return;
  // }

  // Proceed with move decision if hand is valid
  const currentPlayerIndex = game?.value?.hand?.playerInTurn() ?? 0;
  const move = decideMove(hand, bots[currentPlayerIndex - 1]);
  console.log("MOVE: ", move);

  if (move === "draw") {
    game?.value?.hand?.draw();
    return;
  }

  if (move.nextColor) {
    alert("Next Color is: " + move.nextColor);
  }
  game.value?.hand?.play(move.cardIndex, move.nextColor);
};
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
  padding: 10px;
  gap: 10px;
}

.card {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 5px;
  scroll-snap-align: start;
}

.card:first-child {
  scroll-margin-left: 10px;
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
}

.discard {
  width: 150px;
  height: 225px;
  color: #101010;
  background-color: #ffffff;
  border: 2px solid #000;
  border-radius: 10px;
  text-align: center;
  align-items: center;
  font-size: 12px;
  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.2);
  color: #1f1f1f;
  display: flex;
  justify-content: center;
}

button {
  width: 100px;
  height: 150px;

  background-color: #ffffff;
  border: 2px solid #000;
  border-radius: 10px;
  text-align: center;
  font-size: 12px;
  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.2);
  cursor: pointer;
  color: #1f1f1f;
}

button:hover {
  color: #101010;
  background-color: #f0f0f0;
}

.gameplay {
  text-align: center;
  /* background: #233142;
   */
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
