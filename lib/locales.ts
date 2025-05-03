export const getShopifyLocale = ({ locale }: { locale?: string }) => {
  if (!locale) {
    return 'JA';
  } else if (locale === 'zh') {
    return 'ZH_TW';
  } else {
    return locale.toUpperCase();
  }
};
