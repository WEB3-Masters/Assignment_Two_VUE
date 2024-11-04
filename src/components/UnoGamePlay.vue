<template>
  <div class="gameplay">
    <h1>UNO</h1>
    <p>Target score: {{ targetScore }}</p>
    <p>
      Current player:
      {{ store.currentPlayerInTurn() }}
    </p>
    <Button
      v-if="store.players[store.currentPlayerInTurn() - 1]?.deck?.length === 1"
      @click="
        () => {
          // Assuming the accuser (you) is of index 0
          store.catchUnoFailure({
            accuser: 0,
            accused: store.currentPlayerInTurn(),
          });
          store.updateAllPlayerDecks();
        }
      "
      >Accuse</Button
    >
    <p class="message">
      Discard Pile: {{ store.discardPileTopCard?.type }}
      {{ store.discardPileTopCard?.color }}
      {{ store.discardPileTopCard?.number }}
    </p>

    <div class="decks">
      <div class="card">
        <button
          @click="
            {
              store.draw();
            }
          "
        >
          Draw Card {{ drawPileSize }}
        </button>
      </div>
      <div class="discard">
        {{ store.discardPileTopCard?.type }}
        {{ store.discardPileTopCard?.color }}
        {{ store.discardPileTopCard?.number }}
      </div>
    </div>

    <PlayerHand
      :cards="store.players[playerIndex].deck"
      :isActive="store.isPlayerInTurn(playerIndex)"
    />

    <p v-if="winner">Player {{ winner + 1 }} wins the round!</p>

    <button class="testBtn" @click="navigateToBreakScreen()">Break</button>
  </div>
</template>

<script setup lang="ts">

import PlayerHand from "../components/PlayerHand.vue";
import { ref, computed, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { Game } from "../model/uno";
import { Hand } from "../model/hand";
import { decideMove } from "../model/BotAI";
import { useGameStore } from "../stores/GameStore";


const route = useRoute();
const store = useGameStore();
const numPlayers = Number(route.query.numPlayers);
const targetScore = store.getTargetScore();
const players = Array.from({ length: numPlayers }, (_, i) => `Player ${i + 1}`);


const currentPlayer = store.currentPlayerInTurn();
const winner = ref<number | undefined>(undefined);
const playerIndex = 0;

//<---- Card behaviour ---->
const cardsContainer = ref<HTMLDivElement | null>(null);

const router = useRouter();
//<--- Navigation --->
const navigateToBreakScreen = () => {

  router.push({
    name: "Break",
  });
};

</script>

<style scoped lang="css">

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
