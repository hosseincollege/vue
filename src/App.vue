<template>
  <div id="app" :class="['app-layout', currentTheme, { 'sidebar-collapsed': isSidebarCollapsed }]">
    
    <!-- 🌑 لایه پس‌زمینه برای موبایل -->
    <div class="mobile-overlay" @click="isSidebarCollapsed = true"></div>

    <!-- 🧩 نوار کناری (Sidebar) -->
    <aside class="sidebar-area">
      <SidebarComponent 
        :collapsed="isSidebarCollapsed" 
        @toggle="toggleSidebar" 
      />
    </aside>

    <!-- 🏠 بخش اصلی -->
    <main class="main-content-area">
      
      <!-- 🔝 نوار ابزار بالا (Navbar) -->
      <header class="navbar-area">
        <NavbarComponent 
          @toggle-sidebar="toggleSidebar" 
          @theme-toggle="toggleTheme"
          :theme="currentTheme"
          :user-info="userInfo"
        />
      </header>

      <!-- 📄 محتوای پویا (Pages) -->
      <div class="page-view-container">
        
        <!-- لودینگ جهانی -->
        <div v-if="isLoading" class="global-loader">
          <div class="spinner"></div>
          <span>در حال بارگذاری داده‌ها...</span>
        </div>

        <!-- Router View با انیمیشن -->
        <router-view v-slot="{ Component }">
          <transition name="slide-fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </div>

      <!-- 🦶 پاورقی (Footer) -->
      <footer class="footer-area">
        <p>&copy; 1403 پلتفرم هوشمند BMS/IOT | نسخه Enterprise v2.0</p>
        <div class="server-ping">
          Ping: <span :class="ping < 100 ? 'text-green' : 'text-red'">{{ ping }}ms</span>
        </div>
      </footer>

    </main>

    <!-- 🔔 سیستم نوتیفیکیشن جهانی (Toast) -->
    <div class="toast-container">
      <transition-group name="toast">
        <div 
          v-for="toast in toasts" 
          :key="toast.id" 
          class="toast-message"
          :class="toast.type"
        >
          <i class="icon">{{ getToastIcon(toast.type) }}</i>
          <div class="content">
            <strong>{{ toast.title }}</strong>
            <p>{{ toast.message }}</p>
          </div>
          <button @click="removeToast(toast.id)" class="close-btn">×</button>
        </div>
      </transition-group>
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
  data() {
    return {
      isSidebarCollapsed: false,
      currentTheme: 'light-theme', // light-theme | dark-theme
      isLoading: false,
      ping: 45,
      userInfo: {
        name: "مدیر سیستم",
        role: "Super Admin",
        avatar: "https://i.pravatar.cc/150?img=11"
      },
      toasts: [], // لیست پیام‌های سیستم
      toastCounter: 0
    };
  },
  provide() {
    return {
      // اجازه میده کامپوننت‌های فرزند (مثل Dashboard) بتونن این توابع رو صدا بزنن
      showToast: this.addToast,
      setLoading: (status) => { this.isLoading = status; }
    };
  },
  created() {
    // بررسی تم ذخیره شده در لوکال استوریج
    const savedTheme = localStorage.getItem('app-theme');
    if (savedTheme) {
      this.currentTheme = savedTheme;
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      this.currentTheme = 'dark-theme';
    }

    // شبیه‌سازی پینگ سرور
    setInterval(() => {
      this.ping = Math.floor(Math.random() * (120 - 20) + 20);
    }, 3000);
  },
  methods: {
    toggleSidebar() {
      this.isSidebarCollapsed = !this.isSidebarCollapsed;
    },
    toggleTheme() {
      this.currentTheme = this.currentTheme === 'light-theme' ? 'dark-theme' : 'light-theme';
      localStorage.setItem('app-theme', this.currentTheme);
      document.body.className = this.currentTheme; // اعمال روی بادی برای اسکرول بارها
    },
    addToast(title, message, type = 'info') {
      const id = this.toastCounter++;
      this.toasts.push({ id, title, message, type });
      // حذف خودکار بعد از 5 ثانیه
      setTimeout(() => {
        this.removeToast(id);
      }, 5000);
    },
    removeToast(id) {
      this.toasts = this.toasts.filter(t => t.id !== id);
    },
    getToastIcon(type) {
      switch(type) {
        case 'success': return '✅';
        case 'error': return '⛔';
        case 'warning': return '⚠️';
        default: return 'ℹ️';
      }
    }
  }
};
</script>

<style>
/* 🎨 تعریف متغیرهای جهانی (CSS Variables) */
:root {
  /* رنگ‌های اصلی - تم روشن */
  --color-primary: #4361ee;
  --color-primary-dark: #3a0ca3;
  --color-secondary: #4cc9f0;
  --color-success: #2ec4b6;
  --color-warning: #ffd166;
  --color-danger: #ef476f;
  --color-info: #4895ef;

  --bg-body: #f3f4f6;
  --bg-panel: #ffffff;
  --text-main: #1e293b;
  --text-muted: #64748b;
  --border-color: #e2e8f0;
  
  --sidebar-width: 260px;
  --sidebar-width-collapsed: 70px;
  --header-height: 70px;
  
  --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1);
  --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1);
}

