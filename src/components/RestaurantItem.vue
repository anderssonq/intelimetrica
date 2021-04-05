<template>
  <v-tooltip top light>
    <template v-slot:activator="{ on }">
      <v-card
        class="mx-auto my-2"
        shaped
        outlined
        @click="noNelectable ? null : $emit('onSelect', restaurant)"
        v-on="noNelectable ? null : on"
      >
        <v-card-title>{{ restaurant.name }}</v-card-title>
        <v-card-text>
          <v-row align="center" class="mx-0">
            <v-rating
              :value="restaurant.rating"
              color="amber"
              dense
              half-increments
              readonly
              size="14"
            ></v-rating>

            <div class="grey--text ml-4">{{ restaurant.rating }}</div>
          </v-row>

          <div class="my-4 subtitle-1 font-weight-bold">
            {{ restaurant.address.street }}
          </div>

          <div>
            {{ restaurant.address.city }}, {{ restaurant.address.state }}
          </div>
        </v-card-text>

        <v-divider class="mx-4"></v-divider>

        <v-card-actions style="justify-content: center">
          <v-btn
            color="primary"
            class="ma-2 white--text"
            @click="visit(restaurant.contact, 'site')"
            fab
          >
            <v-icon dark> mdi-web </v-icon>
          </v-btn>
          <v-btn
            color="secondary"
            class="ma-2 white--text"
            @click="visit(restaurant.contact, 'email')"
            fab
          >
            <v-icon dark> mdi-email </v-icon>
          </v-btn>
          <v-btn
            color="accent"
            class="ma-2 white--text"
            @click="visit(restaurant.contact, 'phone')"
            fab
          >
            <v-icon dark> mdi-phone </v-icon>
          </v-btn>
        </v-card-actions>
        <v-row class="mb-1">
          <v-col class="text-center">
            <v-chip color="blue" label text-color="white">
              <v-icon left> mdi-facebook </v-icon>
              <ShareNetwork
                class="white--text"
                network="facebook"
                :url="`${restaurant.contact.site}`"
                :title="restaurant.name"
                :description="`Quiero que todos sepan que ${restaurant.name} es un buen restaurante, 100% recomendado!`"
                :quote="`Quiero que todos sepan que ${restaurant.name} es un buen restaurante, 100% recomendado!`"
                :hashtags="`melp, ${restaurant.name}, ${restaurant.address.street}`"
              >
                Compartir en Facebook
              </ShareNetwork>
            </v-chip>
          </v-col>
        </v-row>
      </v-card>
    </template>
    <span
      >Ver en el mapa <v-icon large color="primary"> mdi-magnify </v-icon></span
    >
  </v-tooltip>
</template>

<script>
export default {
  name: "ItemList",
  props: {
    restaurant: {
      type: Object,
      default: () => ({}),
    },
    noNelectable: {
      type: Boolean,
      default: () => false,
    },
  },
};
</script>
