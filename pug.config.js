const isProd = process.env.NODE_ENV === 'production';

module.exports = {
  doctype: null,
  pretty: false,
  locals: {
    APP_PROD: isProd,
    APP_VERSION: process.env.PACKAGE_VERSION,
    APP_URI: isProd ? '//simbo.codes/magawa/' : '//localhost:1234/magawa/'
  }
};
