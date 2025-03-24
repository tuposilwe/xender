import React, { useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { InstalledApps, RNLauncherKitHelper } from "react-native-launcher-kit";
import { AppDetail } from "react-native-launcher-kit/typescript/Interfaces/InstalledApps";
import AppGrid from "../components/AppGrid";

export interface AppState {
  showWithAccent: boolean;
  apps: AppDetail[];
  firstApp?: AppDetail;
  defaultLauncherPackageName: string;
  isLoading: boolean;
}

const App = () => {
  const [apps, setApps] = useState<AppState["apps"]>([]);
  const [showWithAccent, setShowWithAccent] = useState<boolean>(true);

  useEffect(() => {
    const initApp = async () => {
      try {
        const installedApps = await InstalledApps.getSortedApps({
          includeVersion: true,
          includeAccentColor: true,
        });

        console.log("Installed apps: ", installedApps);
        
        setApps(installedApps);
      } catch (error) {
        console.error("Error initializing app:", error);
      }
    };

    initApp();
  }, []);

  //App lauch handlers
  const handlers = {
    openApplication: (packageName: string) => {
      RNLauncherKitHelper.launchApplication(packageName);
    },
  };

  return (
    <View className="flex items-center justify-center">
      <AppGrid
        apps={apps}
        showWithAccent={false}
        onAppPress={handlers.openApplication}
      />
    </View>
  );
};

export default App;
