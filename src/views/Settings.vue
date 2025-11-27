<template>
  <div class="page-container">
    <h2 class="page-title">تنظیمات سیستم</h2>
    
    <div class="settings-grid">
      
      <!-- 1. تنظیمات حساب کاربری -->
      <div class="settings-card">
        <div class="card-header">
          <h3>👤 حساب کاربری</h3>
        </div>
        <div class="card-body">
          <div class="form-group">
            <label>نام کاربری</label>
            <input type="text" v-model="user.name" placeholder="نام مدیر" />
          </div>
          <div class="form-group">
            <label>ایمیل</label>
            <input type="email" v-model="user.email" placeholder="admin@bms.local" />
          </div>
          <div class="form-group">
            <label>نقش</label>
            <input type="text" value="مدیر کل (Super Admin)" disabled class="disabled-input" />
          </div>
        </div>
      </div>

      <!-- 2. تنظیمات ظاهری -->
      <div class="settings-card">
        <div class="card-header">
          <h3>🎨 ظاهر و رابط کاربری</h3>
        </div>
        <div class="card-body">
          <div class="setting-item">
            <div class="setting-info">
              <span class="setting-label">حالت تاریک (Dark Mode)</span>
              <span class="setting-desc">تغییر رنگ‌بندی به حالت تیره برای کاهش خستگی چشم</span>
            </div>
            <label class="switch">
              <input type="checkbox" v-model="preferences.darkMode" @change="toggleTheme">
              <span class="slider round"></span>
            </label>
          </div>

          <div class="setting-item">
            <div class="setting-info">
              <span class="setting-label">انیمیشن‌های صفحه</span>
              <span class="setting-desc">نمایش افکت‌های انتقال بین صفحات</span>
            </div>
            <label class="switch">
              <input type="checkbox" v-model="preferences.animations">
              <span class="slider round"></span>
            </label>
          </div>
        </div>
      </div>

      <!-- 3. تنظیمات اعلان‌ها -->
      <div class="settings-card">
        <div class="card-header">
          <h3>🔔 مدیریت اعلان‌ها</h3>
        </div>
        <div class="card-body">
          <div class="setting-item">
            <span class="setting-label">ارسال ایمیل هشدار</span>
            <label class="switch">
              <input type="checkbox" v-model="notifications.email">
              <span class="slider round"></span>
            </label>
          </div>
          <div class="setting-item">
            <span class="setting-label">هشدار پیامکی (SMS)</span>
            <label class="switch">
              <input type="checkbox" v-model="notifications.sms">
              <span class="slider round"></span>
            </label>
          </div>
          <div class="setting-item">
            <span class="setting-label">صدای آژیر مرورگر</span>
            <label class="switch">
              <input type="checkbox" v-model="notifications.sound">
              <span class="slider round"></span>
            </label>
          </div>
        </div>
      </div>

      <!-- 4. پیکربندی سیستم -->
      <div class="settings-card">
        <div class="card-header">
          <h3>⚙️ پیکربندی سیستم IoT</h3>
        </div>
        <div class="card-body">
          <div class="form-group">
            <label>آدرس سرور مرکزی (Backend API)</label>
            <input type="text" v-model="system.serverUrl" dir="ltr" />
          </div>
          <div class="form-group">
            <label>فاصله بروزرسانی (ثانیه)</label>
            <select v-model="system.refreshRate">
              <option value="2000">۲ ثانیه</option>
              <option value="5000">۵ ثانیه</option>
              <option value="10000">۱۰ ثانیه</option>
              <option value="60000">۱ دقیقه</option>
            </select>
          </div>
          
          <div class="actions-row">
            <button class="btn-save" @click="saveSettings">ذخیره تغییرات</button>
            <button class="btn-danger" @click="resetSystem">بازنشانی سیستم</button>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
