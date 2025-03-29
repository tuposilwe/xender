import Loading from "@/components/Loading";
import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { InstalledApps, RNLauncherKitHelper } from "react-native-launcher-kit";
import { AppDetail } from "react-native-launcher-kit/typescript/Interfaces/InstalledApps";
import AppGrid from "../../components/AppGrid";

export interface AppState {
  showWithAccent: boolean;
  apps: AppDetail[];
  firstApp?: AppDetail;
  defaultLauncherPackageName: string;
  isLoading: boolean;
}

const App = () => {
  const [apps, setApps] = useState<AppState["apps"]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const initApp = async () => {
      setIsLoading(true);

      const checkAndRequestStoragePermissions = async () => {
        try {
          // Check if we already have permission
          const hasPermission = await InstalledApps.checkStoragePermissions();

          if (!hasPermission) {
            // Request permission
            await InstalledApps.requestStoragePermissions();

            // Check again after requesting
            const newPermissionStatus =
              await InstalledApps.checkStoragePermissions();
            setIsLoading(true);
            if (!newPermissionStatus) {
              throw new Error("User denied storage permissions");
            }
          }
          return true;
        } catch (error) {
          console.error("Permission error:", error);
          throw error;
        }
      };

      try {
        // Check and request permissions first
        await checkAndRequestStoragePermissions();

        const installedApps = await InstalledApps.getSortedApps({
          includeVersion: true,
          includeAccentColor: true,
        });

        const appsWithSizes = await Promise.all(
          installedApps.map(async (app: any) => {
            try {
              const size: any = await InstalledApps.getAppStorageStats({
                packageName: app.packageName,
              });
              const appsized =
                (size.appBytes / (1024 * 1024)).toFixed(2) + "MB";

              return {
                ...app,
                appBytes: appsized,
              };
            } catch (error) {
              console.error(
                `Failed to get size for ${app.packageName}:`,
                error
              );

              return {
                ...app,
                size: null,
              };
            }
          })
        );
        // console.log("Installed apps: ", appsWithSizes);

        setApps(appsWithSizes);
      } catch (error) {
        console.error("Error initializing app:", error);
      } finally {
        setIsLoading(false);
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

  if (isLoading) {
    return <Loading />;
  }

  // const selectedAppDetails = apps.filter(app => selectedApps.includes(app.packageName));

  return (
    <View className="flex items-center justify-center">
      <AppGrid apps={apps} />
    </View>
  );
};

export default App;
