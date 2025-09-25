import { createRouter, createWebHistory } from "vue-router";
import Cookies from "js-cookie";

import Login from "@/views/login/index.vue";
import Dashboard from "@/views/dashboard/index.vue";

// settings
// import Hotels from "@/views/hotels/index.vue";
import Hotels from "@/views/hotels/index.vue"
import Suppliers from "@/views/settings/suppliers/index.vue";
import Customers from "@/views/settings/customers/index.vue";
import Visa from "@/views/settings/visa/index.vue";

import Quotes from "@/views/quotes/quote/index.vue";
import QuoteItem from "@/views/quotes/quote-item/index.vue";
import Transfer from "@/views/Transfer/transfer.vue";
// import transferItem from "@/views/Transfer/transfer-item.vue";
import Reserve from "@/views/reservations/index.vue";
import Profits from "@/views/profits/index.vue";
import Trasport from "@/views/transport/index.vue";
import CustomersReport from "@/views/report/CustomerReport.vue";
import QuoteReport from "@/views/report/QuoteReport.vue";
import Invoice from "@/views/report/Invoice.vue";
import Locations from "@/views/settings/locations/index.vue"

import User from "@/views/user/index.vue";
import Role from "@/views/user/role.vue";
import Permission from "@/views/user/permission.vue";
import HotelList from "@/views/hotels/HotelList.vue";

const routes = [
  {
    path: "/",
    name: "login",
    component: Login,
  },
  {
    path: "/home",
    name: "home",
    component: Dashboard,
  },
  // settings
  {
    path: "/hotels",
    name: "hotels",
    component: Hotels,
  },
  {
    path: "/suppliers",
    name: "suppliers",
    component: Suppliers,
  },

   {
    path: "/customers",
    name: "customers",
    component: Customers,
  },

  {
    path: "/visa",
    name: "visa",
    component: Visa,
  },

  {
    path: "/reserve",
    name: "reserve",
    component: Reserve,
  },
  {
    path: "/profits",
    name: "profits",
    component: Profits,
  },
  {
    path: "/hotel-list",
    name: "hotel-list",
    component: HotelList,
  },

  {
    path: "/quote",
    name: "quote",
    component: Quotes,
  },
  {
    path: "/quote-item",
    name: "quote-item",
    component: QuoteItem,
  },
  {
    path: "/transfer",
    name: "transfer",
    component: Transfer,
  },

  {
    path: "/trasport",
    name: "trasport",
    component: Trasport,
  },
  {
    path: "/locations",
    name: "locations",
    component: Locations,
  },

  // report
  {
    path: "/customers-report",
    name: "customers-report",
    component: CustomersReport,
  },
  {
    path: "/quote-report",
    name: "quote-report",
    component: QuoteReport,
  },
  {
    path: "/invoice",
    name: "invoice",
    component: Invoice,
  },

  // user manager
  {
    path: "/user",
    name: "user",
    component: User,
  },
  {
    path: "/role",
    name: "role",
    component: Role,
  },
  {
    path: "/permission",
    name: "permission",
    component: Permission,
  },
  {
    path: "/:catchAll(.*)",
    redirect: "/",
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

router.beforeEach((to, from, next) => {
  const token = Cookies.get("token");
  if (to.path === "/" && !token) {
    next();
  } else if (to.path === "/" && token) {
    next("/home");
  } else if (token) {
    next();
  } else {
    next("/");
  }
});
export default router;
