import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Modal,
  Pressable,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import * as MediaLibrary from "expo-media-library";
import { Asset } from "expo-media-library";
import ImageViewer from "react-native-image-zoom-viewer";

type DateItem = {
  type: "date";
  id: string;
  date: string;
};

type RowItem = {
  type: "row";
  id: string;
  photos: Asset[];
};

type RenderItem = DateItem | RowItem;

const IMAGE_SIZE = 110;
const IMAGE_MARGIN = 3;

const Photo: React.FC = () => {
  const [permissionResponse, setPermissionResponse] = useState<any>(null);
  const [items, setItems] = useState<RenderItem[]>([]);
  const [selectedImage, setSelectedImage] = useState<Asset | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [endCursor, setEndCursor] = useState<string | undefined>(undefined);
  const [hasMore, setHasMore] = useState(true);

  const fetchImages = useCallback(async () => {
    if (!hasMore) return;

    try {
      setIsLoading(true);

      if (!permissionResponse || permissionResponse.status !== "granted") {
        const res = await MediaLibrary.requestPermissionsAsync();
        setPermissionResponse(res);
        if (res.status !== "granted") return;
      }

      const {
        assets,
        endCursor: newEndCursor,
        hasNextPage,
      } = await MediaLibrary.getAssetsAsync({
        mediaType: "photo",
        first: 30,
        after: endCursor,
        sortBy: MediaLibrary.SortBy.creationTime,
      });

      setEndCursor(newEndCursor);
      setHasMore(hasNextPage);

      const processed = insertDateHeaders(assets);
      setItems((prev) => [...prev, ...processed]);
    } catch (error) {
      console.error("Error fetching images:", error);
    } finally {
      setIsLoading(false);
    }
  }, [permissionResponse, endCursor, hasMore]);

  useEffect(() => {
    fetchImages();
  }, []);

  const insertDateHeaders = (assets: Asset[]): RenderItem[] => {
    if (assets.length === 0) return [];

    const grouped: { [date: string]: Asset[] } = {};
    const result: RenderItem[] = [];

    assets.forEach((asset) => {
      const date = new Date(asset.creationTime).toDateString();
      if (!grouped[date]) grouped[date] = [];
      grouped[date].push(asset);
    });

    Object.entries(grouped).forEach(([date, photos]) => {
      const dateExists = items.some(
        (item) => item.type === "date" && item.date === date
      );
      if (!dateExists) {
        result.push({ type: "date", id: `date-${date}`, date });
      }

      let rowIndex = 0;
      for (let i = 0; i < photos.length; i += 3) {
        const rowPhotos = photos.slice(i, i + 3);
        result.push({
          type: "row",
          id: `row-${date}-${rowIndex++}-${Date.now()}-${Math.random()+192}`,
          photos: rowPhotos,
        });
      }
    });

    return result;
  };

  const handleScroll = ({ nativeEvent }: { nativeEvent: any }) => {
    const { layoutMeasurement, contentOffset, contentSize } = nativeEvent;
    const isCloseToBottom =
      layoutMeasurement.height + contentOffset.y >= contentSize.height - 100;
    if (isCloseToBottom && hasMore && !isLoading) {
      fetchImages();
    }
  };

  return (
    <View style={styles.container}>
      {items.length === 0 && isLoading ? (
        <View style={styles.fullScreenLoading}>
          <ActivityIndicator size="large" />
        </View>
      ) : (
        <ScrollView
          onScroll={({ nativeEvent }) => handleScroll({ nativeEvent })}
          scrollEventThrottle={400}
          contentContainerStyle={styles.listContent}
        >
          {items.map((item) => {
            if (item.type === "date") {
              return (
                <Text style={styles.dateHeader} key={item.id}>
                  {item.date}
                </Text>
              );
            }

            if (item.type === "row") {
              return (
                <View style={styles.row} key={item.id}>
                  {item.photos.map((photo) => (
                    <TouchableOpacity
                      key={`${photo.id}-${item.id}`}
                      onPress={() => setSelectedImage(photo)}
                      activeOpacity={0.7}
                    >
                      <Image
                        source={{ uri: photo.uri }}
                        style={styles.image}
                        resizeMode="cover"
                      />
                    </TouchableOpacity>
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
        visible={!!selectedImage}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setSelectedImage(null)}
      >
        <View style={{ flex: 1, backgroundColor: "black" }}>
          <Pressable
            style={StyleSheet.absoluteFill}
            onPress={() => setSelectedImage(null)}
          />
          <ImageViewer
            imageUrls={[{ url: selectedImage?.uri ?? "" }]}
            saveToLocalByLongPress={false}
            enableSwipeDown
            onSwipeDown={() => setSelectedImage(null)}
            swipeDownThreshold={50}
            
          />
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  listContent: {
    paddingHorizontal: 10,
    paddingBottom: 20,
  },
  dateHeader: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 12,
    marginBottom: 6,
    backgroundColor: "#eee",
    padding: 6,
    borderRadius: 4,
  },
  row: {
    flexDirection: "row",
    justifyContent: "flex-start",
    flexWrap: "nowrap",
  },
  image: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
    margin: IMAGE_MARGIN,
    borderRadius: 5,
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
  loadingContainer: {
    paddingVertical: 20,
  },
  fullScreenLoading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Photo;
