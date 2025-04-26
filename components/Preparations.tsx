import { View, Text, TouchableOpacity } from "react-native";
import React from "react";

const Preparations = ({ navigation }: any) => {
  return (
    <View>
      <TouchableOpacity onPress={() => navigation.navigate("Home")}>
        <Text>Preparations</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Preparations;
