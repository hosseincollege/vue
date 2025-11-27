<template>
  <div class="page-container">
    
    <!-- هدر و فیلتر زمانی -->
    <div class="page-header">
      <div>
        <h2 class="page-title">مدیریت مصرف انرژی</h2>
        <p class="page-subtitle">تحلیل و پایش مصرف برق ساختمان در ۲۴ ساعت گذشته</p>
      </div>
      <div class="date-filter">
        <button class="btn-filter active">روزانه</button>
        <button class="btn-filter">هفتگی</button>
        <button class="btn-filter">ماهانه</button>
      </div>
    </div>

    <!-- کارت‌های خلاصه وضعیت -->
    <div class="stats-row">
      <div class="stat-card">
        <div class="icon-bg blue">⚡</div>
        <div class="stat-info">
          <span class="label">مصرف کل</span>
          <h3 class="value">{{ stats.totalUsage }} <small>kWh</small></h3>
          <span class="trend up">↑ 12% نسبت به دیروز</span>
        </div>
      </div>

      <div class="stat-card">
        <div class="icon-bg green">💰</div>
        <div class="stat-info">
          <span class="label">هزینه تخمینی</span>
          <h3 class="value">{{ stats.cost }} <small>تومان</small></h3>
          <span class="trend down">↓ 5% صرفه‌جویی</span>
        </div>
      </div>

      <div class="stat-card">
        <div class="icon-bg orange">🔥</div>
        <div class="stat-info">
          <span class="label">پیک مصرف</span>
          <h3 class="value">{{ stats.peakTime }}</h3>
          <span class="sub-text">فشار روی شبکه</span>
        </div>
      </div>
    </div>

    <!-- بخش نمودارها (CSS Charts) -->
    <div class="charts-grid">
      
      <!-- نمودار میله‌ای مصرف -->
      <div class="chart-panel">
        <div class="panel-header">
          <h3>نمودار مصرف ساعات گذشته</h3>
        </div>
        <div class="bar-chart-container">
          <div v-for="(item, index) in chartData" :key="index" class="bar-wrapper">
            <div class="bar-track">
              <div class="bar-fill" :style="{ height: item.percent + '%' }">
                <span class="tooltip">{{ item.value }} kW</span>
              </div>
            </div>
            <span class="bar-label">{{ item.label }}</span>
          </div>
        </div>
      </div>

      <!-- لیست پرمصرف‌ترین‌ها -->
      <div class="consumers-panel">
        <div class="panel-header">
          <h3>پرمصرف‌ترین تجهیزات</h3>
        </div>
        <ul class="consumer-list">
          <li v-for="device in topConsumers" :key="device.id" class="consumer-item">
            <div class="device-info">
              <span class="device-name">{{ device.name }}</span>
              <div class="progress-bg">
                <div class="progress-fill" :style="{ width: device.usagePercent + '%' }"></div>
              </div>
            </div>
            <span class="device-usage">{{ device.usage }} kWh</span>
          </li>
        </ul>
      </div>
      
    </div>

  </div>
</template>

<script>
export default {
  name: "EnergyView",
  data() {
    return {
      stats: {
        totalUsage: 0,
        cost: 0,
        peakTime: "--:--"
      },
      chartData: [], // داده‌های نمودار میله‌ای
      topConsumers: [] // لیست دستگاه‌ها
    };
  },
  mounted() {
    // شبیه‌سازی دریافت اطلاعات از سرور
    this.fetchEnergyData();
  },
  methods: {
    fetchEnergyData() {
      // اینجا بعداً به API واقعی وصل می‌شود
      // فعلاً Mock Data می‌سازیم
      setTimeout(() => {
        this.stats = {
          totalUsage: 450.5,
          cost: "1,250,000",
          peakTime: "14:00 - 16:00"
        };

        // داده‌های نمودار (ساعت 1 تا 7)
        this.chartData = [
          { label: "08:00", value: 40, percent: 40 },
          { label: "10:00", value: 65, percent: 65 },
          { label: "12:00", value: 85, percent: 85 },
          { label: "14:00", value: 100, percent: 100 }, // پیک
          { label: "16:00", value: 70, percent: 70 },
          { label: "18:00", value: 55, percent: 55 },
          { label: "20:00", value: 90, percent: 90 },
        ];

        this.topConsumers = [
          { id: 1, name: "چیلر مرکزی (HVAC)", usage: 120, usagePercent: 85 },
          { id: 2, name: "سرور روم", usage: 85, usagePercent: 60 },
          { id: 3, name: "روشنایی پارکینگ", usage: 45, usagePercent: 30 },
          { id: 4, name: "آسانسورها", usage: 30, usagePercent: 20 },
        ];
      }, 500);
    }
  }
};
</script>

