import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

// 1. ایمپورت کردن فایل تنظیمات Axios که قبلا در src/request.js ساختیم
import request from "./request";

const app = createApp(App);

// 2. تعریف متغیر سراسری $http
// این خط باعث می‌شود در هر کامپوننتی بتوانید با this.$http.get() درخواست بزنید
app.config.globalProperties.$http = request;

app.use(store);
app.use(router);

app.mount("#app");
