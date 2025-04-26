import NetInfo from "@react-native-community/netinfo";
import { useCallback, useEffect, useState } from "react";
import DeviceInfo from 'react-native-device-info';

export function useNetworkAndLocation() {
  const [wifiEnabled, setWifiEnabled] = useState(false);
  const [gpsEnabled, setGpsEnabled] = useState(false);

  const checkLocationStatus = useCallback(async () => {
    const enabled = await DeviceInfo.isLocationEnabled();
    console.log("GPS enabled:", enabled);
    setGpsEnabled(enabled);
    return enabled;
  }, []);

  useEffect(() => {
    // Listen for WiFi changes
    const unsubscribeNetInfo = NetInfo.addEventListener(state => {
      console.log("WiFi changed:", state.isWifiEnabled);
      setWifiEnabled(state.isWifiEnabled ?? false);
      // Also check GPS when WiFi changes
      checkLocationStatus();
    });

    // Poll GPS status every 5 seconds
    const locationCheckInterval = setInterval(() => {
      checkLocationStatus();
      NetInfo.refresh()
    }, 5000);

    // Initial checks
    checkLocationStatus();

    return () => {
      unsubscribeNetInfo();
      clearInterval(locationCheckInterval);
    };
  }, [checkLocationStatus]);

  return { wifiEnabled, gpsEnabled };
}
