// Required dependencies (install before use):
// npm install react-native-wifi-p2p react-native-qrcode-svg react-native-permissions react-native-document-picker react-native-tcp-socket expo-file-system react-native-pdf expo-av react-native-network-info expo-barcode-scanner

import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  Button,
  FlatList,
  Modal,
  TouchableOpacity,
  Image,
  PermissionsAndroid,
  Platform,
  ActivityIndicator,
  Dimensions,
} from "react-native";

import WifiP2p, {
  connect,
  getAvailablePeers,
  initialize,
  startDiscoveringPeers,
  Device,
  cancelConnect,
  subscribeOnPeersUpdates,
} from "react-native-wifi-p2p";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";
import TcpSocket from "react-native-tcp-socket";
import { Video } from "expo-av";
import Pdf from "react-native-pdf";
import { NetworkInfo } from "react-native-network-info";
import { ProgressBar } from "@react-native-community/progress-bar-android";
import { CameraView, useCameraPermissions } from "expo-camera";
import RNQRGenerator from "rn-qr-generator";

const Download = () => {
  const [peers, setPeers] = useState<Device[]>([]);
  const [connected, setConnected] = useState(false);
  const [qrData, setQrData] = useState("");
  const [previewFile, setPreviewFile] = useState("");
  const [isReceiving, setIsReceiving] = useState(false);
  const [receivedFiles, setReceivedFiles] = useState<String[]>([]);
  const [progressMap, setProgressMap] = useState({});
  const [transferState, setTransferState] = useState("idle");
  const [scanning, setScanning] = useState(false);
  const [hasPermission, setHasPermission] = useCameraPermissions();

  const paused = useRef(false);
  const cancelTransferRef = useRef(false);
  const sendQueue = useRef<String[]>([]);
  const currentSendIndex = useRef(0);
  const retryAttempts = useRef(0);
  const maxRetries = 3;
  const serverRef = useRef(TcpSocket.createServer());

  const [imageUri, setImageUri] = useState("");

  const [speedMap, setSpeedMap] = useState({});
  const [etaMap, setEtaMap] = useState({});

  useEffect(() => {
    requestPermissions();
    initialize()
      .then((isInitializedSuccessfully) =>
        console.log("isInitializedSuccessfully: ", isInitializedSuccessfully)
      )
      .catch((err) => console.log("initialization was failed. Err: ", err));
    // WifiP2p.setDeviceName("RN_FileTransfer");

    (async () => {
      if (!hasPermission?.granted) {
        // Camera permissions are not granted yet.
        return (
          <View>
            <Text>We need your permission to show the camera</Text>
            <Button onPress={setHasPermission} title="grant permission" />
          </View>
        );
      }
    })();
  }, []);

  const requestPermissions = async () => {
    if (Platform.OS === "android") {
      await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        PermissionsAndroid.PERMISSIONS.NEARBY_WIFI_DEVICES,
      ]);
    }
  };

  const discoverPeers = async () => {
    try {
      startDiscoveringPeers()
        .then(() => {
          console.log("Starting of discovering was successful");
          getAvailablePeers().then((peersList) => {
            console.log("Peers:", peersList);
            setPeers(peersList.devices || []);
          });
        })
        .catch((err) =>
          console.error(
            `Something is gone wrong. Maybe your WiFi is disabled? Error details: ${err}`
          )
        );

      subscribeOnPeersUpdates(({ devices }) => {
        console.log(`New devices available: ${devices}`);
      });
    } catch (error) {
      console.error("Discovery error:", error);
    }
  };

  const connectToPeer = async (device: Device) => {
    try {
      await connect(device.deviceAddress);
      setConnected(true);
      console.log("Connected to:", device.deviceName);
      setQrData(device.deviceAddress); // used in QR generation
    } catch (error) {
      console.error("Connection error:", error);
    }
  };

  const disconnect = async () => {
    try {
      await cancelConnect();
      // await WifiP2p.disconnect();
      setConnected(false);
      console.log("Disconnected");
    } catch (error) {
      console.error("Disconnect error:", error);
    }
  };

  const pickFiles = async () => {
    try {
      const files = await DocumentPicker.getDocumentAsync({
        multiple: true,
      });

      sendQueue.current = files.assets!.map((file) =>
        file.uri.replace("file://", "")
      );
      currentSendIndex.current = 0;
      sendNextFile();
    } catch (err) {
      console.error("File pick error:", err);
    }
  };

  const sendNextFile = () => {
    if (
      currentSendIndex.current >= sendQueue.current.length ||
      cancelTransferRef.current
    ) {
      setTransferState("idle");
      return;
    }
    const filePath = sendQueue.current[currentSendIndex.current];
    sendFileWithRetry(filePath, currentSendIndex.current);
  };

  const sendFileWithRetry =
    //@ts-ignore
    async (filePath, index) => {
      try {
        await sendFile(filePath, index);
        retryAttempts.current = 0;
        currentSendIndex.current++;
        sendNextFile();
      } catch (e) {
        if (retryAttempts.current < maxRetries) {
          retryAttempts.current++;
          console.warn(`Retry ${retryAttempts.current} for file ${filePath}`);
          setTimeout(() => sendFileWithRetry(filePath, index), 2000);
        } else {
          console.error("Max retries reached. Skipping file.");
          retryAttempts.current = 0;
          currentSendIndex.current++;
          sendNextFile();
        }
      }
    };

  //@ts-ignore
  const sendFile = async (filePath, index) => {
    return new Promise((resolve, reject) => {
      const targetIp = qrData || "192.168.49.1";

      const socket = TcpSocket.createConnection(
        { port: 12345, host: targetIp },
        async () => {
          setTransferState("sending");
          const fileInfo: FileSystem.FileInfo = await FileSystem.getInfoAsync(
            filePath
          );
          const metadata = JSON.stringify({
            name: filePath.split("/").pop(),
            size: fileInfo.size,
            type: filePath.split(".").pop(),
          });

          socket.write(metadata + "\n");

          const chunkSize = 1024 * 32;
          let offset = 0;
          let sent = 0;
          let startTime = Date.now();

          try {
            while (
              offset < fileInfo.size &&
              !paused.current &&
              !cancelTransferRef.current
            ) {
              const chunk = await FileSystem.readAsStringAsync(filePath, {
                encoding: FileSystem.EncodingType.Base64,
                length: chunkSize,
                position: offset,
              });

              socket.write(chunk);
              offset += chunk.length;
              sent += chunk.length;

              const elapsed = (Date.now() - startTime) / 1000;
              const speed = sent / elapsed; // bytes/sec
              const remaining = fileInfo.size - sent;
              const eta = remaining / (speed || 1);

              setProgressMap((prev) => ({
                ...prev,
                [index]: sent / fileInfo.size,
              }));
              setSpeedMap((prev) => ({ ...prev, [index]: speed }));
              setEtaMap((prev) => ({ ...prev, [index]: eta }));
            }

            socket.destroy();
            resolve(null);
          } catch (err) {
            socket.destroy();
            reject(err);
          }
        }
      );

      socket.on("error", (err) => {
        console.error("Socket error:", err);
        socket.destroy();
        reject(err);
      });
    });
  };

  const pauseTransfer = () => {
    paused.current = true;
    setTransferState("paused");
  };

  const resumeTransfer = () => {
    paused.current = false;
    setTransferState("sending");
    sendNextFile();
  };

  const cancelTransfer = () => {
    cancelTransferRef.current = true;
    setTransferState("idle");
  };

  const getLocalIp = async () => {
    const ip = await NetworkInfo.getIPV4Address();
    setQrData(ip!);
  };
  const connectToIP = (ip: string) => {
    setConnected(true);
    setQrData(ip);
  };

  const startReceiving = async () => {
    setIsReceiving(true);
    await getLocalIp(); // Updates QR code with IP for sender
    const server = TcpSocket.createServer((client) => {
      let buffer = "";
      let metadata: any = null;

      client.on("data", async (data) => {
        if (!metadata) {
          const dataStr = data.toString();
          const splitIndex = dataStr.indexOf("\n");
          if (splitIndex !== -1) {
            const metaStr = dataStr.substring(0, splitIndex);
            metadata = JSON.parse(metaStr);
            buffer += dataStr.substring(splitIndex + 1);
          } else {
            buffer += dataStr;
          }
        } else {
          buffer += data.toString();
        }
      });

      client.on("drain", async () => {
        const filePath = `${FileSystem.documentDirectory}${
          metadata?.name || "received_" + Date.now()
        }`;
        try {
          await FileSystem.writeAsStringAsync(filePath, buffer, {
            encoding: FileSystem.EncodingType.Base64,
          });
          setReceivedFiles((prev) => [...prev, filePath]);
        } catch (err) {
          console.error("Error writing received file:", err);
        }
        setIsReceiving(false);
      });

      client.on("error", (e) => console.error("Receive error:", e));
    });

    server.listen({ port: 12345, host: "0.0.0.0" });
    serverRef.current = server;
  };

  const stopReceiving = () => {
    if (serverRef.current) {
      serverRef.current.close();
      setIsReceiving(false);
    }
  };

  const renderPreview = () => {
    if (!previewFile) return null;

    if (previewFile.match(/\.jpg$|\.jpeg$|\.png$/)) {
      return (
        <Image
          source={{ uri: previewFile }}
          style={{ width: 300, height: 300 }}
          resizeMode="contain"
        />
      );
    } else if (previewFile.match(/\.mp4$/)) {
      return (
        <Video
          source={{ uri: previewFile }}
          useNativeControls
          // resizeMode="contain"
          style={{ width: 300, height: 300 }}
        />
      );
    } else if (previewFile.match(/\.pdf$/)) {
      return (
        <Pdf
          source={{ uri: previewFile }}
          style={{ flex: 1, width: Dimensions.get("window").width }}
        />
      );
    } else {
      return <Text>Unsupported file type.</Text>;
    }
  };

  const GenerateQr = ({ qr }) => {
    useEffect(() => {
      generate();
    }, []);

    const generate = () => {
      RNQRGenerator.generate({
        value: qr,
        correctionLevel: "L",
      })
        .then((response) => {
          const { uri } = response;
          setImageUri(uri);
        })
        .catch((error) => console.log("Cannot create QR code", error));
    };

    return (
      <Image style={{ width: 100, height: 100 }} source={{ uri: imageUri }} />
    );
  };

  const getFileIconOrThumbnail = (fileUri: string) => {
    if (fileUri.match(/\.(jpg|jpeg|png)$/)) {
      return (
        <Image source={{ uri: fileUri }} style={{ width: 50, height: 50 }} />
      );
    } else if (fileUri.match(/\.mp4$/)) {
      return (
        <Image
          source={require("../../assets/icons/movie.png")}
          style={{ width: 50, height: 50 }}
        />
      );
    } else if (fileUri.match(/\.pdf$/)) {
      return (
        <Image
          source={require("../../assets/icons/pdf.png")}
          style={{ width: 50, height: 50 }}
        />
      );
    } else {
      return (
        <Image
          source={require("../../assets/icons/folder.png")}
          style={{ width: 50, height: 50 }}
        />
      );
    }
  };

  return (
    <View style={{ padding: 20, flex: 1 }}>
      <Text style={{ fontSize: 20, fontWeight: "bold" }}>
        Wi-Fi Direct & LAN File Transfer
      </Text>

      <Button title="Discover Peers" onPress={discoverPeers} />
      {/* <FlatList
        data={peers}

        keyExtractor={(item) => item.deviceAddress}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => connectToPeer(item)}>
            <Text style={{ padding: 10 }}>{item.deviceName}</Text>
          </TouchableOpacity>
        )}
      /> */}

      {connected && (
        <View style={{ alignItems: "center", marginVertical: 20 }}>
          <Text>QR Code to share device address:</Text>
          {/* <QRCode value={qrData} size={200} /> */}
          <GenerateQr qr={qrData} />
        </View>
      )}

      {scanning && hasPermission && (
        <CameraView
          style={{ height: 300, width: 300 }}
          facing="back"
          onBarcodeScanned={({ data }) => {
            setScanning(false);
            const ip = data;
            connectToIP(ip);
          }}
        />
      )}

      <Button title="Scan Receiver QR Code" onPress={() => setScanning(true)} />
      <Button
        title="Pick and Send Files"
        onPress={pickFiles}
        disabled={!connected}
      />
      <Button
        title="Start Receiving"
        onPress={startReceiving}
        disabled={isReceiving}
      />
      <Button
        title="Stop Receiving"
        onPress={stopReceiving}
        disabled={!isReceiving}
      />
      <Button
        title="Pause Transfer"
        onPress={pauseTransfer}
        disabled={transferState !== "sending"}
      />
      <Button
        title="Resume Transfer"
        onPress={resumeTransfer}
        disabled={transferState !== "paused"}
      />
      <Button
        title="Cancel Transfer"
        onPress={cancelTransfer}
        disabled={transferState !== "sending"}
      />
      <Button title="Disconnect" onPress={disconnect} disabled={!connected} />

      {/* Progress Bars */}
      <Text style={{ marginTop: 20, fontWeight: "bold" }}>
        Transfer Progress:
      </Text>

      {Object.entries(progressMap).map(([index, progress]) => {
        //@ts-ignore
        const speed = speedMap[index] || 0;
        // @ts-ignore
        const eta = etaMap[index] || 0;
        const speedStr =
          speed > 1024 * 1024
            ? `${(speed / (1024 * 1024)).toFixed(2)} MB/s`
            : `${(speed / 1024).toFixed(2)} KB/s`;
        const etaStr = `${Math.ceil(eta)}s`;

        return (
          <View key={index} style={{ marginVertical: 5 }}>
            <Text>File {+index + 1}:</Text>
            <ProgressBar
              styleAttr="Horizontal"
              indeterminate={false}
              // @ts-ignore
              progress={progress}
            />
            <Text>
              Speed: {speedStr} | ETA: {etaStr}
            </Text>
          </View>
        );
      })}

      {/* Received Files */}

      {receivedFiles.map((file, i) => (
        <TouchableOpacity
          key={i}
          // @ts-ignore
          onPress={() => setPreviewFile(file)}
          style={{ flexDirection: "row", alignItems: "center", marginTop: 10 }}
        >
          {/* @ts-ignore */}
          {getFileIconOrThumbnail(file)}
          <Text style={{ marginLeft: 10 }}>{file.split("/").pop()}</Text>
        </TouchableOpacity>
      ))}

      {/* Preview Modal */}
      <Modal visible={!!previewFile} transparent={false} animationType="slide">
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          {renderPreview()}
          {/* @ts-ignore */}
          <Button title="Close" onPress={() => setPreviewFile(null)} />
        </View>
      </Modal>

      {isReceiving && (
        <ActivityIndicator size="large" style={{ marginTop: 20 }} />
      )}
    </View>
  );
};

export default Download;
