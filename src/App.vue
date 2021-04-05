<template>
  <v-app>
    <v-main>
      <div class="container-app-layout">
        <div class="pizza-container">
          <img id="loading" class="pizza" src="./assets/pizza.png" />
        </div>
        <router-view></router-view>
      </div>
    </v-main>
  </v-app>
</template>

<script>
import { mapActions } from "vuex";
export default {
  name: "App",
  mounted() {
    this.init();
  },
  methods: {
    ...mapActions(["init"]),
  },
};
</script>