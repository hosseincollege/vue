<template>
  <div class="page-container">
    
    <!-- هدر صفحه و کنترل‌ها -->
    <div class="page-header">
      <div>
        <h2 class="page-title">مدیریت تجهیزات</h2>
        <p class="page-subtitle">لیست کامل سنسورها و عملگرهای ساختمان</p>
      </div>
      <button class="btn-primary" @click="showAddDeviceModal = true">
        <span class="plus-icon">+</span> افزودن دستگاه جدید
      </button>
    </div>

    <!-- نوار ابزار (جستجو و فیلتر) -->
    <div class="toolbar">
      <div class="search-wrapper">
        <input 
          type="text" 
          v-model="searchQuery" 
          placeholder="جستجو نام یا شناسه دستگاه..." 
          class="search-input"
        />
      </div>
      
      <div class="filter-wrapper">
        <select v-model="filterStatus" class="filter-select">
          <option value="ALL">همه وضعیت‌ها</option>
          <option value="ONLINE">فقط آنلاین</option>
          <option value="OFFLINE">فقط آفلاین</option>
          <option value="CRITICAL">وضعیت بحرانی</option>
        </select>
        
        <div class="view-toggles">
          <button 
            :class="['toggle-btn', { active: viewMode === 'grid' }]" 
            @click="viewMode = 'grid'"
            title="نمایش کارتی"
          >
            ⊞
          </button>
          <button 
            :class="['toggle-btn', { active: viewMode === 'list' }]" 
            @click="viewMode = 'list'"
            title="نمایش لیستی"
          >
            ≡
          </button>
        </div>
      </div>
    </div>

    <!-- لودینگ -->
    <div v-if="isLoading" class="loading-grid">
      <div v-for="n in 4" :key="n" class="skeleton-card"></div>
    </div>

    <!-- محتوای اصلی -->
    <div v-else>
      
      <!-- حالت نمایش کارتی (Grid) -->
      <div v-if="viewMode === 'grid'" class="devices-grid">
        <div v-for="device in filteredDevices" :key="device.id" class="device-card">
          <div class="card-top">
            <div :class="['icon-box', getDeviceTypeClass(device.type)]">
              {{ getDeviceIcon(device.type) }}
            </div>
            <div class="status-indicator">
              <span :class="['dot', device.online ? 'online' : 'offline']"></span>
              <span class="status-text">{{ device.online ? 'آنلاین' : 'آفلاین' }}</span>
            </div>
          </div>
          
          <div class="card-info">
            <h3>{{ device.name }}</h3>
            <span class="device-type">{{ device.type }}</span>
          </div>

          <div class="card-metrics">
            <div class="metric">
              <span class="label">مقدار فعلی:</span>
              <span class="value">{{ device.value }}</span>
            </div>
            <div class="metric">
              <span class="label">مکان:</span>
              <span class="value">{{ device.location }}</span>
            </div>
          </div>

          <div class="card-actions">
            <button 
              @click="toggleDevice(device)" 
              :class="['btn-action', device.isOn ? 'btn-on' : 'btn-off']"
              :disabled="!device.online"
            >
              {{ device.isOn ? 'خاموش کردن' : 'روشن کردن' }}
            </button>
            <button class="btn-icon-only" title="تنظیمات">⚙️</button>
          </div>
        </div>
      </div>

      <!-- حالت نمایش لیستی (Table) -->
      <div v-else class="table-container">
        <table class="device-table">
          <thead>
            <tr>
              <th>نام دستگاه</th>
              <th>نوع</th>
              <th>مکان</th>
              <th>وضعیت</th>
              <th>مقدار</th>
              <th>عملیات</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="device in filteredDevices" :key="device.id">
              <td class="fw-bold">{{ device.name }}</td>
              <td>{{ device.type }}</td>
              <td>{{ device.location }}</td>
              <td>
                <span :class="['badge', device.online ? 'badge-success' : 'badge-gray']">
                  {{ device.online ? 'وصل' : 'قطع' }}
                </span>
              </td>
              <td>{{ device.value }}</td>
              <td>
                <button @click="toggleDevice(device)" class="btn-small">
                  تغییر وضعیت
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- حالت بدون داده -->
      <div v-if="filteredDevices.length === 0" class="empty-state">
        <p>هیچ دستگاهی با این مشخصات یافت نشد.</p>
      </div>

    </div>
  </div>
