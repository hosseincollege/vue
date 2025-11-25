import axios from "axios";

// 🧠 تعیین محیط بر اساس فایل .env
const isProd = process.env.VUE_APP_MODE === "production";
const baseURL = isProd
  ? process.env.VUE_APP_API_PROD
  : process.env.VUE_APP_API_LOCAL;

console.log("🌐 Active Mode:", process.env.VUE_APP_MODE);
console.log("🚀 BaseURL Used:", baseURL);

// ساخت نمونه Axios
const instance = axios.create({
  baseURL,
  timeout: 6000,
});

// 🧩 گرفتن پاسخ‌ها و مدیریت خطا
instance.interceptors.response.use(
  (response) => {
    console.log("✅ Axios Response:", response.data);
    return response.data;
  },
  (error) => {
    console.error("❌ Axios Error:", error);
    return Promise.reject(error);
  }
);

export default instance;
