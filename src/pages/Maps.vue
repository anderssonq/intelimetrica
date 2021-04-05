<template>
  <Card>
    <HeaderBrand></HeaderBrand>
    <NavTab :tab="1"></NavTab>

    <v-row>
      <v-col cols="12">
        <div class="container">
          <div class="card">
            <div class="card-item"></div>
          </div>
          <div class="card">
            <div class="card-item"></div>
          </div>
          <div class="card">
            <div class="card-item"></div>
          </div>
        </div>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <p class="display-1 text-center">
          Nosotros en Melp nos complace crear herramientas de busqueda geniales
          para encontrar tu restaurante ideal.
        </p>

        <p class="p text-center">
          Para utilizarlo basta con arrastrar el circulo
          <strong class="red--text">rojo</strong> a la zona de tu preferencia,
          ¡también puedes configurar del rango de busqueda!
        </p>

        <p class="p text-center">
          También te ofrecemos el circulo
          <strong class="yellow--text">amarillo</strong> para buscar restauranes
          recomandados.
        </p>

        <v-row class="mt-2">
          <v-col cols="12" md="4"
            ><v-text-field
              v-model.number="circle.lat"
              label="Latitud"
              rounded
              required
              filled
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="4">
            <v-text-field
              v-model.number="circle.lng"
              label="Longitud"
              rounded
              required
              filled
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="4">
            <v-slider
              v-model="radiosCircle"
              label="Radio del círculo"
              thumb-label="always"
              max="9000"
              min="0"
              class="mt-4"
            >
              <template v-slot:thumb-label="{ value }">
                <p class="my-0 text-center black--text" style="font-size: 10px">
                  <strong>{{ value }}</strong> mts
                </p>
              </template></v-slider
            >
          </v-col>
          <v-col cols="12">
            <h2 class="display-1 mb-2">Datos estadísticos de tu busqueda:</h2>
            <p v-if="!lastDataSearch" class="text-center">
              <v-chip color="red" label text-color="white">
                <v-icon left> mdi-magnify-close </v-icon>
                Sin resultados
                <strong>
                  (Arrastra y suélta el circulo
                  <strong class="white--text">rojo</strong> en alguna
                  parte)</strong
                >
              </v-chip>
            </p>
            <v-row v-else>
              <v-col cols="12" md="4">
                <p>
                  <strong
                    >Número total de restauranes dentro del circulo:</strong
                  >
                  {{ lastDataSearch.total }}
                </p>
              </v-col>
              <v-col cols="12" md="4">
                <p>
                  <strong
                    >Promedio del total de restauranes dentro del
                    circulo:</strong
                  >
                  {{ lastDataSearch.average }}
                </p>
              </v-col>
              <v-col cols="12" md="4">
                <p>
                  <strong
                    >Desviación estándar de los ratings de los restaurantes
                    encontrados:</strong
                  >
                  {{ lastDataSearch.standardDeviation }}
                </p>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-col>
      <v-col>
        <GmapMap
          id="map"
          ref="map"
          :center="center"
          :zoom="wasSelected ? 20 : 15"
          style="width: 100%; height: 500px"
          @center_changed="updateCenter"
        >
          <GmapCircle :radius="radiosCircle" :visible="true" draggable
          :center="circle" :position="circle" title="SMG" fillOpacity:="1.0"
          @dragend="updateCircle" :options="{fillColor:'red'}" /> <GmapCircle
          :radius="radiosCircle" :visible="true" draggable
          :center="recommendedCircle" :position="recommendedCircle" title="SMG"
          fillOpacity:="1.0" @dragend="updateCircleRecomendation"
          :options="{fillColor:'yellow'}" />

          <GmapMarker
            :key="index"
            v-for="(m, index) in markers"
            :position="m.position"
            :clickable="true"
            @click="center = m.position"
          />
        </GmapMap>
      </v-col>
      <v-col cols="12" class="text-center">
        <h2 class="text-center">Lista de restauranes recomendados</h2>
        <div class="container-recommended" v-if="recommendeds.length > 0">
          <RestaurantItem
            :restaurant="recommended"
            v-for="(recommended, index) in recommendeds"
            :noNelectable="true"
            :key="index"
          />
        </div>
        <v-chip color="red" label text-color="white" v-else>
          <v-icon left> mdi-magnify-close </v-icon>
          Sin resultados
          <strong>
            (Arrastra y suélta el circulo
            <strong class="white--text">amarillo</strong> en alguna
            parte)</strong
          >
        </v-chip>
      </v-col>
    </v-row>
  </Card>
</template>

