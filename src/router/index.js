import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: () => import("../pages/Home"),
  },
  {
    path: "/maps",
    name: "Maps",
    component: () => import("../pages/Maps"),
  },
];

const router = new VueRouter({
  routes,
});

export default router;
