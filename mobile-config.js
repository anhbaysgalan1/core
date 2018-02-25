
App.info({
  id: 'com.jinaverse.undermind',
  name: 'Undermind',
  description: 'Get custom recommendations among thousands of MOOCs.',
  author: 'Loan Laux',
  email: 'contact@loanlaux.fr',
  website: 'http://loanlaux.fr',
  version: "1.2.2",
  buildNumber: '111130'
});

App.setPreference("StatusBarBackgroundColor", "#0f90d1");
App.setPreference('BackgroundColor', '0xffffffff');

App.icons({
  "app_store": "resources/icons/app_store.png", // 1024x1024
  "iphone_2x": "resources/icons/iphone_2x.png", // 120x120
  "iphone_3x": "resources/icons/iphone_3x.png", // 180x180
  "ipad": "resources/icons/ipad.png", // 76x76
  "ipad_2x": "resources/icons/ipad_2x.png", // 152x152
  "ipad_pro": "resources/icons/ipad_pro.png", // 167x167
  "ios_settings": "resources/icons/ios_settings.png", // 29x29
  "ios_settings_2x": "resources/icons/ios_settings_2x.png", // 58x58
  "ios_settings_3x": "resources/icons/ios_settings_3x.png", // 87x87
  "ios_spotlight": "resources/icons/ios_spotlight.png", // 40x40
  "ios_spotlight_2x": "resources/icons/ios_spotlight_2x.png", // 80x80
  "ios_notification": "resources/icons/ios_notification.png", // 20x20
  "ios_notification_2x": "resources/icons/ios_notification_2x.png", // 40x40
  "ios_notification_3x":"resources/icons/ios_notification_3x.png", // 60x60
  "iphone_legacy": "resources/icons/iphone_legacy.png", // 57x57
  "iphone_legacy_2x": "resources/icons/iphone_legacy_2x.png", // 114x114
  "ipad_spotlight_legacy": "resources/icons/ipad_spotlight_legacy.png", // 50x50
  "ipad_spotlight_legacy_2x": "resources/icons/ipad_spotlight_legacy_2x.png", // 100x100
  "ipad_app_legacy": "resources/icons/ipad_app_legacy.png", // 72x72
  "ipad_app_legacy_2x": "resources/icons/ipad_app_legacy_2x.png", // 144x144
  "android_mdpi": "resources/icons/android_mdpi.png", // 48x48
  "android_hdpi": "resources/icons/android_hdpi.png", // 72x72
  "android_xhdpi": "resources/icons/android_xhdpi.png", // 96x96
  "android_xxhdpi": "resources/icons/android_xxhdpi.png", // 144x144
  "android_xxxhdpi": "resources/icons/android_xxxhdpi.png" // 192x192
});

App.launchScreens({
  "android_mdpi_portrait": "resources/splashes/android_mdpi_portrait.png", // 320x480
  "android_mdpi_landscape": "resources/splashes/android_mdpi_landscape.png", // 480x320
  "android_hdpi_portrait": "resources/splashes/android_hdpi_portrait.png", // 480x800
  "android_hdpi_landscape": "resources/splashes/android_hdpi_landscape.png", // 800x480
  "android_xhdpi_portrait": "resources/splashes/android_xhdpi_portrait.png", // 720x1280
  "android_xhdpi_landscape": "resources/splashes/android_xhdpi_landscape.png", // 1280x720
  "android_xxhdpi_portrait": "resources/splashes/android_xxhdpi_portrait.png", // 1080x1440
  "android_xxhdpi_landscape": "resources/splashes/android_xxhdpi_landscape.png" // 1440x1080
});

App.accessRule('http://*');
App.accessRule('https://*');

App.appendToConfig(`
  <splash src="../../../resources/splashes/Default@2x~universal~anyany.png" />
  <splash src="../../../resources/splashes/Default@3x~universal~anyany.png" />
`);

App.setPreference('WebAppStartupTimeout', 50000);

App.setPreference("AutoHideSplashScreen", true, "ios");
App.setPreference("SplashScreenDelay", "10", "ios"); //5 seconds delay
