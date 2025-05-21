import { useEffect, useState } from "react";
import { View, Text, Image, StyleSheet, Dimensions } from "react-native";
import RNQRGenerator from "rn-qr-generator";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";

const { height } = Dimensions.get("screen");

const Receiver = () => {
  const [imageUri, setImageUri] = useState("");

  useEffect(() => {
    generate();
  }, []);

  const generate = () => {
    RNQRGenerator.generate({
      value: "otpauth://totp/Example:",
      correctionLevel: "L",
    })
      .then((response) => {
        const { uri } = response;
        setImageUri(uri);
      })
      .catch((error) => console.log("Cannot create QR code", error));
  };

  return (
    <View style={styles.container}>
      {imageUri ? (
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            borderWidth: 0.1,
            borderRadius: 10,
            padding: 5,
            backgroundColor: "#FFF",
            gap: 5,
          }}
        >
          <Image style={styles.image} source={{ uri: imageUri }} />

          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "row",
            }}
          >
            <FontAwesome6 name="shield-dog" size={24} color="green" />
            <Text
              style={{
                color: "green",
                fontWeight: "bold",
                marginLeft: 5,
              }}
            >
              AndroidShare_45762
            </Text>
          </View>
          <Text
            style={{
              margin: 5,
              fontWeight: "500",
            }}
          >
            Waiting for receiver
          </Text>
        </View>
      ) : (
        <Text>Generating QR Code...</Text>
      )}
    </View>
  );
};

export default Receiver;

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  image: {
    // backgroundColor: "#F3F3F3",
    width: height / 3,
    height: height / 3,
    // borderWidth: StyleSheet.hairlineWidth,
    marginBottom: 16,
  },
});
