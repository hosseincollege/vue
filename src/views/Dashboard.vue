<template>
  <div class="page-container">
    <!-- هدر و دکمه‌های عملیات -->
    <div class="dashboard-header">
      <div class="title-section">
        <h2>داشبورد مدیریت هوشمند</h2>
        <p class="subtitle">نمای کلی وضعیت سیستم BMS</p>
      </div>
      <div class="actions">
        <button @click="fetchData" class="btn-primary" :disabled="loading">
          <span v-if="loading" class="spinner">↻</span>
          {{ loading ? 'در حال دریافت...' : 'بروزرسانی' }}
        </button>
        <button @click="simulateData" class="btn-secondary">
          ⚡ شبیه‌سازی محیطی
        </button>
      </div>
    </div>

    <!-- کارت‌های آماری (KPI Cards) -->
    <!-- از کلاس panel-card استفاده شده که با متغیرهای تم پروژه هماهنگ است -->
    <div class="stats-grid">
      <div class="panel-card">
        <div class="icon-box blue">📊</div>
        <div class="card-content">
          <span class="label">کل دستگاه‌ها</span>
          <div class="value">{{ stats.totalDevices || 0 }}</div>
        </div>
      </div>
      
      <div class="panel-card">
        <div class="icon-box green">📡</div>
        <div class="card-content">
          <span class="label">دستگاه‌های آنلاین</span>
          <div class="value">{{ stats.onlineDevices || 0 }}</div>
        </div>
      </div>
      
      <div class="panel-card">
        <div class="icon-box red">⚠️</div>
        <div class="card-content">
          <span class="label">هشدارهای بحرانی</span>
          <div class="value">{{ stats.criticalAlerts || 0 }}</div>
        </div>
      </div>
      
      <div class="panel-card">
        <div class="icon-box purple">🕒</div>
        <div class="card-content">
          <span class="label">زمان سرور</span>
          <div class="value small-text">{{ formatTime(stats.serverTime) }}</div>
        </div>
      </div>
    </div>

    <!-- جدول تجهیزات -->
    <div class="panel-card table-section">
      <div class="section-header">
        <h3>وضعیت زنده تجهیزات</h3>
      </div>
      
      <div v-if="stats.devicesList.length === 0" class="empty-state">
        <p>داده‌ای یافت نشد یا ارتباط با سرور قطع است.</p>
      </div>

      <div v-else class="table-responsive">
        <table class="custom-table">
          <thead>
            <tr>
              <th>نام دستگاه</th>
              <th>نوع</th>
              <th>وضعیت</th>
              <th>مقدار سنسور</th>
              <th>هشدار</th>
              <th>عملیات</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="device in stats.devicesList" :key="device.id">
              <td class="fw-bold">{{ device.deviceName }}</td>
              <td><span class="type-badge">{{ device.deviceType }}</span></td>
              <td>
                <div class="status-wrapper">
                  <span :class="['dot', device.online ? 'online' : 'offline']"></span>
                  <span :class="device.online ? 'text-green' : 'text-muted'">
                    {{ device.online ? "آنلاین" : "آفلاین" }}
                  </span>
                </div>
              </td>
              <td class="mono-font">{{ device.latestTelemetryValue }}</td>
              <td>
                <span :class="['alert-badge', getAlertClass(device.alertLevel)]">
                  {{ device.alertLevel }}
                </span>
              </td>
              <td>
                <button @click="toggleDevice(device.id)" class="btn-small">
                  تغییر وضعیت
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';


export default {
  name: "DashboardView",
  data() {
    return {
      loading: false,
      stats: {
        totalDevices: 0,
        onlineDevices: 0,
        criticalAlerts: 0,
        serverTime: null,
        devicesList: [],
      },
      timer: null,
    };
  },
  mounted() {
    this.fetchData();
    // بروزرسانی خودکار هر 5 ثانیه
    this.timer = setInterval(this.fetchData, 5000);
  },
  beforeUnmount() {
    if (this.timer) clearInterval(this.timer);
  },
  methods: {
    fetchData() {
      this.loading = true;
      this.$http.get("/devices/dashboard")
        .then((response) => {
          const data = response;
          this.stats.totalDevices = data.totalDevices;
          this.stats.onlineDevices = data.onlineDevices;
          this.stats.criticalAlerts = data.criticalAlerts;
          this.stats.serverTime = data.serverTime;
          this.stats.devicesList = data.devices || data.devicesList || [];
        })
        .catch((error) => {
          console.error("❌ خطا در دریافت اطلاعات:", error);
        })
        .finally(() => {
          this.loading = false;
        });
    },
    simulateData() {
      this.$http.post("/devices/scenario/hotel")
        .then(() => { this.fetchData(); })
        .catch((error) => console.error(error));
    },

    toggleDevice(id) {
      this.$http.put(`/devices/${id}/toggle`)
        .then(() => { this.fetchData(); })
        .catch((error) => console.error(error));
    },

    formatTime(timeStr) {
      if (!timeStr) return "---";
      try { return new Date(timeStr).toLocaleTimeString("fa-IR"); } 
      catch { return timeStr; }
    },
    getAlertClass(level) {
      if (level === "CRITICAL") return "bg-critical";
      if (level === "WARNING") return "bg-warning";
      return "bg-normal";
    },
  },
};
</script>

