<!-- src/components/Navbar.vue -->
<template>
  <nav class="navbar">
    <div class="left-section">
      <div class="user-profile">
        <img src="@/assets/logo.png" alt="User" class="avatar" />
        <div class="user-info">
          <span class="name">مدیر سیستم</span>
          <span class="role">دسترسی کامل</span>
        </div>
      </div>
    </div>

    <div class="right-section">
      <h3 class="page-title">داشبورد کنترل هوشمند</h3>
      <button class="refresh-btn" @click="refreshData">🔄 بروزرسانی</button>
    </div>
  </nav>
</template>

<script>
export default {
  name: "NavbarComponent",
  methods: {
    refreshData() {
      // بعداً اینجا را به بک‌اند وصل می‌کنیم تا دیتا رفرش شود
      console.log("درخواست بروزرسانی داده‌ها...");
      // مثلا می‌توانیم یک ایونت بفرستیم
      this.$emit("refresh");
    },
  },
};
</script>

<style scoped>
.navbar {
  height: 70px;
  background-color: #ffffff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 30px;
  box-shadow: 0 2px 15px rgba(0, 0, 0, 0.05);
  /* فاصله از سمت راست برای اینکه روی سایدبار نیفتد */
  margin-right: 250px;
  position: sticky;
  top: 0;
  z-index: 900;
}

.page-title {
  margin: 0;
  color: #2c3e50;
  font-weight: 600;
}

.right-section {
  display: flex;
  align-items: center;
  gap: 20px;
}

.refresh-btn {
  background-color: #f0f2f5;
  border: none;
  padding: 8px 15px;
  border-radius: 8px;
  cursor: pointer;
  transition: 0.2s;
  color: #555;
}

.refresh-btn:hover {
  background-color: #e1e4e8;
  color: #000;
}

.left-section {
  display: flex;
  align-items: center;
}

.user-profile {
  display: flex;
  align-items: center;
  gap: 10px;
  text-align: left; /* چون چپ چین است */
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 2px solid #e1e4e8;
}

.user-info {
  display: flex;
  flex-direction: column;
}

.name {
  font-size: 0.9rem;
  font-weight: bold;
  color: #333;
}

.role {
  font-size: 0.75rem;
  color: #888;
}
</style>
