<template>
  <div class="page-container">
    <h2>مدیریت کل تجهیزات</h2>
    <p>لیست کامل تمامی سنسورها و عملگرهای موجود در ساختمان.</p>

    <!-- کارت‌های تجهیزات -->
    <div class="devices-grid">
      <div v-for="device in devices" :key="device.id" class="device-card">
        <div class="card-header">
          <span class="device-icon">📡</span>
          <strong>{{ device.deviceName }}</strong>
        </div>

        <div class="card-body">
          <p>نوع: {{ device.deviceType }}</p>
          <p>
            وضعیت:
            <span :class="device.online ? 'text-green' : 'text-gray'">
              {{ device.online ? "آنلاین" : "آفلاین" }}
            </span>
          </p>
          <p>
            مقدار آخرین سنسور:
            <b>{{ device.latestTelemetryValue }}</b>
          </p>

          <button @click="toggleDevice(device.id)" class="btn-toggle">
            تغییر وضعیت
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "DevicesView",
  data() {
    return {
      devices: [],
    };
  },
  mounted() {
    console.log("📡 Devices.vue mounted — در حال ارسال درخواست دریافت لیست تجهیزات...");
    this.loadDevices();
  },
  methods: {
    // 📥 دریافت لیست تجهیزات از بک‌اند
    loadDevices() {
      console.log("📨 Sending GET → /devices/dashboard");
      this.$http
        .get("/devices/dashboard")
        .then((res) => {
          console.log("✅ Response received:", res);
          // سازگاری با پاسخ بک‌اند جاوا (devices یا devicesList)
          this.devices = res.devicesList || res.devices || [];
        })
        .catch((err) => {
          console.error("❌ Network یا API Error:", err);
          alert("خطا در ارتباط با بک‌اند! لطفاً سرور جاوا را بررسی کنید.");
        });
    },

    // 🔄 تغییر وضعیت دستگاه خاص
    toggleDevice(id) {
      console.log(`🔄 Sending PUT → /devices/${id}/toggle`);
      this.$http
        .put(`/devices/${id}/toggle`)
        .then(() => {
          console.log("✅ Device toggled successfully!");
          this.loadDevices();
        })
        .catch((err) => {
          console.error("❌ Error toggling device:", err);
          alert("خطا در تغییر وضعیت دستگاه: " + err.message);
        });
    },
  },
};
</script>

<style scoped>
.page-container {
  padding: 25px;
  direction: rtl;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
}

.devices-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
  margin-top: 25px;
}

.device-card {
  background: #fff;
  padding: 15px;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border: 1px solid #eee;
  transition: transform 0.2s ease;
}
.device-card:hover {
  transform: translateY(-3px);
}

.card-header {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}
.device-icon {
  font-size: 1.4rem;
  margin-left: 8px;
}

.card-body p {
  margin: 8px 0;
}
.text-green {
  color: #27ae60;
  font-weight: bold;
}
.text-gray {
  color: #7f8c8d;
}

.btn-toggle {
  margin-top: 10px;
  padding: 6px 12px;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}
.btn-toggle:hover {
  background-color: #2980b9;
}
</style>