<style scoped>
/* 
   نکته مهم: در اینجا از متغیرهایی استفاده شده که در Devices.vue دیدیم.
   این متغیرها (مانند --bg-panel) باعث می‌شوند تم به درستی کار کند.
   مقادیر پیش‌فرض (Fallback) گذاشته شده تا اگر متغیر پیدا نشد، صفحه سفید نماند.
*/

.page-container {
  padding: 25px;
  /* استفاده از رنگ متن اصلی تم */
  color: var(--text-main, #2c3e50); 
  direction: rtl;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
}

/* --- Header --- */
.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  flex-wrap: wrap;
  gap: 15px;
}

.title-section h2 {
  margin: 0 0 5px 0;
  font-size: 1.8rem;
}

.subtitle {
  /* رنگ متن فرعی تم */
  color: var(--text-muted, #7f8c8d); 
  margin: 0;
  font-size: 0.95rem;
}

.actions {
  display: flex;
  gap: 10px;
}

/* دکمه‌ها مشابه فایل Devices.vue */
.btn-primary {
  background-color: var(--color-primary, #3498db);
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: transform 0.2s;
}
.btn-primary:hover { transform: translateY(-2px); }
.btn-primary:disabled { opacity: 0.7; cursor: not-allowed; }

.btn-secondary {
  background-color: var(--bg-panel, #fff);
  border: 1px solid var(--border-color, #ddd);
  color: var(--text-main, #333);
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
  transition: 0.2s;
}
.btn-secondary:hover { background-color: var(--border-color, #eee); }

/* --- Stats Grid --- */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

/* این کلاس کلیدی است: استفاده از رنگ پس‌زمینه پنل‌ها از تم */
.panel-card {
  background-color: var(--bg-panel, #ffffff);
  border: 1px solid var(--border-color, #eee);
  box-shadow: var(--shadow-md, 0 2px 8px rgba(0,0,0,0.05));
  border-radius: 12px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 15px;
  transition: transform 0.2s;
}

.panel-card:hover { transform: translateY(-3px); }

/* آیکون‌ها */
.icon-box {
  width: 50px;
  height: 50px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
}
.icon-box.blue { background: rgba(52, 152, 219, 0.1); color: #3498db; }
.icon-box.green { background: rgba(46, 204, 113, 0.1); color: #2ecc71; }
.icon-box.red { background: rgba(231, 76, 60, 0.1); color: #e74c3c; }
.icon-box.purple { background: rgba(155, 89, 182, 0.1); color: #9b59b6; }

.card-content {
  display: flex;
  flex-direction: column;
}

.label {
  font-size: 0.9rem;
  color: var(--text-muted, #7f8c8d);
  margin-bottom: 5px;
}

.value {
  font-size: 1.8rem;
  font-weight: 800;
  color: var(--text-main, #2c3e50);
}
.small-text { font-size: 1.2rem; }

/* --- Table Section --- */
.table-section {
  display: block; /* Reset flex from panel-card */
  padding: 0; /* Remove padding for full-width table */
  overflow: hidden; /* For rounded corners */
}

.section-header {
  padding: 20px;
  border-bottom: 1px solid var(--border-color, #eee);
}
.section-header h3 { margin: 0; font-size: 1.1rem; }

.table-responsive {
  width: 100%;
  overflow-x: auto;
}

.custom-table {
  width: 100%;
  border-collapse: collapse;
}

.custom-table th, .custom-table td {
  padding: 15px 20px;
  text-align: right;
  border-bottom: 1px solid var(--border-color, #eee);
  color: var(--text-main, #333);
}

.custom-table th {
  /* استفاده از شفافیت برای هدر جدول تا رنگ زمینه پنل را بگیرد */
  background-color: rgba(127, 140, 141, 0.05);
  color: var(--text-muted, #7f8c8d);
  font-weight: 600;
  font-size: 0.9rem;
}

/* Table Elements */
.fw-bold { font-weight: bold; }
.mono-font { font-family: monospace; font-size: 1.1em; }

.type-badge {
  background-color: rgba(127, 140, 141, 0.1);
  color: var(--text-main);
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 0.85rem;
}

.status-wrapper {
  display: flex;
  align-items: center;
  gap: 8px;
}
.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}
.dot.online { background-color: var(--color-success, #2ecc71); box-shadow: 0 0 5px var(--color-success, #2ecc71); }
.dot.offline { background-color: var(--text-muted, #95a5a6); }

.text-green { color: var(--color-success, #2ecc71); font-weight: bold; }
.text-muted { color: var(--text-muted, #95a5a6); }

.alert-badge {
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: bold;
}
.bg-critical { background-color: rgba(231, 76, 60, 0.15); color: #e74c3c; }
.bg-warning { background-color: rgba(243, 156, 18, 0.15); color: #f39c12; }
.bg-normal { background-color: rgba(46, 204, 113, 0.15); color: #2ecc71; }

.btn-small {
  padding: 6px 12px;
  background-color: var(--bg-body, #f4f6f9); /* پس زمینه دکمه */
  border: 1px solid var(--border-color, #ddd);
  color: var(--text-main);
  border-radius: 6px;
  cursor: pointer;
  transition: 0.2s;
}
.btn-small:hover {
  border-color: var(--color-primary, #3498db);
  color: var(--color-primary, #3498db);
}

.empty-state {
  padding: 40px;
  text-align: center;
  color: var(--text-muted);
}
.spinner { display: inline-block; animation: spin 1s linear infinite; margin-left: 5px; }
@keyframes spin { 100% { transform: rotate(360deg); } }
</style>
