/** @type {CodeceptJS.MainConfig} */
exports.config = {
  tests: './*_test.js',
  output: './output',
  helpers: {
    Playwright: {
      browser: 'chromium',
      url: 'http://localhost:5173/',
      show: true
    }
  },
  plugins: {
    pauseOnFail: {}, // Dừng lại khi có lỗi
  },
  include: {
    I: './steps_file.js'
  },
  name: 'e2e-test'
}