<style scoped>
.page-container {
  padding: 10px;
  color: var(--text-main);
}

/* Header */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  flex-wrap: wrap;
  gap: 15px;
}
.page-title { font-size: 1.8rem; margin-bottom: 5px; }
.page-subtitle { color: var(--text-muted); font-size: 0.9rem; }

.date-filter {
  background: var(--bg-panel);
  padding: 5px;
  border-radius: 10px;
  border: 1px solid var(--border-color);
  display: flex;
}
.btn-filter {
  background: transparent;
  border: none;
  padding: 8px 15px;
  cursor: pointer;
  color: var(--text-muted);
  border-radius: 6px;
  transition: 0.3s;
}
.btn-filter.active {
  background: var(--color-primary);
  color: white;
}

/* Stats Row */
.stats-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}
.stat-card {
  background: var(--bg-panel);
  border-radius: 12px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 20px;
  box-shadow: var(--shadow-md);
  border: 1px solid var(--border-color);
}
.icon-bg {
  width: 60px; height: 60px;
  border-radius: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.8rem;
}
.blue { background: rgba(67, 97, 238, 0.1); }
.green { background: rgba(46, 204, 113, 0.1); }
.orange { background: rgba(243, 156, 18, 0.1); }

.stat-info { display: flex; flex-direction: column; }
.label { color: var(--text-muted); font-size: 0.9rem; }
.value { margin: 5px 0; font-size: 1.5rem; font-weight: 700; }
.value small { font-size: 0.9rem; color: var(--text-muted); font-weight: normal; }

.trend { font-size: 0.8rem; font-weight: bold; }
.trend.up { color: #e74c3c; } /* قرمز برای افزایش مصرف */
.trend.down { color: #2ecc71; } /* سبز برای کاهش */

/* Charts Section */
.charts-grid {
  display: grid;
  grid-template-columns: 2fr 1fr; /* دو ستون، اولی پهن‌تر */
  gap: 20px;
}
@media (max-width: 900px) {
  .charts-grid { grid-template-columns: 1fr; }
}

.chart-panel, .consumers-panel {
  background: var(--bg-panel);
  padding: 25px;
  border-radius: 12px;
  border: 1px solid var(--border-color);
  box-shadow: var(--shadow-md);
}

.panel-header h3 { margin-top: 0; font-size: 1.1rem; margin-bottom: 20px; }

/* CSS Bar Chart */
.bar-chart-container {
  display: flex;
  justify-content: space-around;
  align-items: flex-end;
  height: 250px;
  padding-top: 20px;
  border-bottom: 1px solid var(--border-color);
}
.bar-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  height: 100%;
  width: 40px;
}
.bar-track {
  flex-grow: 1;
  width: 12px;
  background: rgba(0,0,0,0.05);
  border-radius: 10px;
  position: relative;
  display: flex;
  align-items: flex-end;
}
.dark-theme .bar-track { background: rgba(255,255,255,0.05); }

.bar-fill {
  width: 100%;
  background: linear-gradient(to top, #4361ee, #3a0ca3);
  border-radius: 10px;
  transition: height 1s ease-out;
  position: relative;
}
.bar-fill:hover .tooltip {
  opacity: 1;
  transform: translateX(-50%) translateY(-5px);
}
.tooltip {
  position: absolute;
  top: -30px;
  left: 50%;
  transform: translateX(-50%);
  background: #333;
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.75rem;
  white-space: nowrap;
  opacity: 0;
  transition: 0.2s;
  pointer-events: none;
}
.bar-label { font-size: 0.8rem; color: var(--text-muted); }

/* Top Consumers List */
.consumer-list {
  list-style: none;
  padding: 0;
  margin: 0;
}
.consumer-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}
.device-info { flex-grow: 1; margin-left: 15px; }
.device-name { display: block; margin-bottom: 5px; font-weight: 600; font-size: 0.9rem; }

.progress-bg {
  height: 6px;
  background: rgba(0,0,0,0.05);
  border-radius: 3px;
  width: 100%;
  overflow: hidden;
}
.dark-theme .progress-bg { background: rgba(255,255,255,0.1); }

.progress-fill {
  height: 100%;
  background: var(--color-primary);
  border-radius: 3px;
}
.device-usage {
  font-weight: bold;
  color: var(--text-muted);
  font-size: 0.85rem;
  min-width: 60px;
  text-align: left;
}
</style>
