import { StatusBar } from "expo-status-bar";
import { AlertNotificationRoot } from "react-native-alert-notification";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { PaperProvider } from "react-native-paper";
import {
  configureReanimatedLogger,
  ReanimatedLogLevel,
} from "react-native-reanimated";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import DrawerLayout from "./(drawer)/_layout";
import BLE from "@/components/BLE";

export default function RootLayout() {
  // This is the default configuration
  configureReanimatedLogger({
    level: ReanimatedLogLevel.warn,
    strict: false, // Reanimated runs in strict mode by default
  });

  return (
    <GestureHandlerRootView>
      <SafeAreaView style={{ flex: 1 }}>
        <SafeAreaProvider>
          <StatusBar style="light" backgroundColor="#d45252" />
          <AlertNotificationRoot>
            <PaperProvider>
              <BLE/>
            </PaperProvider>
          </AlertNotificationRoot>
        </SafeAreaProvider>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}
