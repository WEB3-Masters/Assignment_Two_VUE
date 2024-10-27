<template>
  <div>
    <h1>{{ winner }} has won!</h1>
    <ol>
      <li v-for="player in players" :key="player.name">
        <span>{{ player.name }}</span> - {{ player.score }}
      </li>
    </ol>
    <RouterLink to="/">
      <Button> Play again </Button>
    </RouterLink>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { RouterLink, useRoute } from "vue-router";

const route = useRoute();
const players = ref<Array<{ name: string; score: number }>>([]);

for (const [name, score] of Object.entries(route.query)) {
  if (typeof score === "string") {
    players.value.push({
      name,
      score: parseInt(score, 10),
    });
  }
}

const winner = computed(() => {
  if (players.value.length === 0) return "No one";

  const topPlayer = players.value.reduce((prev, current) => {
    return current.score > prev.score ? current : prev;
  });
  return topPlayer.name;
});

players.value.sort((a, b) => b.score - a.score);
</script>
