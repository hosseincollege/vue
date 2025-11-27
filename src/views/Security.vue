<template>
  <div class="page-container">
    
    <!-- هدر و کنترل اصلی سیستم -->
    <div class="security-header">
      <div>
        <h2 class="page-title">مرکز کنترل امنیت</h2>
        <p class="page-subtitle">پایش وضعیت دوربین‌ها و سنسورهای حفاظتی</p>
      </div>
      
      <div class="system-control">
        <div class="status-indicator">
          <span class="status-text">وضعیت سیستم:</span>
          <span :class="['badge', systemStatus === 'ARMED' ? 'badge-danger' : 'badge-success']">
            {{ systemStatus === 'ARMED' ? 'مسلح (ARMED)' : 'غیرمسلح (DISARMED)' }}
          </span>
        </div>
        <button 
          @click="toggleSystem" 
          :class="['btn-action', systemStatus === 'ARMED' ? 'btn-disarm' : 'btn-arm']"
        >
          {{ systemStatus === 'ARMED' ? '🔓 غیرفعال‌سازی' : '🔒 فعال‌سازی کامل' }}
        </button>
      </div>
    </div>

    <!-- بخش دوربین‌های مداربسته -->
    <section class="cctv-section">
      <div class="section-header">
        <h3>🎥 دوربین‌های مداربسته</h3>
        <span class="live-indicator">● LIVE</span>
      </div>
      
      <div class="cctv-grid">
        <div v-for="cam in cameras" :key="cam.id" class="camera-feed">
          <!-- شبیه‌سازی تصویر دوربین -->
          <div class="feed-placeholder" :style="{ backgroundColor: cam.color }">
            <span class="cam-icon">📷</span>
            <span class="cam-overlay">{{ cam.location }}</span>
            <span class="rec-badge">REC</span>
          </div>
          <div class="cam-info">
            <span class="cam-name">CAM-{{ cam.id }}</span>
            <span class="cam-status">Online</span>
          </div>
        </div>
      </div>
    </section>

    <!-- بخش دو ستونه: لاگ‌های تردد و وضعیت سنسورها -->
    <div class="info-grid">
      
      <!-- لاگ‌های دسترسی (Access Control) -->
      <div class="panel access-logs">
        <div class="panel-header">
          <h3>🛡️ آخرین ترددهای ثبت شده</h3>
          <button class="btn-text">مشاهده همه</button>
        </div>
        <ul class="log-list">
          <li v-for="log in accessLogs" :key="log.id" class="log-item">
            <div class="log-icon" :class="log.authorized ? 'granted' : 'denied'">
              {{ log.authorized ? '✔' : '✖' }}
            </div>
            <div class="log-details">
              <span class="log-user">{{ log.user }}</span>
              <span class="log-location">{{ log.location }}</span>
            </div>
            <div class="log-time">
              <span>{{ log.time }}</span>
              <small>{{ log.authorized ? 'مجاز' : 'غیرمجاز' }}</small>
            </div>
          </li>
        </ul>
      </div>

      <!-- وضعیت سنسورهای محیطی -->
      <div class="panel sensor-status">
        <div class="panel-header">
          <h3>🚨 وضعیت سنسورها</h3>
        </div>
        <div class="sensor-list">
          <div v-for="sensor in sensors" :key="sensor.id" class="sensor-card" :class="{ 'triggered': sensor.triggered }">
            <div class="sensor-header">
              <span class="sensor-type">{{ sensor.type }}</span>
              <span class="sensor-zone">{{ sensor.zone }}</span>
            </div>
            <div class="sensor-state">
              {{ sensor.triggered ? '⚠️ خطر' : '✅ نرمال' }}
            </div>
          </div>
        </div>
      </div>

    </div>

  </div>
</template>

<script>
export default {
  name: "SecurityView",
  data() {
    return {
      systemStatus: "ARMED", // ARMED or DISARMED
      cameras: [
        { id: "01", location: "ورودی اصلی", color: "#2c3e50" },
        { id: "02", location: "پارکینگ منفی ۱", color: "#34495e" },
        { id: "03", location: "لابی طبقه همکف", color: "#7f8c8d" },
        { id: "04", location: "اتاق سرور (محرمانه)", color: "#000000" },
      ],
      accessLogs: [
        { id: 1, user: "علی محمدی (مدیر)", location: "اتاق سرور", time: "10:45", authorized: true },
        { id: 2, user: "کارت ناشناس", location: "درب ورودی", time: "10:42", authorized: false },
        { id: 3, user: "سارا جلالی", location: "آزمایشگاه", time: "09:30", authorized: true },
        { id: 4, user: "رضا کاظمی", location: "پارکینگ", time: "08:15", authorized: true },
      ],
      sensors: [
        { id: 1, type: "سنسور حرکت", zone: "راهرو اصلی", triggered: false },
        { id: 2, type: "سنسور دود", zone: "آشپزخانه", triggered: false },
        { id: 3, type: "مگنت درب", zone: "درب پشت بام", triggered: true }, // وضعیت خطر
        { id: 4, type: "سنسور شکست شیشه", zone: "پنجره لابی", triggered: false },
      ]
    };
  },
  methods: {
    toggleSystem() {
      // در واقعیت این درخواست به بک‌اند ارسال می‌شود
      if (this.systemStatus === "ARMED") {
        const confirmDisarm = confirm("آیا مطمئن هستید که می‌خواهید سیستم امنیتی را غیرفعال کنید؟");
        if (confirmDisarm) {
          this.systemStatus = "DISARMED";
          this.$root.$emit('show-toast', { message: 'سیستم امنیتی غیرفعال شد', type: 'warning' });
        }
      } else {
        this.systemStatus = "ARMED";
        // استفاده از روش Toast که در App.vue پیاده کردیم (یا مشابه آن)
        console.log("System Armed"); 
      }
    }
  }
};
</script>