<script>
import { mapGetters } from "vuex";
import { getStandardDeviation } from "../utils";
export default {
  name: "Restaurant",
  components: {
    HeaderBrand: () => import("../components/HeaderBrand"),
    Card: () => import("../components/Card"),
    NavTab: () => import("../components/NavTab"),
    RestaurantItem: () => import("../components/RestaurantItem"),
  },
  data: () => ({
    markers: [],
    recommendeds: [],
    wasSelected: false,
    center: {
      lat: 19.440057053713137,
      lng: -99.12704709742486,
    },
    circle: {
      lat: 19.444087691342393,
      lng: -99.11570725467557,
    },
    recommendedCircle: {
      lat: 19.444087691342393,
      lng: -99.11570725467557,
    },
    radiosCircle: 1000,
    lastDataSearch: null,
  }),
  watch: {
    radiosCircle: function () {
      this.updateCircle();
    },
  },
  computed: {
    ...mapGetters(["restaurants"]),
  },

  mounted() {
    this.generateGlobalMarkers();
    this.updateCircle();
    // Component checks if a params its present to show a restaurant at map
    if (this.$route.params.id) {
      const id = this.$route.params.id;
      const {
        address: { location },
      } = this.restaurants.find((r) => r.id === id);
      this.wasSelected = true;
      this.center = location;
      this.circle = location;
    }
  },
  methods: {
    /**
     * Map restaurants array into a restaurant marker format, Method,
     * @return {Array} markers - Return a new array in another format
     */
    generateGlobalMarkers: function () {
      const _restaurents = [...this.restaurants].reduce((acum, curr) => {
        acum.push({
          id: curr.id,
          title: curr.name,
          position: curr.address.location,
          rating: curr.rating,
        });

        return acum;
      }, []);

      this.markers = _restaurents;
    },
    /**
     * Event google map, Method,
     * @param {Object} center - Event from google map component
     */
    updateCenter: function (center) {
      this.center = {
        lat: center.lat(),
        lng: center.lng(),
      };
    },
    /**
     * Feature in which given a certain point in a map (You could drop a pin in a map) and a radius in meters, Method,
     * This method we are using computeDistanceBetween from google maps utils to calculate distance between 2 coors given,
     * in this case we have to calculate each elements to get our result
     * @param {Object} center - Event from google map component
     */
    updateCircleRecomendation: function (center) {
      this.recommendeds = [];
      let circle = null;
      if (!center) {
        circle = this.circle;
      } else {
        circle = {
          lat: center.latLng.lat(),
          lng: center.latLng.lng(),
        };

        this.recommendedCircle = circle;
      }

      const _restaurents = [...this.restaurants].reduce((acum, curr) => {
        acum.push({
          id: curr.id,
          title: curr.name,
          position: curr.address.location,
          rating: curr.rating,
        });

        return acum;
      }, []);

      let _recomendationIds = [];
      for (const _marker of _restaurents) {
        const p1 = new google.maps.LatLng(circle.lat, circle.lng);
        const p2 = new google.maps.LatLng(
          _marker.position.lat,
          _marker.position.lng
        );

        const distance = google.maps.geometry.spherical.computeDistanceBetween(
          p1,
          p2
        );
        const distanceKm = parseFloat(distance.toFixed(4));
        if (distanceKm < this.radiosCircle) {
          _recomendationIds.push(_marker.id);
        }
      }

      for (const id of _recomendationIds) {
        const restaurant = [...this.restaurants].find((r) => r.id === id);
        this.recommendeds = [...this.recommendeds, restaurant];
      }

      this.recommendeds = this.recommendeds.sort(function (a, b) {
        if (a.rating > b.rating) {
          return -1;
        }
        if (a.rating < b.rating) {
          return 1;
        }
        return 0;
      });
    },
    /**
     * Feature nearest restaurants in the zone given a point in a map, a radius in meters and a range of rating, Method,
     * This method we are using computeDistanceBetween from google maps utils to calculate distance between 2 coors given,
     * in this case we have to calculate each elements to get our result
     * @param {Object} center - Event from google map component
     */
    updateCircle: function (center) {
      let circle = null;
      if (!center) {
        circle = this.circle;
      } else {
        circle = {
          lat: center.latLng.lat(),
          lng: center.latLng.lng(),
        };

        this.circle = circle;
      }

      this.generateGlobalMarkers();

      const _markers = [...this.markers];
      let _newMarkers = [];
      let _newRatings = [];
      for (const _marker of _markers) {
        const p1 = new google.maps.LatLng(circle.lat, circle.lng);
        const p2 = new google.maps.LatLng(
          _marker.position.lat,
          _marker.position.lng
        );

        const distance = google.maps.geometry.spherical.computeDistanceBetween(
          p1,
          p2
        );
        const distanceKm = parseFloat(distance.toFixed(4));
        if (distanceKm < this.radiosCircle) {
          _newMarkers.push(_marker);
          _newRatings.push(_marker.rating);
        }
      }
      if (_newMarkers.length > 0) {
        this.lastDataSearch = {
          total: _newMarkers.length,
          average: _newMarkers.length / this.restaurants.length,
          standardDeviation: getStandardDeviation(_newRatings),
        };
      } else {
        this.lastDataSearch = null;
      }
      this.markers = _newMarkers;
    },
  },
};
</script>
