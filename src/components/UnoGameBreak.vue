<template>
  <div>
    <h1>Game Over</h1>
    <table>
      <tbody>
        <tr v-for="player in store.players" :key="player.id">
          <td>Player name: {{ player.name }}</td>
          <td>Score: {{ store.getPlayerScore(player.id) }}</td>
          <td>Number of cards: {{ player.deck.length }}</td>
        </tr>
      </tbody>
    </table>
    <button @click="router.push('/game')">Back</button>
  </div>
</template>

<script setup lang="ts">
import { useGameStore } from "../stores/GameStore";
import { useRouter } from "vue-router";

const store = useGameStore();
const router = useRouter();
</script>
