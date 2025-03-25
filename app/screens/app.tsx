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


      const appsWithSizes = await Promise.all(
        apps.map(async (app) => {
          const size = await InstalledApps.getAppStorageStats({ packageName: app.packageName});
          const appsized = (size.appBytes/ (1024 * 1024)).toFixed(2) + "MB";

          return { ...app, appsized };
        })
      );

      const size = await InstalledApps.getAppStorageStats({ packageName: 'com.anonymous.xender'});
      const appsized = (size.appBytes/ (1024 * 1024)).toFixed(2) + "MB";

      console.log("Appsize: ",appsized);
      

      // InstalledApps.getAppStorageStats({ packageName: 'com.anonymous.xender'})
      // .then(stats => {
      //   console.log('App size:',`${(stats.appBytes/ (1024 * 1024)).toFixed(2)}MB`);
      //   // console.log('Data size:', stats.dataBytes);
      //   // console.log('Cache size:', stats.cacheBytes);
      // })
      // .catch(error => console.error(error));

      // console.log("Installed apps: ", appsWithSizes);
        
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
