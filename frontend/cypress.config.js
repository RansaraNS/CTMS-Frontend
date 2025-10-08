const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    watchForFileChanges: false,
    defaultCommandTimeout: 5000,
    baseUrl: 'http://localhost:5173',

    setupNodeEvents(on, config) {
      // Enable cypress-mochawesome-reporter plugin
      require('cypress-mochawesome-reporter/plugin')(on);
      return config;
    },
  },

  // ✅ Only ONE reporter
  reporter: 'cypress-mochawesome-reporter',

  reporterOptions: {
    reportDir: 'cypress/reports',
    overwrite: false,
    charts: true,
    html: true,
    json: true,
    embeddedScreenshots: true,
    inlineAssets: true,
  },
});
