import Header from "@/components/Header";
import { HEADER_HEIGHT } from "@/constants/height";
import React from "react";
import { MaterialTabBar, Tabs } from "react-native-collapsible-tab-view";
import App from "./screens/app";
import Download from "./screens/download";
import File from "./screens/file";
import History from "./screens/history";
import Music from "./screens/music";
import Photo from "./screens/photo";
import Video from "./screens/video";

const Home = () => {
  return (
    <Tabs.Container
      renderHeader={Header}
      headerHeight={HEADER_HEIGHT} // optional
      allowHeaderOverscroll={true}
      revealHeaderOnScroll={true}
      initialTabName="APP"
      renderTabBar={(props) => (
        <MaterialTabBar
          {...props}
          contentContainerStyle={{ overflow: "scroll" }}
          scrollEnabled={true} // Ensures tab labels don’t shrink
          keepActiveTabCentered={true}
          activeColor="#ffffff"
          inactiveColor="#e4dada"
          labelStyle={{
            fontSize: 16,
            fontWeight: "bold",
            textAlign: "center",
            padding: 5,
            paddingHorizontal: 14,
          }}
          indicatorStyle={{ backgroundColor: "#f1fcfc" }}
          style={{ backgroundColor: "#066341" }}
          tabStyle={{ width: "auto" }}
        />
      )}
    >
      <Tabs.Tab name="HISTORY" label={"HISTORY"}>
        <Tabs.ScrollView>
          <History />
        </Tabs.ScrollView>
      </Tabs.Tab>
      <Tabs.Tab name="DOWNLOAD" label={"DOWNLOAD"}>
        <Tabs.ScrollView>
          <Download />
        </Tabs.ScrollView>
      </Tabs.Tab>
      <Tabs.Tab name={"APP"} label={"APP"}>
        <Tabs.ScrollView>
          <App />
        </Tabs.ScrollView>
      </Tabs.Tab>
      <Tabs.Tab name="PHOTO" label={"PHOTO"}>
        <Tabs.ScrollView>
          <Photo />
        </Tabs.ScrollView>
      </Tabs.Tab>
      <Tabs.Tab name="MUSIC" label={"MUSIC"}>
        <Tabs.ScrollView>
          <Music />
        </Tabs.ScrollView>
      </Tabs.Tab>
      <Tabs.Tab name="VIDEO" label={"VIDEO"}>
        <Tabs.ScrollView>
          <Video />
        </Tabs.ScrollView>
      </Tabs.Tab>
      <Tabs.Tab name="FILE" label={"FILE"}>
        <Tabs.ScrollView>
          <File />
        </Tabs.ScrollView>
      </Tabs.Tab>
    </Tabs.Container>
  );
};

export default Home;
