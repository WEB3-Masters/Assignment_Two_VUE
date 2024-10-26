<template>
  <div class="playerhand" ref="cardsContainer">
    <h2>Your hand</h2>
    <div class="cards">
      <div
        v-for="(card, index) in store.players[playerIndex].deck"
        :key="index"
        :class="['card', { playable: isPlayable(index) }]"
      >
        <button
          @click="play(index, card.type)"
          :class="{ inactive: !props.isActive }"
          :disabled="!props.isActive"
        >
          {{ card.type }} {{ card.color }} {{ card.number }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Card, CardColor, CardType } from "../model/deck";
import { useGameStore } from "../stores/GameStore";

const store = useGameStore();
const props = defineProps<{
  cards: Array<Card>;
  isActive: boolean;
}>();

const playerIndex = 0;

function play(index: number, cardType: CardType) {
  let chosenColor = undefined;
  if (cardType === "WILD" || cardType === "WILD DRAW") {
    const colorChoice = prompt(
      "Choose a color:\n1. Blue\n2. Green\n3. Red\n4. Yellow"
    );

    const colorMap: Record<string, CardColor> = {
      "1": "BLUE",
      "2": "GREEN",
      "3": "RED",
      "4": "YELLOW",
    };

    chosenColor = colorChoice ? colorMap[colorChoice.trim()] : null;

    if (!chosenColor) {
      alert("Invalid choice. Please enter a number between 1 and 4.");
      return;
    }
  }
  if (props.isActive) store.play(index, chosenColor);
}

function isPlayable(index: number): boolean | undefined {
  if (props.isActive) {
    return store.canPlay(index);
  }
  return false;
}
</script>

<style scoped lang="css">
.playable:hover {
  border: 1px solid rgb(2, 200, 255);
  border-radius: 10px;
  background-color: rgb(144, 233, 238);
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

.playerhand {
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 100%;
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
  transition: background-color 0.3s, opacity 0.3s;
}

button.inactive {
  background-color: #cccccc;
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
