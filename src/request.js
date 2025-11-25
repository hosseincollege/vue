import axios from "axios";

// 📌 Auto detect mode: لوکال یا آنلاین
let baseURL;
if (process.env.VUE_APP_MODE === "production") {
  baseURL = process.env.VUE_APP_API_PROD;
} else if (process.env.VUE_APP_MODE === "development") {
  baseURL = process.env.VUE_APP_API_LOCAL;
} else {
  // AUTO حالت: تشخیص بر اساس location.hostname
  if (window.location.hostname === "localhost") {
    baseURL = process.env.VUE_APP_API_LOCAL;
  } else {
    baseURL = process.env.VUE_APP_API_PROD;
  }
}

console.log("🌐 Active Mode:", process.env.VUE_APP_MODE);
console.log("🚀 BaseURL Used:", baseURL);

const instance = axios.create({
  baseURL,
  timeout: 6000,
});

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
