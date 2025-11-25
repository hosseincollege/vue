<template>
  <div class="dashboard-container">
    <!-- ✅ هدر و دکمه‌های عملیات -->
    <div class="dashboard-header">
      <h2>داشبورد مدیریت هوشمند (BMS)</h2>
      <div class="actions">
        <button @click="fetchData" class="btn-refresh">بروزرسانی</button>
        <button @click="simulateData" class="btn-simulate">شبیه‌سازی محیطی</button>
      </div>
    </div>

    <!-- 📊 کارت‌های آماری -->
    <div class="stats-grid">
      <div class="card">
        <h3>کل دستگاه‌ها</h3>
        <div class="value">{{ stats.totalDevices || 0 }}</div>
      </div>
      <div class="card success">
        <h3>دستگاه‌های آنلاین</h3>
        <div class="value">{{ stats.onlineDevices || 0 }}</div>
      </div>
      <div class="card danger">
        <h3>هشدارهای بحرانی</h3>
        <div class="value">{{ stats.criticalAlerts || 0 }}</div>
      </div>
      <div class="card info">
        <h3>زمان سرور</h3>
        <div class="value small-text">{{ formatTime(stats.serverTime) }}</div>
      </div>
    </div>

    <!-- 🧩 جدول زنده تجهیزات -->
    <div class="device-list-section">
      <h3>وضعیت زنده تجهیزات</h3>
      <table class="custom-table">
        <thead>
          <tr>
            <th>نام دستگاه</th>
            <th>نوع</th>
            <th>وضعیت ارتباط</th>
            <th>مقدار سنسور</th>
            <th>سطح هشدار</th>
            <th>عملیات</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="device in stats.devicesList" :key="device.id">
            <td>{{ device.deviceName }}</td>
            <td>{{ device.deviceType }}</td>
            <td>
              <span
                :class="['status-badge', device.online ? 'online' : 'offline']"
              >
                {{ device.online ? "متصل" : "قطع" }}
              </span>
            </td>
            <td>{{ device.latestTelemetryValue }}</td>
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
</template>

<script>
export default {
  name: "DashboardView",
  data() {
    return {
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
    console.log("✅ Dashboard mounted — initiating data fetch...");
    this.fetchData();
    // بروزرسانی خودکار هر 5 ثانیه
    this.timer = setInterval(this.fetchData, 5000);
  },
  beforeUnmount() {
    if (this.timer) clearInterval(this.timer);
  },
  methods: {
    // 📡 گرفتن داده‌ها از بک‌اند جاوا
    fetchData() {
      console.log("📨 Sending GET → /devices/dashboard");
      this.$http
        .get("/devices/dashboard")
        .then((response) => {
          console.log("✅ Dashboard Response:", response);
          this.stats.totalDevices = response.totalDevices;
          this.stats.onlineDevices = response.onlineDevices;
          this.stats.criticalAlerts = response.criticalAlerts;
          this.stats.serverTime = response.serverTime;
          this.stats.devicesList = response.devices || response.devicesList || [];
        })
        .catch((error) => {
          console.error("❌ Failed to fetch dashboard data:", error);
          alert("خطا در ارتباط با سرور: " + error.message);
        });
    },

    // 🚀 اجرای سناریوی محیطی
    simulateData() {
      console.log("📨 Sending POST → /devices/scenario/hotel");
      this.$http
        .post("/devices/scenario/hotel")
        .then(() => {
          console.log("✅ Scenario executed successfully");
          this.fetchData();
          alert("سناریوی محیطی با موفقیت اجرا شد.");
        })
        .catch((error) => {
          console.error("❌ Error triggering scenario:", error);
          alert("خطا در اجرای سناریو: " + error.message);
        });
    },

    // 🔄 تغییر وضعیت دستگاه خاص
    toggleDevice(id) {
      console.log(`🔄 Sending PUT → /devices/${id}/toggle`);
      this.$http
        .put(`/devices/${id}/toggle`)
        .then(() => {
          console.log("✅ Device toggled successfully");
          this.fetchData();
        })
        .catch((error) => {
          console.error("❌ Error toggling device:", error);
          alert("خطا در تغییر وضعیت دستگاه: " + error.message);
        });
    },

    // 🕒 قالب‌بندی زمان
    formatTime(timeStr) {
      if (!timeStr) return "---";
      try {
        return new Date(timeStr).toLocaleTimeString("fa-IR");
      } catch {
        return timeStr;
      }
    },

    // 🎨 تعیین رنگ سطح هشدار
    getAlertClass(level) {
      if (level === "CRITICAL") return "bg-red";
      if (level === "WARNING") return "bg-orange";
      return "bg-green";
    },
  },
};
</script>

<style scoped>
.dashboard-container {
  padding: 20px;
  direction: rtl;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.actions button {
  margin-right: 10px;
  padding: 8px 15px;
  cursor: pointer;
  border: none;
  border-radius: 5px;
  color: white;
}

.btn-refresh {
  background-color: #3498db;
}
.btn-simulate {
  background-color: #9b59b6;
}
.btn-small {
  padding: 4px 8px;
  background-color: #7f8c8d;
  color: white;
  border: none;
  border-radius: 3px;
  cursor: pointer;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.card {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  text-align: center;
  border-top: 4px solid #ccc;
}
.card.success {
  border-top-color: #2ecc71;
}
.card.danger {
  border-top-color: #e74c3c;
}
.card.info {
  border-top-color: #3498db;
}

.card h3 {
  margin: 0 0 10px;
  font-size: 0.9rem;
  color: #777;
}
.card .value {
  font-size: 2rem;
  font-weight: bold;
  color: #333;
}
.small-text {
  font-size: 1rem !important;
}

.custom-table {
  width: 100%;
  border-collapse: collapse;
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
}

.custom-table th,
.custom-table td {
  padding: 12px 15px;
  text-align: right;
  border-bottom: 1px solid #eee;
}

.custom-table th {
  background-color: #f8f9fa;
  font-weight: bold;
  color: #555;
}

.status-badge {
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.8rem;
  color: white;
}
.status-badge.online {
  background-color: #2ecc71;
}
.status-badge.offline {
  background-color: #95a5a6;
}

.alert-badge {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.8rem;
  color: white;
}
.bg-red {
  background-color: #e74c3c;
}
.bg-orange {
  background-color: #f39c12;
}
.bg-green {
  background-color: #2ecc71;
}
</style>
