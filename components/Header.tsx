import { HEADER_HEIGHT } from "@/constants/height";
import AntDesign from '@expo/vector-icons/AntDesign';
import Entypo from "@expo/vector-icons/Entypo";
import EvilIcons from '@expo/vector-icons/EvilIcons';
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { DrawerActions, useNavigation } from "@react-navigation/native";
import React, { useRef, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Popover, {
  PopoverMode,
  PopoverPlacement,
} from "react-native-popover-view";
import Divider from "./Divider";

const Header = () => {
  const navigation = useNavigation();
  const touchable = useRef(null);
  const [showPopover, setShowPopover] = useState(false);

  return (
    <View style={[styles.header, { height: HEADER_HEIGHT }]}>
      <TouchableOpacity
        onPress={() =>
          navigation.getParent()?.dispatch(DrawerActions.openDrawer())
        }
      >
        <Entypo name="dots-three-vertical" style={{}} size={25} color="white" />
      </TouchableOpacity>
      <TouchableOpacity ref={touchable} onPress={() => setShowPopover(true)}>
        <FontAwesome6 name="bars" size={25} color="white" />
      </TouchableOpacity>
      <Popover
        from={touchable}
        isVisible={showPopover}
        onRequestClose={() => setShowPopover(false)}
        mode={PopoverMode.RN_MODAL}
        placement={PopoverPlacement.BOTTOM}
        arrowSize={{ width: 20, height: 10 }}
        popoverStyle={{
          borderRadius: 8,
          backgroundColor: "rgba(0, 0, 0, 0.7)",
        }}
        backgroundStyle={{ backgroundColor: "transparent" }}
    
      >
        <View>
          <View
            style={{
              flexDirection: "row",
              padding: 10,
           
              alignItems: "center",
            }}
          >
            <Entypo name="tv" size={15} color="white" />
            <Text style={{ color: "white", marginLeft: 9 }}>Connect to PC</Text>
          </View>
          <Divider width={0.3}/>
           <View
            style={{
              flexDirection: "row",
              padding: 10,
        
              alignItems: "center",
            }}
          >
           <AntDesign name="android" size={15} color="white" />
            <Text style={{ color: "white", marginLeft: 9 }}>Connect to Android</Text>
          </View>

           <View
            style={{
              flexDirection: "row",
              padding: 10,
         
              alignItems: "center",
            }}
          >
           <EvilIcons name="share-google" size={24} color="white" />
            <Text style={{ color: "white", marginLeft: 9 }}>Share Xender</Text>
          </View>
           <View
            style={{
              flexDirection: "row",
              padding: 10,
            
              alignItems: "center",
            }}
          >
            <AntDesign name="swap" size={24} color="white" />
            <Text style={{ color: "white", marginLeft: 9 }}>Phone Copy</Text>
          </View>
        </View>
      </Popover>
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
    paddingRight: 30,
  },
});