<style scoped>
.page-container {
  padding: 10px;
  color: var(--text-main);
}

/* Header Styles */
.security-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
  flex-wrap: wrap;
  gap: 15px;
}

.page-title { font-size: 1.8rem; margin: 0 0 5px 0; }
.page-subtitle { color: var(--text-muted); font-size: 0.9rem; margin: 0; }

.system-control {
  display: flex;
  align-items: center;
  gap: 15px;
  background: var(--bg-panel);
  padding: 10px 20px;
  border-radius: 12px;
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--border-color);
}

.status-text { font-size: 0.9rem; margin-left: 8px; }

.badge {
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: bold;
  color: white;
}
.badge-danger { background-color: #e74c3c; box-shadow: 0 0 8px rgba(231, 76, 60, 0.4); }
.badge-success { background-color: #2ecc71; }

.btn-action {
  border: none;
  padding: 8px 16px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
  transition: 0.2s;
  color: white;
}
.btn-arm { background-color: #3498db; }
.btn-arm:hover { background-color: #2980b9; }
.btn-disarm { background-color: #e74c3c; }
.btn-disarm:hover { background-color: #c0392b; }

/* CCTV Section */
.cctv-section {
  margin-bottom: 30px;
}
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}
.live-indicator {
  color: #e74c3c;
  font-weight: bold;
  font-size: 0.9rem;
  animation: blink 1.5s infinite;
}

.cctv-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 15px;
}

.camera-feed {
  background: #000;
  border-radius: 8px;
  overflow: hidden;
  position: relative;
  border: 2px solid #333;
}

.feed-placeholder {
  height: 180px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  color: rgba(255,255,255,0.3);
}

.cam-icon { font-size: 3rem; }

.cam-overlay {
  position: absolute;
  bottom: 10px;
  left: 10px;
  color: white;
  background: rgba(0,0,0,0.6);
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 0.8rem;
}

.rec-badge {
  position: absolute;
  top: 10px;
  right: 10px;
  color: white;
  background: red;
  padding: 2px 6px;
  border-radius: 3px;
  font-size: 0.7rem;
  font-weight: bold;
}

.cam-info {
  padding: 8px 12px;
  background: #222;
  color: #ccc;
  display: flex;
  justify-content: space-between;
  font-size: 0.85rem;
}
.cam-status { color: #2ecc71; }

/* Info Grid (Logs & Sensors) */
.info-grid {
  display: grid;
  grid-template-columns: 3fr 2fr;
  gap: 20px;
}
@media (max-width: 768px) {
  .info-grid { grid-template-columns: 1fr; }
}

.panel {
  background: var(--bg-panel);
  border-radius: 12px;
  padding: 20px;
  border: 1px solid var(--border-color);
  box-shadow: var(--shadow-md);
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  border-bottom: 1px solid var(--border-color);
  padding-bottom: 10px;
}
.panel-header h3 { margin: 0; font-size: 1.1rem; }
.btn-text { background: none; border: none; color: var(--color-primary); cursor: pointer; font-size: 0.9rem; }

/* Access Logs List */
.log-list { list-style: none; padding: 0; margin: 0; }
.log-item {
  display: flex;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid var(--border-color);
}
.log-item:last-child { border-bottom: none; }

.log-icon {
  width: 36px; height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 12px;
  font-size: 1rem;
  flex-shrink: 0;
}
.granted { background: rgba(46, 204, 113, 0.15); color: #2ecc71; }
.denied { background: rgba(231, 76, 60, 0.15); color: #e74c3c; }

.log-details { flex-grow: 1; display: flex; flex-direction: column; }
.log-user { font-weight: bold; font-size: 0.9rem; }
.log-location { font-size: 0.8rem; color: var(--text-muted); }

.log-time {
  text-align: left;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  font-size: 0.8rem;
  color: var(--text-muted);
}

/* Sensor Cards */
.sensor-list {
  display: grid;
  gap: 10px;
}

.sensor-card {
  background: rgba(0,0,0,0.02);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.3s;
}
.dark-theme .sensor-card { background: rgba(255,255,255,0.05); }

.sensor-card.triggered {
  background: rgba(231, 76, 60, 0.1);
  border-color: #e74c3c;
  animation: pulse-red 2s infinite;
}

.sensor-header { display: flex; flex-direction: column; }
.sensor-type { font-weight: bold; font-size: 0.9rem; }
.sensor-zone { font-size: 0.8rem; color: var(--text-muted); }

.sensor-state { font-weight: bold; font-size: 0.85rem; }

/* Keyframes */
@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

@keyframes pulse-red {
  0% { box-shadow: 0 0 0 0 rgba(231, 76, 60, 0.4); }
  70% { box-shadow: 0 0 0 10px rgba(231, 76, 60, 0); }
  100% { box-shadow: 0 0 0 0 rgba(231, 76, 60, 0); }
}
</style>
