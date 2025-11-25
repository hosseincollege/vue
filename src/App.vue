<!-- src/App.vue -->
<template>
  <div class="app-container">
    <!-- منوی کناری -->
    <SidebarComponent />

    <!-- بخش اصلی محتوا -->
    <div class="main-content">
      <!-- نوار بالا -->
      <NavbarComponent @refresh="handleRefresh" />

      <!-- محتوای متغیر صفحات (که توسط روتر پر می‌شود) -->
      <div class="page-wrapper">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </div>
    </div>
  </div>
</template>

<script>
import SidebarComponent from "./components/Sidebar.vue";
import NavbarComponent from "./components/Navbar.vue";

export default {
  name: "App",
  components: {
    SidebarComponent,
    NavbarComponent,
  },
  methods: {
    handleRefresh() {
      // این متد وقتی دکمه رفرش در نوار بالا زده شود اجرا می‌شود
      // اینجا می‌توانیم به استور بگوییم دوباره از سرور جاوا دیتا بگیرد
      console.log("App.vue: Refresh signal received");
      // فعلا فقط یک پیام لاگ می‌کنیم
    },
  },
};
</script>

<style>
/* تنظیمات کلی پروژه */
body {
  margin: 0;
  padding: 0;
  font-family: "Vazir", "Tahoma", sans-serif; /* فونت فارسی */
  background-color: #f4f6f9; /* رنگ پس‌زمینه کلی */
  direction: rtl; /* راست‌چین کل پروژه */
}

/* باکس مدل */
* {
  box-sizing: border-box;
}

.app-container {
  display: flex;
  min-height: 100vh;
}

.main-content {
  flex-grow: 1;
  /* این باعث می‌شود محتوا سمت چپ سایدبار قرار نگیرد، بلکه کنارش باشد */
  /* چون سایدبار fixed است و margin-right دادیم */
  display: flex;
  flex-direction: column;
  width: 100%;
}

.page-wrapper {
  padding: 30px;
  margin-right: 250px; /* دقیقا اندازه عرض سایدبار */
  min-height: calc(100vh - 70px); /* ارتفاع کل منهای نوار بالا */
  transition: all 0.3s ease;
}

/* انیمیشن تغییر صفحات */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* اسکرول بار زیبا */
::-webkit-scrollbar {
  width: 8px;
}
::-webkit-scrollbar-track {
  background: #f1f1f1;
}
::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}
::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>
