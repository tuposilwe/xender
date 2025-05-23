import { HEADER_HEIGHT } from "@/constants/height";
import Entypo from "@expo/vector-icons/Entypo";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { DrawerActions, useNavigation } from "@react-navigation/native";
import React from "react";
import {
  StyleSheet,
  TouchableOpacity,
  View
} from "react-native";

const Header = () => {
   const navigation = useNavigation();

  return (
    <View style={[styles.header, { height: HEADER_HEIGHT }]}>
      <TouchableOpacity onPress={() => navigation.getParent()?.dispatch(DrawerActions.openDrawer())}>
        <Entypo name="dots-three-vertical" style={{}} size={25} color="white" />
      </TouchableOpacity>
      <FontAwesome6 name="bars" size={25} color="white" />
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  header: {
    width: "100%",
    backgroundColor: "#066341",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 8,
  },
});
