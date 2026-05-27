import { defineConfig } from 'wxt';

export default defineConfig({
  srcDir: 'src',
  modules: ['@wxt-dev/module-svelte'],
  manifest: {
    permissions: ['webNavigation', 'tabs', 'storage'],
    host_permissions: ['https://*/*', 'http://*/*'],
    browser_specific_settings: {
      gecko: {
        id: 'uphish@lucandris',
        data_collection_permissions: {
          required: ['none'],
          optional: ['websiteActivity', 'technicalAndInteraction'],
          manual_submission: {
            description:
              'Collects page URL and User-Agent only when the user explicitly chooses to submit a report.',
            data_types: ['url', 'user_agent'],
            retention:
              'Retained in the project threat database indefinitely for analysis and blocking; stored securely and accessed only by the uPhish project.',
            recipients: ['developer'],
            opt_in: true,
          },
        },
      },
    },
  },

  suppressWarnings: {
    firefoxDataCollection: true,
  },
});
