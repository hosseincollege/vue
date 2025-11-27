<template>
  <div class="sidebar-content">
    <!-- 🏷️ لوگو و برند -->
    <div class="sidebar-brand">
      <div class="logo-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
      <transition name="fade">
        <h1 v-if="!collapsed" class="brand-text">Smart BMS <span class="version">v2.0</span></h1>
      </transition>
    </div>

    <!-- 📋 لیست منوها -->
    <nav class="sidebar-menu">
      <ul>
        <li v-for="item in menuItems" :key="item.path" class="menu-item">
          <router-link 
            :to="item.path" 
            class="menu-link" 
            active-class="active-link"
            :title="collapsed ? item.title : ''"
          >
            <!-- آیکون SVG -->
            <span class="icon-wrapper" v-html="item.icon"></span>
            
            <!-- متن منو -->
            <transition name="fade">
              <span v-if="!collapsed" class="menu-text">{{ item.title }}</span>
            </transition>

            <!-- نشانگر وضعیت (اگر نیاز بود) -->
            <span v-if="!collapsed && item.badge" class="badge">{{ item.badge }}</span>
          </router-link>
        </li>
      </ul>
    </nav>

    <!-- 🦶 پاورقی سایدبار (وضعیت سرور / خروج) -->
    <div class="sidebar-footer">
      <div class="server-status" :class="{ 'collapsed-footer': collapsed }">
        <div class="status-indicator pulse"></div>
        <transition name="fade">
          <div v-if="!collapsed" class="status-text">
            <small>وضعیت شبکه:</small>
            <strong>آنلاین / پایدار</strong>
          </div>
        </transition>
      </div>
      
      <button class="logout-btn" :title="collapsed ? 'خروج' : ''">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" stroke-linecap="round" stroke-linejoin="round"/>
          <polyline points="16 17 21 12 16 7" stroke-linecap="round" stroke-linejoin="round"/>
          <line x1="21" y1="12" x2="9" y2="12" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <transition name="fade">
          <span v-if="!collapsed">خروج از سیستم</span>
        </transition>
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: "SidebarComponent",
  props: {
    collapsed: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      menuItems: [
        {
          title: "داشبورد اصلی",
          path: "/",
          icon: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>'
        },
        {
          title: "تجهیزات (IoT)",
          path: "/devices",
          icon: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect><rect x="9" y="9" width="6" height="6"></rect><line x1="9" y1="1" x2="9" y2="4"></line><line x1="15" y1="1" x2="15" y2="4"></line><line x1="9" y1="20" x2="9" y2="23"></line><line x1="15" y1="20" x2="15" y2="23"></line><line x1="20" y1="9" x2="23" y2="9"></line><line x1="20" y1="14" x2="23" y2="14"></line><line x1="1" y1="9" x2="4" y2="9"></line><line x1="1" y1="14" x2="4" y2="14"></line></svg>',
          badge: "12"
        },
        {
          title: "مدیریت انرژی",
          path: "/energy",
          icon: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>'
        },
        {
          title: "امنیت و دوربین‌ها",
          path: "/security",
          icon: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>'
        },
        {
          title: "سناریوها (Automation)",
          path: "/automation",
          icon: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>'
        },
        {
          title: "گزارش‌گیری",
          path: "/reports",
          icon: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>'
        },
        {
          title: "تنظیمات سیستم",
          path: "/settings",
          icon: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>'
        }
      ]
    };
  }
};
</script>

<style scoped>
.sidebar-content {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 10px 0;
  overflow-x: hidden;
}

/* --- Brand / Logo --- */
.sidebar-brand {
  height: 60px;
  display: flex;
  align-items: center;
  padding: 0 20px;
  margin-bottom: 20px;
  color: var(--color-primary);
}
.logo-icon {
  min-width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(67, 97, 238, 0.1);
  border-radius: 10px;
  margin-left: 10px;
}
.logo-icon svg {
  width: 24px;
  height: 24px;
}
.brand-text {
  font-size: 1.2rem;
  font-weight: 800;
  margin: 0;
  white-space: nowrap;
  color: var(--text-main);
}
.version {
  font-size: 0.6rem;
  background: var(--color-primary);
  color: white;
  padding: 2px 5px;
  border-radius: 4px;
  margin-right: 5px;
  vertical-align: super;
}

/* --- Navigation --- */
.sidebar-menu {
  flex-grow: 1;
  overflow-y: auto;
}
.sidebar-menu ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.menu-item {
  margin-bottom: 5px;
  position: relative;
}

.menu-link {
  display: flex;
  align-items: center;
  padding: 12px 20px;
  color: var(--text-muted);
  text-decoration: none;
  transition: all 0.2s ease-in-out;
  border-right: 3px solid transparent;
  white-space: nowrap;
  overflow: hidden;
}

.menu-link:hover {
  color: var(--text-main);
  background-color: rgba(0, 0, 0, 0.03);
}
.dark-theme .menu-link:hover {
  background-color: rgba(255, 255, 255, 0.05);
}

/* Active State */
.active-link {
  color: var(--color-primary);
  background: linear-gradient(270deg, rgba(67, 97, 238, 0.1) 0%, transparent 100%);
  border-right-color: var(--color-primary);
  font-weight: 600;
}

.icon-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 30px;
  margin-left: 10px;
  transition: transform 0.2s;
}
.active-link .icon-wrapper {
  transform: scale(1.1);
}

.menu-text {
  flex-grow: 1;
}

.badge {
  background-color: var(--color-danger);
  color: white;
  font-size: 0.7rem;
  padding: 2px 6px;
  border-radius: 10px;
  min-width: 18px;
  text-align: center;
}

/* --- Footer --- */
.sidebar-footer {
  padding: 15px 20px;
  border-top: 1px solid var(--border-color);
  background-color: rgba(0,0,0,0.02);
}

.server-status {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
  color: var(--text-muted);
}
.server-status.collapsed-footer {
  justify-content: center;
  margin-bottom: 10px;
}

.status-indicator {
  width: 10px;
  height: 10px;
  background-color: var(--color-success);
  border-radius: 50%;
  margin-left: 10px;
}
.pulse {
  box-shadow: 0 0 0 rgba(46, 196, 182, 0.4);
  animation: pulse-green 2s infinite;
}
@keyframes pulse-green {
  0% { box-shadow: 0 0 0 0 rgba(46, 196, 182, 0.7); }
  70% { box-shadow: 0 0 0 10px rgba(46, 196, 182, 0); }
  100% { box-shadow: 0 0 0 0 rgba(46, 196, 182, 0); }
}

.logout-btn {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 10px;
  background: transparent;
  border: 1px solid var(--border-color);
  color: var(--text-muted);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}
.logout-btn:hover {
  background-color: var(--color-danger);
  color: white;
  border-color: var(--color-danger);
}

/* --- Transitions --- */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  width: 0;
}
</style>
