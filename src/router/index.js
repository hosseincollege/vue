import { createRouter, createWebHistory } from "vue-router";

// صفحه اصلی (داشبورد) را مستقیم ایمپورت می‌کنیم تا سریع لود شود
import Dashboard from "../views/Dashboard.vue";

const routes = [
  {
    path: "/",
    name: "Dashboard",
    component: Dashboard,
    meta: { title: "داشبورد | مدیریت هوشمند" },
  },
  {
    path: "/devices",
    name: "Devices",
    // لود تنبل (Lazy Load): فایل فقط زمانی دانلود می‌شود که نیاز باشد
    component: () => import("../views/Devices.vue"),
    meta: { title: "مدیریت تجهیزات | BMS" },
  },
  {
    path: "/energy",
    name: "Energy",
    component: () => import("../views/Energy.vue"),
    meta: { title: "مصرف انرژی | BMS" },
  },
  {
    path: "/security",
    name: "Security",
    component: () => import("../views/Security.vue"),
    meta: { title: "سیستم امنیتی | BMS" },
  },
  {
    path: "/settings",
    name: "Settings",
    component: () => import("../views/Settings.vue"),
    meta: { title: "تنظیمات | BMS" },
  },
  // مدیریت مسیرهای اشتباه (404) -> بازگشت به داشبورد
  {
    path: "/:pathMatch(.*)*",
    redirect: "/",
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  // اسکرول را هنگام تغییر صفحه به بالا برمی‌گرداند
  scrollBehavior() {
    return { top: 0 };
  },
});

// گارد مسیریابی: تغییر عنوان تب مرورگر بر اساس صفحه
router.beforeEach((to, from, next) => {
  document.title = to.meta.title || "Smart IoT Dashboard";
  next();
});

export default router;
