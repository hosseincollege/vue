<!-- src/components/Sidebar.vue -->
<template>
  <aside class="sidebar">
    <div class="logo-container">
      <h2>Smart BMS</h2>
      <span class="status-dot"></span>
    </div>

    <ul class="menu-list">
      <li class="menu-item">
        <router-link to="/" active-class="active">
          <span class="icon">📊</span>
          <span class="text">داشبورد اصلی</span>
        </router-link>
      </li>
      <li class="menu-item">
        <router-link to="/devices" active-class="active">
          <span class="icon">🌡️</span>
          <span class="text">تجهیزات دما</span>
        </router-link>
      </li>
      <li class="menu-item">
        <router-link to="/security" active-class="active">
          <span class="icon">🔒</span>
          <span class="text">سیستم امنیتی</span>
        </router-link>
      </li>
      <li class="menu-item">
        <router-link to="/energy" active-class="active">
          <span class="icon">⚡</span>
          <span class="text">مصرف انرژی</span>
        </router-link>
      </li>
      <li class="menu-item divider"></li>
      <li class="menu-item">
        <router-link to="/settings" active-class="active">
          <span class="icon">⚙️</span>
          <span class="text">تنظیمات</span>
        </router-link>
      </li>
    </ul>

    <div class="server-status">
      <p>وضعیت سرور:</p>
      <small class="connected">متصل به Spring Boot</small>
    </div>
  </aside>
</template>

<script>
export default {
  name: "SidebarComponent",
};
</script>

<style scoped>
.sidebar {
  width: 250px;
  height: 100vh;
  background: #1e1e2f; /* رنگ تیره برای حس صنعتی */
  color: #ffffff;
  display: flex;
  flex-direction: column;
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.3);
  position: fixed;
  right: 0; /* برای حالت راست‌چین (فارسی) */
  top: 0;
  z-index: 1000;
  transition: all 0.3s ease;
}

.logo-container {
  padding: 20px;
  text-align: center;
  border-bottom: 1px solid #34344a;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.logo-container h2 {
  margin: 0;
  font-size: 1.5rem;
  color: #00d4ff; /* آبی نئونی */
}

.status-dot {
  width: 10px;
  height: 10px;
  background-color: #00ff88;
  border-radius: 50%;
  box-shadow: 0 0 10px #00ff88;
  animation: pulse 2s infinite;
}

.menu-list {
  list-style: none;
  padding: 0;
  margin: 20px 0;
  flex-grow: 1;
}

.menu-item a {
  display: flex;
  align-items: center;
  padding: 15px 25px;
  color: #aab0c6;
  text-decoration: none;
  transition: all 0.3s;
  border-right: 3px solid transparent;
}

.menu-item a:hover {
  background-color: #27293d;
  color: #fff;
}

.menu-item a.active {
  background-color: #27293d;
  color: #00d4ff;
  border-right: 3px solid #00d4ff;
  background: linear-gradient(
    270deg,
    rgba(0, 212, 255, 0.1) 0%,
    transparent 100%
  );
}

.icon {
  margin-left: 10px;
  font-size: 1.2rem;
}

.menu-item.divider {
  height: 1px;
  background-color: #34344a;
  margin: 10px 20px;
}

.server-status {
  padding: 20px;
  background-color: #181826;
  font-size: 0.85rem;
  text-align: center;
}

.connected {
  color: #00ff88;
  font-weight: bold;
}

@keyframes pulse {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
  100% {
    opacity: 1;
  }
}
</style>
