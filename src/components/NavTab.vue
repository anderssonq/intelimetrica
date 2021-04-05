<template>
  <v-tabs fixed-tabs :value="tab" class="mb-2">
    <v-tab
      class="primary--text"
      @click="$router.push({ name: 'Home' }).catch(() => ({}))"
    >
      <v-icon>mdi-home-search-outline</v-icon>
    </v-tab>
    <v-tab
      class="primary--text"
      @click="$router.push({ name: 'Maps' }).catch(() => ({}))"
    >
      <v-icon>mdi-google-maps</v-icon>
    </v-tab>
  </v-tabs>
</template>

<script>
export default {
  name: "NavTab",
  props: {
    tab: {
      type: Number,
      default: () => 0,
    },
  },
};
</script>
