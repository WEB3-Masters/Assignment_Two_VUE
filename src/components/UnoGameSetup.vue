<template>
  <div class="setup">
    <router-view />
    <h1>Welcome to UNO</h1>
    <h2><label for="numPlayers">How many players?</label></h2>
    <select id="numPlayers" v-model="numPlayers">
      <option v-for="n in [2, 3, 4]" :key="n" :value="n">
        {{ n }}
      </option>
    </select>
    <br />
    <h2><label for="targetScore">To how many points?</label></h2>
    <input type="number" v-model="targetScore" id="targetScore" min="1" />
    <br />
    <br />
    <button @click="startGame">Start new game</button>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router"; // Import useRouter
import { useGameStore } from "../stores/GameStore";

const numPlayers = ref(2);
const targetScore = ref(500);
const router = useRouter();
const store = useGameStore();
const difficulty = ref<("easy" | "medium" | "hard")[]>([
  "medium",
  "medium",
  "medium",
]);
const botsCount = ref(1);

const startGame = () => {
  store.createGame(difficulty.value.slice(0, botsCount.value));

  router.push("/game");
};
</script>
