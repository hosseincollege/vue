<template>
  <nav class="navbar-content">
    
    <!-- سمت راست (شروع) - دکمه منو و جستجو -->
    <div class="nav-start">
      <button class="btn-icon toggle-btn" @click="$emit('toggle-sidebar')">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="3" y1="12" x2="21" y2="12"></line>
          <line x1="3" y1="6" x2="21" y2="6"></line>
          <line x1="3" y1="18" x2="21" y2="18"></line>
        </svg>
      </button>

      <div class="search-box">
        <svg class="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
        <input type="text" placeholder="جستجو در تجهیزات..." />
      </div>
    </div>

    <!-- سمت چپ (پایان) - ابزارها و پروفایل -->
    <div class="nav-end">
      
      <!-- دکمه تغییر تم -->
      <button class="btn-icon" @click="$emit('theme-toggle')" title="تغییر تم">
        <!-- آیکون خورشید برای تم تاریک -->
        <svg v-if="theme === 'dark-theme'" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="sun-icon">
          <circle cx="12" cy="12" r="5"></circle>
          <line x1="12" y1="1" x2="12" y2="3"></line>
          <line x1="12" y1="21" x2="12" y2="23"></line>
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
          <line x1="1" y1="12" x2="3" y2="12"></line>
          <line x1="21" y1="12" x2="23" y2="12"></line>
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
        </svg>
        <!-- آیکون ماه برای تم روشن -->
        <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
        </svg>
      </button>

      <!-- اعلان‌ها -->
      <div class="notification-wrapper">
        <button class="btn-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
            <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
          </svg>
          <span class="badge-dot"></span>
        </button>
      </div>

      <!-- پروفایل کاربری -->
      <div class="user-profile-dropdown" @click="toggleProfileMenu">
        <div class="user-info-display">
          <span class="user-name">{{ userInfo.name }}</span>
          <span class="user-role">{{ userInfo.role }}</span>
        </div>
        <img :src="userInfo.avatar" alt="Profile" class="user-avatar" />
        
        <!-- منوی کشویی -->
        <transition name="slide-up">
          <div v-if="isProfileOpen" class="dropdown-menu">
            <a href="#" class="dropdown-item">پروفایل من</a>
            <a href="#" class="dropdown-item">تنظیمات اکانت</a>
            <div class="divider"></div>
            <a href="#" class="dropdown-item text-danger">خروج</a>
          </div>
        </transition>
      </div>

    </div>
  </nav>
</template>

<script>
export default {
  name: "NavbarComponent",
  props: {
    theme: {
      type: String,
      default: 'light-theme'
    },
    userInfo: {
      type: Object,
      default: () => ({ name: 'کاربر', role: 'Guest', avatar: '' })
    }
  },
  data() {
    return {
      isProfileOpen: false
    };
  },
  methods: {
    toggleProfileMenu() {
      this.isProfileOpen = !this.isProfileOpen;
    }
  },
  // بستن منو وقتی بیرون کلیک شد
  mounted() {
    document.addEventListener('click', this.closeDropdown);
  },
  beforeUnmount() {
    document.removeEventListener('click', this.closeDropdown);
  },
  methods: {
    toggleProfileMenu(e) {
      // جلوگیری از بستن فوری هنگام کلیک روی خود المان
      e?.stopPropagation();
      this.isProfileOpen = !this.isProfileOpen;
    },
    closeDropdown() {
      this.isProfileOpen = false;
    }
  }
};
</script>

<style scoped>
.navbar-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100%;
  width: 100%;
}

/* --- Start Section (Right in RTL) --- */
.nav-start {
  display: flex;
  align-items: center;
  gap: 15px;
}

.btn-icon {
  background: transparent;
  border: none;
  padding: 8px;
  border-radius: 8px;
  cursor: pointer;
  color: var(--text-muted);
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}
.btn-icon:hover {
  background-color: rgba(0,0,0,0.05);
  color: var(--color-primary);
}
.dark-theme .btn-icon:hover {
  background-color: rgba(255,255,255,0.1);
}

.toggle-btn {
  /* فقط در دسکتاپ کمی بزرگتر */
}

.search-box {
  display: flex;
  align-items: center;
  background-color: var(--bg-body);
  border-radius: 8px;
  padding: 0 12px;
  height: 40px;
  width: 280px;
  border: 1px solid transparent;
  transition: all 0.3s;
}
.dark-theme .search-box {
  background-color: rgba(255,255,255,0.05);
}

.search-box:focus-within {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(67, 97, 238, 0.1);
}

.search-icon {
  color: var(--text-muted);
}

.search-box input {
  border: none;
  background: transparent;
  outline: none;
  width: 100%;
  padding: 0 10px;
  color: var(--text-main);
  font-family: inherit;
}

/* --- End Section (Left in RTL) --- */
.nav-end {
  display: flex;
  align-items: center;
  gap: 15px;
}

/* Notifications */
.badge-dot {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 8px;
  height: 8px;
  background-color: var(--color-danger);
  border-radius: 50%;
  border: 1px solid var(--bg-panel);
}

/* User Profile */
.user-profile-dropdown {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  padding: 5px 10px;
  border-radius: 8px;
  transition: background-color 0.2s;
  position: relative;
}
.user-profile-dropdown:hover {
  background-color: rgba(0,0,0,0.03);
}

.user-info-display {
  display: flex;
  flex-direction: column;
  text-align: left; /* انگلیسی/نام کاربری */
}
@media (max-width: 600px) {
  .user-info-display, .search-box {
    display: none; /* مخفی کردن در موبایل */
  }
}

.user-name {
  font-weight: 700;
  font-size: 0.9rem;
  color: var(--text-main);
}
.user-role {
  font-size: 0.75rem;
  color: var(--text-muted);
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  object-fit: cover;
  border: 2px solid var(--border-color);
}

/* Dropdown Menu */
.dropdown-menu {
  position: absolute;
  top: 60px;
  left: 0;
  width: 180px;
  background-color: var(--bg-panel);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  box-shadow: var(--shadow-lg);
  padding: 8px 0;
  display: flex;
  flex-direction: column;
  z-index: 100;
}

.dropdown-item {
  padding: 10px 20px;
  text-decoration: none;
  color: var(--text-main);
  font-size: 0.9rem;
  transition: background 0.2s;
  display: block;
}
.dropdown-item:hover {
  background-color: var(--bg-body);
  color: var(--color-primary);
}

.divider {
  height: 1px;
  background-color: var(--border-color);
  margin: 5px 0;
}
.text-danger {
  color: var(--color-danger) !important;
}

/* Sun Icon Animation */
.sun-icon {
  animation: spin-slow 10s linear infinite;
}
@keyframes spin-slow {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* Animations */
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.2s ease-out;
}
.slide-up-enter-from,
.slide-up-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
