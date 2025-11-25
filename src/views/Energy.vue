<template>
  <div class="page-container">
    <h2>مانیتورینگ مصرف انرژی</h2>
    <div class="placeholder-chart">
      <div class="bar" style="height: 60%"><span>شنبه</span></div>
      <div class="bar" style="height: 80%"><span>یکشنبه</span></div>
      <div class="bar" style="height: 45%"><span>دوشنبه</span></div>
      <div class="bar active" style="height: 90%"><span>امروز</span></div>
    </div>
    <p style="text-align: center; margin-top: 20px">
      مصرف برق امروز: <strong>۱۴۵ کیلووات ساعت</strong> (پر مصرف)
    </p>
  </div>
</template>
<style scoped>
.page-container {
  padding: 20px;
  direction: rtl;
}
.placeholder-chart {
  display: flex;
  align-items: flex-end;
  justify-content: center;
  height: 300px;
  background: #f9f9f9;
  border-bottom: 2px solid #333;
  gap: 20px;
  padding: 20px;
}
.bar {
  width: 50px;
  background: #3498db;
  border-radius: 5px 5px 0 0;
  position: relative;
}
.bar.active {
  background: #e74c3c;
}
.bar span {
  position: absolute;
  bottom: -25px;
  width: 100%;
  text-align: center;
  font-size: 0.8rem;
}
</style>