</template>

<script>
export default {
  name: "DevicesView",
  inject: ['showToast'], // تزریق سیستم نوتیفیکیشن از App.vue
  data() {
    return {
      isLoading: true,
      searchQuery: "",
      filterStatus: "ALL",
      viewMode: "grid",
      showAddDeviceModal: false,
      devices: [],
    };
  },
  computed: {
    filteredDevices() {
      return this.devices.filter(device => {
        const matchesSearch = device.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                              device.type.toLowerCase().includes(this.searchQuery.toLowerCase());
        
        const matchesFilter = this.filterStatus === "ALL" 
          ? true 
          : this.filterStatus === "ONLINE" 
            ? device.online 
            : this.filterStatus === "OFFLINE" 
              ? !device.online 
              : device.alert === "CRITICAL"; // فرض برای فیلتر بحرانی

        return matchesSearch && matchesFilter;
      });
    }
  },
  mounted() {
    this.fetchDevices();
  },
  methods: {
    fetchDevices() {
      this.isLoading = true;
      
      // تلاش برای دریافت از سرور
      this.$http ? this.$http.get("/devices/list")
        .then((res) => {
          this.devices = res.data || [];
          this.isLoading = false;
        })
        .catch(() => {
          // Fallback به داده‌های تستی اگر سرور وصل نبود
          console.warn("Using Mock Data for Devices");
          this.loadMockData();
        }) : this.loadMockData(); // اگر $http تعریف نشده بود
    },

    loadMockData() {
      setTimeout(() => {
        this.devices = [
          { id: 1, name: "ترموستات حال اصلی", type: "Thermostat", location: "طبقه 1", online: true, isOn: true, value: "24°C", alert: "NORMAL" },
          { id: 2, name: "لامپ هوشمند راهرو", type: "Lighting", location: "راهرو", online: true, isOn: false, value: "OFF", alert: "NORMAL" },
          { id: 3, name: "دوربین پارکینگ", type: "Camera", location: "پارکینگ", online: false, isOn: true, value: "No Signal", alert: "CRITICAL" },
          { id: 4, name: "سنسور دود آشپزخانه", type: "Sensor", location: "آشپزخانه", online: true, isOn: true, value: "0 PPM", alert: "NORMAL" },
          { id: 5, name: "قفل درب ورودی", type: "Lock", location: "ورودی", online: true, isOn: true, value: "Locked", alert: "NORMAL" },
          { id: 6, name: "اسپلیت اتاق خواب", type: "AC", location: "اتاق 2", online: true, isOn: false, value: "Standby", alert: "NORMAL" },
        ];
        this.isLoading = false;
      }, 800);
    },

    toggleDevice(device) {
      if(!device.online) return;
      
      // Optimistic UI Update
      device.isOn = !device.isOn;
      
      // نمایش پیام (اگر متد inject شده باشد)
      if(this.showToast) {
        this.showToast(`دستگاه ${device.name} ${device.isOn ? 'روشن' : 'خاموش'} شد.`, 'info');
      }

      // ارسال درخواست واقعی به سرور
      if (this.$http) {
         this.$http.put(`/devices/${device.id}/toggle`).catch(err => {
           // Revert changes if failed
           device.isOn = !device.isOn;
           console.error(err);
         });
      }
    },

    getDeviceIcon(type) {
      const icons = {
        'Thermostat': '🌡️',
        'Lighting': '💡',
        'Camera': '📹',
        'Sensor': '🔔',
        'Lock': '🔒',
        'AC': '❄️'
      };
      return icons[type] || '📡';
    },

    getDeviceTypeClass(type) {
      // کلاس‌های رنگی برای آیکون‌ها
      return type.toLowerCase();
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
}
.page-title { font-size: 1.8rem; margin-bottom: 5px; }
.page-subtitle { color: var(--text-muted); font-size: 0.9rem; margin: 0; }

.btn-primary {
  background-color: var(--color-primary);
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: transform 0.2s;
}
.btn-primary:hover { transform: translateY(-2px); background-color: #3050d0; }

/* Toolbar */
.toolbar {
  display: flex;
  gap: 15px;
  margin-bottom: 25px;
  flex-wrap: wrap;
}
.search-wrapper { flex-grow: 1; min-width: 250px; }
.search-input {
  width: 100%;
  padding: 10px 15px;
  border-radius: 8px;
  border: 1px solid var(--border-color);
  background-color: var(--bg-panel);
  color: var(--text-main);
}
.filter-select {
  padding: 10px;
  border-radius: 8px;
  border: 1px solid var(--border-color);
  background-color: var(--bg-panel);
  color: var(--text-main);
}
.view-toggles {
  display: flex;
  background: var(--bg-panel);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  overflow: hidden;
}
.toggle-btn {
  background: transparent;
  border: none;
  padding: 8px 12px;
  cursor: pointer;
  color: var(--text-muted);
  font-size: 1.2rem;
}
.toggle-btn.active { background: var(--color-primary); color: white; }

/* Grid Cards */
.devices-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 20px;
}

.device-card {
  background-color: var(--bg-panel);
  border-radius: 12px;
  padding: 20px;
  box-shadow: var(--shadow-md);
  border: 1px solid var(--border-color);
  transition: transform 0.2s;
}
.device-card:hover { transform: translateY(-5px); }

.card-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 15px;
}
.icon-box {
  width: 50px; height: 50px;
  background: rgba(67, 97, 238, 0.1);
  color: var(--color-primary);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
}
/* Color variations based on type */
.thermostat { color: #e74c3c; background: rgba(231, 76, 60, 0.1); }
.lighting { color: #f1c40f; background: rgba(241, 196, 15, 0.1); }
.camera { color: #9b59b6; background: rgba(155, 89, 182, 0.1); }

.status-indicator {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 0.8rem;
}
.dot { width: 8px; height: 8px; border-radius: 50%; }
.dot.online { background-color: var(--color-success); box-shadow: 0 0 5px var(--color-success); }
.dot.offline { background-color: var(--text-muted); }

.card-info h3 { margin: 0 0 5px 0; font-size: 1.1rem; }
.device-type { color: var(--text-muted); font-size: 0.85rem; }

.card-metrics {
  margin: 20px 0;
  background: var(--bg-body);
  padding: 10px;
  border-radius: 8px;
}
.metric { display: flex; justify-content: space-between; font-size: 0.9rem; margin-bottom: 5px; }
.metric:last-child { margin-bottom: 0; }
.metric .value { font-weight: bold; }

.card-actions {
  display: flex;
  gap: 10px;
}
.btn-action {
  flex: 1;
  padding: 8px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
  transition: 0.2s;
}
.btn-on { background-color: rgba(231, 76, 60, 0.1); color: #e74c3c; }
.btn-on:hover { background-color: #e74c3c; color: white; }

.btn-off { background-color: rgba(46, 204, 113, 0.1); color: #2ecc71; }
.btn-off:hover { background-color: #2ecc71; color: white; }

.btn-action:disabled { opacity: 0.5; cursor: not-allowed; background: #eee; color: #999; }

.btn-icon-only {
  background: transparent; border: 1px solid var(--border-color);
  border-radius: 6px; width: 36px; cursor: pointer;
}

/* Table View */
.table-container {
  background: var(--bg-panel);
  border-radius: 12px;
  overflow-x: auto;
  box-shadow: var(--shadow-md);
}
.device-table {
  width: 100%;
  border-collapse: collapse;
  min-width: 600px;
}
.device-table th, .device-table td {
  padding: 15px 20px;
  text-align: right;
  border-bottom: 1px solid var(--border-color);
}
.device-table th {
  background: rgba(0,0,0,0.02);
  color: var(--text-muted);
  font-weight: 600;
}

.badge { padding: 4px 10px; border-radius: 20px; font-size: 0.8rem; }
.badge-success { background: rgba(46, 204, 113, 0.15); color: #2ecc71; }
.badge-gray { background: rgba(150, 150, 150, 0.15); color: #999; }
.btn-small { padding: 5px 10px; background: var(--bg-body); border: 1px solid var(--border-color); border-radius: 4px; cursor: pointer; }

/* Loading & Empty States */
.loading-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 20px; }
.skeleton-card { height: 200px; background: #eee; border-radius: 12px; animation: pulse 1.5s infinite; }
@keyframes pulse { 0% { opacity: 0.6; } 50% { opacity: 1; } 100% { opacity: 0.6; } }

.empty-state { text-align: center; padding: 50px; color: var(--text-muted); }

/* Dark Mode specific adjustments (if needed explicitly) */
</style>
