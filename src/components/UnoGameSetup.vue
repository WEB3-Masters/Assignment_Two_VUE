<template>
  <div class="mainview">
  <h1>GAME SETUP</h1>
  <div>
    <label>
      Number of players (Bots)
      <input type="number" min="1" max="3" v-model="botsCount" />
    </label>
  </div>

  <ul>
    <li v-for="(_, index) in new Array(botsCount)" :key="index">
      <div>
        <p>Bot({{ index + 1 }})</p>
        <select v-model="difficulty[index]">
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
      </div>
    </li>
  </ul>

  <button @click="createGame">Play</button>
</div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useGameStore } from "../stores/GameStore";
import { useRouter } from "vue-router";

const botsCount = ref(1);
const difficulty = ref<("easy" | "medium" | "hard")[]>([
  "medium",
  "medium",
  "medium",
]);
const store = useGameStore();
const router = useRouter();

function createGame() {
  store.createGame(difficulty.value.slice(0, botsCount.value));
  router.push("/game");
}
</script>

<style>
.mainview {
  display:flex;
  flex-direction: column;
  align-items:center;
  justify-content: center;
}

</style>
