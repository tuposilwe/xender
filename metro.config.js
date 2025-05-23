const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require('nativewind/metro');
const {
  wrapWithReanimatedMetroConfig,
} = require('react-native-reanimated/metro-config');

const config = withNativeWind(getDefaultConfig(__dirname), { input: './global.css' })

module.exports = wrapWithReanimatedMetroConfig(config);