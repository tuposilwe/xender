import { useMemo, useState } from "react";
import { PermissionsAndroid, Platform } from "react-native";
import {
  BleError,
  BleManager,
  Characteristic,
  Device,
  Service,
} from "react-native-ble-plx";
import * as ExpoDevice from "expo-device";
import base64 from "react-native-base64";



const HEART_RATE_UUID = "0000180d-0000-1000-8000-00805f9b34fb";
const HEART_RATE_CHARACTERISTIC = "00002a37-0000-1000-8000-00805f9b34fb";

interface BluetoothLowEnergyApi {
  requestPermissions(): Promise<boolean>;
  scanForPeripherals(): void;
  connectToDevice: (device: Device) => Promise<void>;
  disconnectFromDevice: () => void;
  connectedDevice: Device | null;
  allDevices: Device[];
  heartRate: number;
}

function useBLE(): BluetoothLowEnergyApi {
  const bleManager = useMemo(() => new BleManager(), []);
  const [allDevices, setAllDevices] = useState<Device[]>([]);
  const [connectedDevice, setConnectedDevice] = useState<Device | null>(null);
  const [heartRate, setHeartRate] = useState<number>(0);

  const requestAndroid31Permissions = async () => {
    const bluetoothScan = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
      {
        title: "Bluetooth Scan Permission",
        message: "App requires Bluetooth scan permission",
        buttonPositive: "OK",
      }
    );
    const bluetoothConnect = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
      {
        title: "Bluetooth Connect Permission",
        message: "App requires Bluetooth connect permission",
        buttonPositive: "OK",
      }
    );
    const fineLocation = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: "Location Permission",
        message: "App requires location permission for Bluetooth",
        buttonPositive: "OK",
      }
    );

    return (
      bluetoothScan === "granted" &&
      bluetoothConnect === "granted" &&
      fineLocation === "granted"
    );
  };

  const requestPermissions = async () => {
    if (Platform.OS === "android") {
      if ((ExpoDevice.platformApiLevel ?? -1) < 31) {
        const fineLocation = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: "Location Permission",
            message: "App requires location permission for Bluetooth",
            buttonPositive: "OK",
          }
        );
        return fineLocation === PermissionsAndroid.RESULTS.GRANTED;
      } else {
        return await requestAndroid31Permissions();
      }
    }
    return true;
  };

  const isDuplicateDevice = (devices: Device[], nextDevice: Device) =>
    devices.findIndex((device) => nextDevice.id === device.id) > -1;

  const scanForPeripherals = () => {
    setAllDevices([]);
    bleManager.startDeviceScan(null, null, (error, device) => {
      if (error) {
        console.error("Scan error", error);
        return;
      }

      if (device && device.name) {
        setAllDevices((prev) => {
          if (!isDuplicateDevice(prev, device)) {
            return [...prev, device];
          }
          return prev;
        });
      }
    });
  };

  const connectToDevice = async (device: Device) => {
    try {
      const connected = await bleManager.connectToDevice(device.id);
      setConnectedDevice(connected);
      await connected.discoverAllServicesAndCharacteristics();
      bleManager.stopDeviceScan();

      const services = await connected.services();
      console.log("ALL SERVICES: ", services[2]);

      const characteristics = await connected.characteristicsForService(
        services[2].uuid
      );

      console.log("My Chars: ", characteristics[0].uuid);

      const characteristicsME = await connected.characteristicsForService(
        services[3].uuid
      );

      console.log("TD: ", characteristicsME[0].uuid);

      connected.monitorCharacteristicForService(
        HEART_RATE_UUID,
        HEART_RATE_CHARACTERISTIC,
        onDataReceived
      );

      // for (const service of services) {
      //   const characteristics = await connected.characteristicsForService(service.uuid);
      //   for (const characteristic of characteristics) {
      //     if (
      //       characteristic.isNotifiable ||
      //       characteristic.isIndicatable
      //     ) {

      //        console.log(`📡 Monitoring: SVC ${service.uuid} / CHAR ${characteristic.uuid}`);
      //       connected.monitorCharacteristicForService(
      //         service.uuid,
      //         characteristic.uuid,
      //         onDataReceived
      //       );
      //       return; // Use the first one found
      //     }
      //   }
      // }
    } catch (error) {
      console.error("Connection error:", error);
    }
  };

  const disconnectFromDevice = () => {
    if (connectedDevice) {
      bleManager.cancelDeviceConnection(connectedDevice.id);
      setConnectedDevice(null);
      setHeartRate(0);
    }
  };

  const onDataReceived = (
    error: BleError | null,
    characteristic: Characteristic | null
  ) => {
    if (error) {
      console.error("Characteristic error:", error);
      return;
    }

    if (!characteristic?.value) {
      console.warn("No data received");
      return;
    }

    const raw = base64.decode(characteristic.value);
    const firstByte = raw.charCodeAt(0);

    let rate = 0;
    if ((firstByte & 0x01) === 0) {
      rate = raw.charCodeAt(1);
    } else {
      rate = (raw.charCodeAt(2) << 8) + raw.charCodeAt(1);
    }

    setHeartRate(rate);
  };

  return {
    scanForPeripherals,
    requestPermissions,
    connectToDevice,
    disconnectFromDevice,
    connectedDevice,
    allDevices,
    heartRate,
  };
}

export default useBLE;

// import { useMemo, useState } from "react";
// import { PermissionsAndroid, Platform } from "react-native";
// import {
//   BleError,
//   BleManager,
//   Characteristic,
//   Device,
//   Service,
// } from "react-native-ble-plx";
// import * as ExpoDevice from "expo-device";
// import base64 from "react-native-base64";

