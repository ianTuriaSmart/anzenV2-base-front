import { boot } from "quasar/wrappers";
import { createI18n } from "vue-i18n";
import messages from "src/i18n";

import { Quasar } from "quasar";
import langEs from "quasar/lang/es";
import langCa from "quasar/lang/ca"; // Asegúrate de tenerlo instalado

import { watch } from "vue";

export default boot(({ app }) => {
  const i18n = createI18n({
    legacy: false,
    locale: "es-ES",
    fallbackLocale: "es-ES",
    globalInjection: true,
    messages,
  });

  // Set i18n instance on app
  app.use(i18n);

  // Observador reactivo del idioma
  // const { locale } = i18n.global;

  // watch(locale, (val) => {
  //   if (val === 'es-ES') {
  //     Quasar.lang.set(langEs);
  //   } else if (val === 'va-VA') {
  //     Quasar.lang.set(langCa);
  //   }
  // }, { immediate: true });
});
