import { StatusBar } from "expo-status-bar";
import {
  AlertNotificationRoot
} from "react-native-alert-notification";
import {
  configureReanimatedLogger,
  ReanimatedLogLevel,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import TabLayout from "./(tabs)/_layout";

export default function RootLayout() {
  // This is the default configuration
  configureReanimatedLogger({
    level: ReanimatedLogLevel.warn,
    strict: false, // Reanimated runs in strict mode by default
  });

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar style="light" backgroundColor="#066341" />
      <AlertNotificationRoot>
        <TabLayout />
      </AlertNotificationRoot>
    </SafeAreaView>
  );
}