/* تم تاریک */
.dark-theme {
  --bg-body: #0f172a;
  --bg-panel: #1e293b;
  --text-main: #f1f5f9;
  --text-muted: #94a3b8;
  --border-color: #334155;
  --color-primary: #577bff; /* کمی روشن‌تر برای خوانایی */
}

/* ریست کلی */
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: "Vazirmatn", "Segoe UI", Tahoma, sans-serif;
  background-color: var(--bg-body);
  color: var(--text-main);
  direction: rtl;
  overflow-x: hidden;
  transition: background-color 0.3s ease, color 0.3s ease;
}

/* --- Layout Grid --- */
.app-layout {
  display: flex;
  min-height: 100vh;
  position: relative;
}

/* Sidebar Area */
.sidebar-area {
  width: var(--sidebar-width);
  background-color: var(--bg-panel);
  border-left: 1px solid var(--border-color);
  position: fixed;
  top: 0;
  bottom: 0;
  right: 0;
  z-index: 50;
  transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow-y: auto;
  box-shadow: var(--shadow-md);
}

/* Main Content Wrapper */
.main-content-area {
  flex-grow: 1;
  margin-right: var(--sidebar-width); /* فاصله به اندازه سایدبار */
  display: flex;
  flex-direction: column;
  transition: margin-right 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  min-height: 100vh;
}

/* Navbar */
.navbar-area {
  height: var(--header-height);
  background-color: var(--bg-panel);
  border-bottom: 1px solid var(--border-color);
  position: sticky;
  top: 0;
  z-index: 40;
  padding: 0 20px;
  display: flex;
  align-items: center;
  backdrop-filter: blur(8px); /* افکت شیشه‌ای */
  background-color: rgba(255, 255, 255, 0.9);
}
.dark-theme .navbar-area {
  background-color: rgba(30, 41, 59, 0.9);
}

/* Page View */
.page-view-container {
  padding: 30px;
  flex-grow: 1;
  position: relative;
}

/* Footer */
.footer-area {
  padding: 20px;
  text-align: center;
  font-size: 0.85rem;
  color: var(--text-muted);
  border-top: 1px solid var(--border-color);
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.text-green { color: var(--color-success); font-weight: bold; }
.text-red { color: var(--color-danger); font-weight: bold; }

/* --- Collapsed State --- */
.app-layout.sidebar-collapsed .sidebar-area {
  width: var(--sidebar-width-collapsed);
}
.app-layout.sidebar-collapsed .main-content-area {
  margin-right: var(--sidebar-width-collapsed);
}

/* --- Responsive (Mobile) --- */
@media (max-width: 768px) {
  .sidebar-area {
    transform: translateX(100%); /* مخفی کردن کامل در موبایل */
    right: 0;
  }
  .main-content-area {
    margin-right: 0 !important;
  }
  
  /* وقتی سایدبار باز میشه تو موبایل */
  .app-layout:not(.sidebar-collapsed) .sidebar-area {
    transform: translateX(0);
    width: var(--sidebar-width);
  }
  
  .mobile-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.5);
    z-index: 45;
    display: none;
  }
  .app-layout:not(.sidebar-collapsed) .mobile-overlay {
    display: block;
  }
}

/* --- Animations --- */
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.3s ease-out;
}
.slide-fade-enter-from {
  transform: translateY(20px);
  opacity: 0;
}
.slide-fade-leave-to {
  transform: translateY(-20px);
  opacity: 0;
}

/* --- Global Loader --- */
.global-loader {
  position: absolute;
  inset: 0;
  background: rgba(255,255,255,0.8);
  z-index: 100;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 15px;
  backdrop-filter: blur(2px);
  border-radius: 10px;
}
.dark-theme .global-loader {
  background: rgba(15, 23, 42, 0.8);
}
.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid var(--border-color);
  border-top-color: var(--color-primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

/* --- Toast Notifications --- */
.toast-container {
  position: fixed;
  bottom: 30px;
  left: 30px;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.toast-message {
  background: var(--bg-panel);
  border-left: 5px solid;
  padding: 15px 20px;
  border-radius: 8px;
  box-shadow: var(--shadow-lg);
  display: flex;
  align-items: flex-start;
  gap: 15px;
  width: 300px;
  animation: slideInLeft 0.3s;
}
.toast-message.success { border-color: var(--color-success); }
.toast-message.error { border-color: var(--color-danger); }
.toast-message.warning { border-color: var(--color-warning); }
.toast-message.info { border-color: var(--color-info); }

.toast-message .content { flex-grow: 1; }
.toast-message hg { margin-bottom: 5px; display: block; }
.toast-message p { font-size: 0.85rem; color: var(--text-muted); margin: 0; }
.close-btn { background: none; border: none; cursor: pointer; font-size: 1.2rem; color: var(--text-muted); }

@keyframes slideInLeft {
  from { transform: translateX(-100%); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
}

/* Scrollbar زیبا */
::-webkit-scrollbar { width: 8px; height: 8px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }
.dark-theme ::-webkit-scrollbar-thumb { background: #475569; }
::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
</style>