export default {
  name: "SettingsView",
  inject: ['showToast'], // استفاده از سیستم توست که در App.vue تعریف کردیم
  data() {
    return {
      user: {
        name: "مدیر سیستم",
        email: "admin@smartbms.ir"
      },
      preferences: {
        darkMode: false,
        animations: true
      },
      notifications: {
        email: true,
        sms: false,
        sound: true
      },
      system: {
        serverUrl: "http://192.168.1.100:8080/api",
        refreshRate: "5000"
      }
    };
  },
  mounted() {
    // خواندن وضعیت دارک مود از لوکال استوریج هنگام لود
    const savedTheme = localStorage.getItem('theme');
    this.preferences.darkMode = savedTheme === 'dark-theme';
  },
  methods: {
    toggleTheme() {
      // ارسال سیگنال به App.vue یا تغییر مستقیم (بسته به ساختار پروژه)
      // اینجا روش مستقیم را پیاده می‌کنیم که با App.vue هماهنگ است
      const newTheme = this.preferences.darkMode ? 'dark-theme' : 'light-theme';
      document.body.className = newTheme;
      localStorage.setItem('theme', newTheme);
      
      // نمایش پیام
      this.showToast({ 
        message: `تم به حالت ${this.preferences.darkMode ? 'تاریک' : 'روشن'} تغییر کرد`, 
        type: 'info' 
      });
    },

    saveSettings() {
      // شبیه‌سازی ذخیره در سرور
      console.log("Saving Settings...", {
        user: this.user,
        pref: this.preferences,
        notif: this.notifications,
        sys: this.system
      });

      // ذخیره در LocalStorage برای ماندگاری موقت
      localStorage.setItem('bms_settings', JSON.stringify(this.$data));

      this.showToast({ message: 'تنظیمات با موفقیت ذخیره شد', type: 'success' });
    },

    resetSystem() {
      if(confirm("آیا مطمئن هستید؟ این کار تمام تنظیمات محلی را پاک می‌کند.")) {
        localStorage.removeItem('bms_settings');
        this.showToast({ message: 'تنظیمات بازنشانی شد', type: 'warning' });
        window.location.reload();
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

.page-title {
  margin-bottom: 30px;
  font-size: 1.8rem;
}

.settings-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 25px;
}

.settings-card {
  background: var(--bg-panel);
  border-radius: 12px;
  border: 1px solid var(--border-color);
  box-shadow: var(--shadow-sm);
  overflow: hidden;
}

.card-header {
  padding: 15px 20px;
  border-bottom: 1px solid var(--border-color);
  background: rgba(0,0,0,0.02);
}
.dark-theme .card-header { background: rgba(255,255,255,0.05); }

.card-header h3 { margin: 0; font-size: 1.1rem; color: var(--text-main); }

.card-body {
  padding: 20px;
}

/* Form Elements */
.form-group {
  margin-bottom: 15px;
}
.form-group label {
  display: block;
  margin-bottom: 8px;
  font-size: 0.9rem;
  color: var(--text-muted);
}
.form-group input, .form-group select {
  width: 100%;
  padding: 10px;
  border-radius: 8px;
  border: 1px solid var(--border-color);
  background: var(--bg-main);
  color: var(--text-main);
  font-family: inherit;
}
.disabled-input {
  background: rgba(0,0,0,0.05) !important;
  color: var(--text-muted) !important;
  cursor: not-allowed;
}

/* Toggle Switch Styles */
.setting-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid var(--border-color);
}
.setting-item:last-child { border-bottom: none; padding-bottom: 0; margin-bottom: 0; }

.setting-info { display: flex; flex-direction: column; }
.setting-label { font-weight: bold; font-size: 0.95rem; }
.setting-desc { font-size: 0.8rem; color: var(--text-muted); margin-top: 4px; }

/* The Switch Widget */
.switch {
  position: relative;
  display: inline-block;
  width: 50px;
  height: 26px;
  flex-shrink: 0;
}
.switch input { opacity: 0; width: 0; height: 0; }

.slider {
  position: absolute;
  cursor: pointer;
  top: 0; left: 0; right: 0; bottom: 0;
  background-color: #ccc;
  transition: .4s;
}
.slider:before {
  position: absolute;
  content: "";
  height: 18px; width: 18px;
  left: 4px; bottom: 4px;
  background-color: white;
  transition: .4s;
}
input:checked + .slider { background-color: var(--color-primary); }
input:focus + .slider { box-shadow: 0 0 1px var(--color-primary); }
input:checked + .slider:before { transform: translateX(24px); }
.slider.round { border-radius: 34px; }
.slider.round:before { border-radius: 50%; }

/* Action Buttons */
.actions-row {
  margin-top: 25px;
  display: flex;
  gap: 10px;
  justify-content: flex-end;
}
.btn-save {
  background: var(--color-primary);
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
  transition: 0.2s;
}
.btn-save:hover { opacity: 0.9; transform: translateY(-1px); }

.btn-danger {
  background: transparent;
  color: #e74c3c;
  border: 1px solid #e74c3c;
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
  transition: 0.2s;
}
.btn-danger:hover { background: #e74c3c; color: white; }

</style>
