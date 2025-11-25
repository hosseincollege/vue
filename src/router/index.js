import { createRouter, createWebHistory } from "vue-router";
import DashboardView from "../views/Dashboard.vue";
// ایمپورت دستی صفحات جدید (اگر فایلش را نساختید، ارور می‌دهد پس حتما بسازید)
import DevicesView from "../views/Devices.vue";
import EnergyView from "../views/Energy.vue";

const routes = [
  {
    path: "/",
    name: "dashboard",
    component: DashboardView,
  },
  {
    path: "/devices",
    name: "devices",
    component: DevicesView, // کامپوننت جدید
  },
  {
    path: "/energy",
    name: "energy",
    component: EnergyView, // کامپوننت جدید
  },
  // برای بقیه لینک‌ها فعلا ریدایرکت به داشبورد می‌گذاریم که خالی نماند
  { path: "/security", redirect: "/" },
  { path: "/settings", redirect: "/" },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