// interface BluetoothLowEnergyApi {
//   requestPermissions(): Promise<boolean>;
//   scanForPeripherals(): void;
//   connectToDevice: (device: Device) => Promise<void>;
//   disconnectFromDevice: () => void;
//   connectedDevice: Device | null;
//   allDevices: Device[];
//   heartRate: number;
// }

// function useBLE(): BluetoothLowEnergyApi {
//   const bleManager = useMemo(() => new BleManager(), []);
//   const [allDevices, setAllDevices] = useState<Device[]>([]);
//   const [connectedDevice, setConnectedDevice] = useState<Device | null>(null);
//   const [heartRate, setHeartRate] = useState<number>(0);

//   const requestAndroid31Permissions = async () => {
//     const bluetoothScan = await PermissionsAndroid.request(
//       PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
//       {
//         title: "Bluetooth Scan Permission",
//         message: "App requires Bluetooth scan permission",
//         buttonPositive: "OK",
//       }
//     );
//     const bluetoothConnect = await PermissionsAndroid.request(
//       PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
//       {
//         title: "Bluetooth Connect Permission",
//         message: "App requires Bluetooth connect permission",
//         buttonPositive: "OK",
//       }
//     );
//     const fineLocation = await PermissionsAndroid.request(
//       PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
//       {
//         title: "Location Permission",
//         message: "App requires location permission for Bluetooth",
//         buttonPositive: "OK",
//       }
//     );

//     return (
//       bluetoothScan === "granted" &&
//       bluetoothConnect === "granted" &&
//       fineLocation === "granted"
//     );
//   };

//   const requestPermissions = async () => {
//     if (Platform.OS === "android") {
//       if ((ExpoDevice.platformApiLevel ?? -1) < 31) {
//         const fineLocation = await PermissionsAndroid.request(
//           PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
//           {
//             title: "Location Permission",
//             message: "App requires location permission for Bluetooth",
//             buttonPositive: "OK",
//           }
//         );
//         return fineLocation === PermissionsAndroid.RESULTS.GRANTED;
//       } else {
//         return await requestAndroid31Permissions();
//       }
//     }
//     return true;
//   };

//   const isDuplicateDevice = (devices: Device[], nextDevice: Device) =>
//     devices.findIndex((device) => nextDevice.id === device.id) > -1;

//   const scanForPeripherals = () => {
//     setAllDevices([]);
//     bleManager.startDeviceScan(null, null, (error, device) => {
//       if (error) {
//         console.error("Scan error", error);
//         return;
//       }

//       if (device && device.name) {
//         setAllDevices((prev) => {
//           if (!isDuplicateDevice(prev, device)) {
//             return [...prev, device];
//           }
//           return prev;
//         });
//       }
//     });
//   };

//   const connectToDevice = async (device: Device) => {
//     try {
//       const connected = await bleManager.connectToDevice(device.id);
//       setConnectedDevice(connected);
//       await connected.discoverAllServicesAndCharacteristics();
//       bleManager.stopDeviceScan();

//       const services = await connected.services();

//       console.log("ALL SERVICES: ", services);

//       const characteristics = await connected.characteristicsForService(
//         services[2].uuid
//       );

//       console.log("My Chars: ", characteristics[0].uuid);

//       connected.monitorCharacteristicForService(
//         services[2].uuid,
//         characteristics[0].uuid,
//         onDataReceived
//       );
// device
//   .readCharacteristicForService(services[2].uuid, characteristics[0].uuid)
//   .then(characteristic => {
//     console.log('Read characteristic value:', characteristic.value)
//   })
//   .catch(error => {
//     console.error('Read characteristic error:', error)
//   })

//   device
//   .writeCharacteristicWithResponseForService(services[2].uuid, characteristics[0].uuid, "0x11")
//   .then((v) => {
//     console.log('Write characteristic success',v)
//   })
//   .catch(error => {
//     console.error('Write characteristic error:', error)
//   })

//       // for (const service of services) {
//       //   const characteristics = await connected.characteristicsForService(service.uuid);
//       //   for (const characteristic of characteristics) {
//       //     if (
//       //       characteristic.isNotifiable ||
//       //       characteristic.isIndicatable
//       //     ) {

//       //        console.log(`📡 Monitoring: SVC ${service.uuid} / CHAR ${characteristic.uuid}`);
//       //       connected.monitorCharacteristicForService(
//       //         service.uuid,
//       //         characteristic.uuid,
//       //         onDataReceived
//       //       );
//       //       return; // Use the first one found
//       //     }
//       //   }
//       // }
//     } catch (error) {
//       console.error("Connection error:", error);
//     }
//   };

//   const disconnectFromDevice = () => {
//     if (connectedDevice) {
//       bleManager.cancelDeviceConnection(connectedDevice.id);
//       setConnectedDevice(null);
//       setHeartRate(0);
//     }
//   };

//   const onDataReceived = (
//     error: BleError | null,
//     characteristic: Characteristic | null
//   ) => {
//     if (error) {
//       console.error("Characteristic error:", error);
//       return;
//     }

//     if (!characteristic?.value) {
//       console.warn("No data received");
//       return;
//     }

//     const raw = base64.decode(characteristic.value);
//     const firstByte = raw.charCodeAt(0);

//     let rate = 0;
//     if ((firstByte & 0x01) === 0) {
//       rate = raw.charCodeAt(1);
//     } else {
//       rate = (raw.charCodeAt(2) << 8) + raw.charCodeAt(1);
//     }

//     setHeartRate(rate);
//   };

//   return {
//     scanForPeripherals,
//     requestPermissions,
//     connectToDevice,
//     disconnectFromDevice,
//     connectedDevice,
//     allDevices,
//     heartRate,
//   };
// }

// export default useBLE;
