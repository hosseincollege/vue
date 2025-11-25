const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: false  // <--- این خط تمام گیرهای بیخودی را خاموش می‌کند
})
