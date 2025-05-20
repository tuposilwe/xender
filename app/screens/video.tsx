import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Pressable,
  ScrollView,
  ActivityIndicator,
  Image,
  Dimensions,
} from "react-native";
import * as MediaLibrary from "expo-media-library";
import { useVideoPlayer, VideoView } from "expo-video";

const VIDEO_SIZE = 110;
const VIDEO_MARGIN = 3;

type DateItem = { type: "date"; id: string; date: string };
type RowItem = { type: "row"; id: string; videos: MediaLibrary.Asset[] };
type RenderItem = DateItem | RowItem;

const formatDuration = (ms: number) => {
  const mins = String(Math.floor(ms / 60000)).padStart(2, "0");
  const secs = String(Math.floor((ms % 60000) / 1000)).padStart(2, "0");
  return `${mins}:${secs}`;
};

const VideoGallery = () => {
  const [items, setItems] = useState<RenderItem[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<MediaLibrary.Asset | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [endCursor, setEndCursor] = useState<string | undefined>(undefined);
  const [hasMore, setHasMore] = useState(true);
  const [permissionResponse, setPermissionResponse] = useState<any>(null);

  const fetchVideos = useCallback(async () => {
    if (!hasMore) return;
    try {
      setIsLoading(true);

      if (!permissionResponse || permissionResponse.status !== "granted") {
        const res = await MediaLibrary.requestPermissionsAsync();
        setPermissionResponse(res);
        if (res.status !== "granted") return;
      }

      const { assets, endCursor: newCursor, hasNextPage } = await MediaLibrary.getAssetsAsync({
        mediaType: "video",
        first: 30,
        after: endCursor,
        sortBy: MediaLibrary.SortBy.creationTime,
      });

      const processed = insertDateHeaders(assets);
      setItems((prev) => [...prev, ...processed]);
      setEndCursor(newCursor);
      setHasMore(hasNextPage);
    } catch (err) {
      console.error("Error loading videos:", err);
    } finally {
      setIsLoading(false);
    }
  }, [permissionResponse, endCursor, hasMore]);

  const insertDateHeaders = (assets: MediaLibrary.Asset[]): RenderItem[] => {
    if (assets.length === 0) return [];

    const grouped: { [date: string]: MediaLibrary.Asset[] } = {};
    assets.forEach((asset) => {
      const date = new Date(asset.creationTime).toDateString();
      if (!grouped[date]) grouped[date] = [];
      grouped[date].push(asset);
    });

    const results: RenderItem[] = [];
    for (const [date, videos] of Object.entries(grouped)) {
      results.push({ type: "date", id: `date-${date}-${Date.now()}-${Math.random()}`, date });
      for (let i = 0; i < videos.length; i += 3) {
        results.push({
          type: "row",
          id: `row-${date}-${i}-${Date.now()}`,
          videos: videos.slice(i, i + 3),
        });
      }
    }
    return results;
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  const handleScroll = ({ nativeEvent }: any) => {
    const { layoutMeasurement, contentOffset, contentSize } = nativeEvent;
    const closeToBottom = layoutMeasurement.height + contentOffset.y >= contentSize.height - 100;
    if (closeToBottom && hasMore && !isLoading) {
      fetchVideos();
    }
  };

  // Always call hooks unconditionally
  const player = useVideoPlayer(
    //@ts-ignore
    selectedVideo ? { uri: selectedVideo.uri } : undefined,
    (player) => {
      if (player) {
        player.loop = true;
        player.play();
      }
    }
  );

  return (
    <View style={styles.container}>
      {items.length === 0 && isLoading ? (
        <View style={styles.fullScreenLoading}>
          <ActivityIndicator size="large" />
        </View>
      ) : (
        <ScrollView
          onScroll={handleScroll}
          scrollEventThrottle={400}
          contentContainerStyle={styles.listContent}
        >
          {items.map((item) => {
            if (item.type === "date") {
              return (
                <Text key={item.id} style={styles.dateHeader}>
                  {item.date}
                </Text>
              );
            }

            if (item.type === "row") {
              return (
                <View key={item.id} style={styles.row}>
                  {item.videos.map((video) => (
                    <Pressable
                     key={video.id} onPress={() => setSelectedVideo(video)}>
                      <View style={styles.thumbnailContainer}>
                        <Image
                          source={{ uri: video.uri }}
                          style={styles.videoThumbnail}
                          resizeMode="cover"
                        />
                        <View style={styles.overlay}>
                          <Text style={styles.duration}>
                            {formatDuration(video.duration * 1000)}
                          </Text>
                        </View>
                      </View>
                    </Pressable>
                  ))}
                </View>
              );
            }

            return null;
          })}
          {isLoading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" />
            </View>
          )}
        </ScrollView>
      )}

      <Modal
        visible={selectedVideo !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setSelectedVideo(null)}
      >
        <View style={styles.modalContainer}>
          <Pressable style={styles.modalBackground} onPress={() => setSelectedVideo(null)} />
          {selectedVideo && player && (
            <VideoView
              player={player}
              style={styles.fullscreenVideo}
            />
          )}
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  listContent: { padding: 10 },
  dateHeader: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 12,
    marginBottom: 6,
    backgroundColor: "#eee",
    padding: 6,
    borderRadius: 4,
  },
  row: { flexDirection: "row" },
  thumbnailContainer: {
    width: VIDEO_SIZE,
    height: VIDEO_SIZE,
    margin: VIDEO_MARGIN,
    borderRadius: 5,
    overflow: "hidden",
    position: "relative",
  },
  videoThumbnail: { width: "100%", height: "100%" },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "flex-end",
    alignItems: "flex-end",
    padding: 5,
  },
  duration: {
    backgroundColor: "rgba(0,0,0,0.6)",
    color: "#fff",
    paddingHorizontal: 4,
    paddingVertical: 2,
    fontSize: 12,
    borderRadius: 4,
  },
  fullScreenLoading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.85)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBackground: {
    ...StyleSheet.absoluteFillObject,
  },
  fullscreenVideo: {
    width: Dimensions.get("window").width * 0.9,
    height: Dimensions.get("window").height * 0.6,
  },
  loadingContainer: {
    paddingVertical: 20,
  },
});

export default VideoGallery;
