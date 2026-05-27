import { defineConfig } from 'wxt';

export default defineConfig({
  srcDir: 'src',
  modules: ['@wxt-dev/module-svelte'],
  manifest: {
    permissions: ['webNavigation', 'tabs', 'storage'],
    host_permissions: ['https://*/*', 'http://*/*'],
    data_collection_permissions: {
      manual_submission: {
        description:
          'Collects page URL and User-Agent only when the user explicitly chooses to submit a report.',
        data_types: ['url', 'user_agent'],
        retention:
          'Retained in the project threat database indefinitely for analysis and blocking; stored securely and accessed only by the developer.',
        recipients: ['developer'],
        opt_in: true,
      },
    },
  },

  suppressWarnings: {
    firefoxDataCollection: true,
  },
});
