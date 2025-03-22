import { SafeAreaView } from "react-native-safe-area-context";
import "../global.css";
import Home from "./home";

export default function Index() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Home />
    </SafeAreaView>
  );
}
