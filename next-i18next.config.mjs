/** @type {import("next-iintl").UserConfig} */
const i18nConfig = {
  i18n: {
    defaultLocale: "en",
    locales: ["en", "ru", "kz"],
  },
  defaultNS: "common",
  localePath: "./public/locales",
  localeStructure: "{{lng}}/{{ns}}",
  reloadOnPrerender: process.env.NODE_ENV === "development",
  fallbackLng: "en", // Использовать английский, если перевод не найден
  load: /** @type {"languageOnly"} */ "languageOnly", // Указание литерального типа
  detection: {
    order: ["cookie", "localStorage", "navigator", "path", "subdomain"],
  },
};

export default i18nConfig;
