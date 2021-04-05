<template>
  <Card>
    <HeaderBrand></HeaderBrand>
    <NavTab :tab="0"></NavTab>
    <v-row>
      <v-col class="pb-0">
        <v-text-field
          :label="`Buscar por ${typeSearch === 'name' ? 'nombre' : 'calle'}`"
          filled
          rounded
          clearable
          dense
          v-model="search"
          @change="onSearch"
          prepend-inner-icon="mdi-magnify"
        ></v-text-field>
      </v-col>
      <v-col cols="12" class="pt-0">
        <v-radio-group
          style="justify-content: center"
          row
          v-model="typeSearch"
          class="text-center my-0"
        >
          <v-radio label="Nombre" value="name"></v-radio>
          <v-radio label="Calle" value="street"></v-radio>
        </v-radio-group>
      </v-col>
    </v-row>
    <v-divider></v-divider>
    <v-row>
      <v-col cols="12" class="mt-3">
        <h2 class="text-center">Ordenar resultados por:</h2>
        <v-radio-group
          style="justify-content: center"
          row
          v-model="sortSearch"
          class="text-center my-0"
        >
          <v-radio label="Alfabéticamente" value="alphabet"></v-radio>
          <v-radio label="Puntuación" value="rating"></v-radio>
        </v-radio-group>
      </v-col>
      <v-col class="pt-0">
        <RestaurantItem
          v-for="(restaurant, index) in restaurantsChild"
          :restaurant="restaurant"
          :key="index"
          @onSelect="onSelect"
        />
      </v-col>
    </v-row>
  </Card>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
export default {
  components: {
    HeaderBrand: () => import("../components/HeaderBrand"),
    Card: () => import("../components/Card"),
    NavTab: () => import("../components/NavTab"),
    RestaurantItem: () => import("../components/RestaurantItem"),
  },
  data: () => ({
    search: "",
    typeSearch: "name",
    sortSearch: "alphabet",
    restaurantsChild: [],
  }),
  watch: {
    sortSearch: function () {
      this.onSort(this.sortSearch);
    },
    search: function () {
      this.onSearch();
    },
    typeSearch: function () {
      if (!this.search) return;
      this.onSearch();
    },
  },
  computed: {
    ...mapGetters(["restaurants"]),
  },
  mounted() {
    this.onSearch();
  },
  methods: {
    ...mapActions(["toggleDrawer"]),
    /**
     * Sort by alphabet and its rating, knowing a type of search, Method,
     * @param {String} type - data from localstore
     * @return {Array} restaurantsChild - Return a new array of elements sorted
     */
    onSort: function (type) {
      switch (type) {
        case "alphabet":
          if (this.typeSearch === "name") {
            this.restaurantsChild = this.restaurantsChild.sort(function (a, b) {
              if (a.name < b.name) {
                return -1;
              }
              if (a.name > b.name) {
                return 1;
              }
              return 0;
            });
          } else {
            this.restaurantsChild = this.restaurantsChild.sort(function (a, b) {
              if (a.address.street < b.address.street) {
                return -1;
              }
              if (a.address.street > b.address.street) {
                return 1;
              }
              return 0;
            });
          }

          break;
        default:
          this.restaurantsChild = this.restaurantsChild.sort(function (a, b) {
            if (a.rating > b.rating) {
              return -1;
            }
            if (a.rating < b.rating) {
              return 1;
            }
            return 0;
          });
          break;
      }
    },
    /**
     * Search by string, Method,
     * @return {Array} restaurantsChild - Return a new array
     */
    onSearch: function () {
      const matcher = new RegExp(`^${this.search.toUpperCase()}`, "g");
      if (this.typeSearch === "name") {
        this.restaurantsChild = this.restaurants.filter((restaurant) => {
          let _name = restaurant.name.toUpperCase();
          return _name.match(matcher);
        });
      } else {
        this.restaurantsChild = this.restaurants.filter((restaurant) => {
          let _street = restaurant.address.street.toUpperCase();
          return _street.match(matcher);
        });
      }

      this.onSort(this.sortSearch);
    },
    onSelect: function ({ id }) {
      this.$router.push({ name: "Maps", params: { id } });
    },
    visit: function ({ email, site, phone }, payload) {
      switch (payload) {
        case "email":
          window.open("email:" + email);
          break;
        case "site":
          window.open(site, "_blank");
          break;

        default:
          window.open("tel:" + phone);
          break;
      }
    },
  },
};
</script>
