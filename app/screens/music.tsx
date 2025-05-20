import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Pressable,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import * as MediaLibrary from 'expo-media-library';
import { Asset } from 'expo-media-library';
import { Audio } from 'expo-av';

type DateItem = {
  type: 'date';
  id: string;
  date: string;
};

type RowItem = {
  type: 'row';
  id: string;
  audios: Asset[];
};

type RenderItem = DateItem | RowItem;

const formatDuration = (milliseconds: number) => {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, '0');
  const seconds = (totalSeconds % 60).toString().padStart(2, '0');
  return `${minutes}:${seconds}`;
};
const Music = () => {
const [permissionResponse, setPermissionResponse] = useState<any>(null);
  const [items, setItems] = useState<RenderItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [endCursor, setEndCursor] = useState<string | undefined>(undefined);
  const [hasMore, setHasMore] = useState(true);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [currentAudioId, setCurrentAudioId] = useState<string | null>(null);

  const fetchAudios = useCallback(async () => {
    if (!hasMore) return;

    try {
      setIsLoading(true);

      if (!permissionResponse || permissionResponse.status !== 'granted') {
        const res = await MediaLibrary.requestPermissionsAsync();
        setPermissionResponse(res);
        if (res.status !== 'granted') return;
      }

      const { assets, endCursor: newEndCursor, hasNextPage } =
        await MediaLibrary.getAssetsAsync({
          mediaType: 'audio',
          first: 30,
          after: endCursor,
          sortBy: MediaLibrary.SortBy.creationTime,
        });

      setEndCursor(newEndCursor);
      setHasMore(hasNextPage);

      const processed = insertDateHeaders(assets);
      setItems((prev) => [...prev, ...processed]);
    } catch (error) {
      console.error('Error fetching audios:', error);
    } finally {
      setIsLoading(false);
    }
  }, [permissionResponse, endCursor, hasMore]);

  useEffect(() => {
    fetchAudios();
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

    Object.entries(grouped).forEach(([date, audios]) => {
      const dateExists = items.some(
        (item) => item.type === 'date' && item.date === date
      );
      if (!dateExists) {
        result.push({ type: 'date', id: `date-${date}`, date });
      }

      let rowIndex = 0;
      for (let i = 0; i < audios.length; i += 3) {
        const rowAudios = audios.slice(i, i + 3);
        result.push({
          type: 'row',
          id: `row-${date}-${rowIndex++}-${Date.now()}-${Math.random()}`,
          audios: rowAudios,
        });
      }
    });

    return result;
  };

  const playAudio = async (audio: Asset) => {
    try {
      if (sound) {
        await sound.unloadAsync();
        setSound(null);
        setCurrentAudioId(null);
      }

      const { sound: newSound } = await Audio.Sound.createAsync({
        uri: audio.uri,
      });

      setSound(newSound);
      setCurrentAudioId(audio.id);
      await newSound.playAsync();
    } catch (error) {
      console.error('Error playing audio:', error);
    }
  };

  useEffect(() => {
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [sound]);

  const handleScroll = ({ nativeEvent }: { nativeEvent: any }) => {
    const { layoutMeasurement, contentOffset, contentSize } = nativeEvent;
    const isCloseToBottom =
      layoutMeasurement.height + contentOffset.y >= contentSize.height - 100;
    if (isCloseToBottom && hasMore && !isLoading) {
      fetchAudios();
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
            if (item.type === 'date') {
              return (
                <Text style={styles.dateHeader} key={item.id}>
                  {item.date}
                </Text>
              );
            }

            if (item.type === 'row') {
              return (
                <View style={styles.audioRow} key={item.id}>
                  {item.audios.map((audio) => (
                    <Pressable
                      key={audio.id}
                      onPress={() => playAudio(audio)}
                      style={[
                        styles.audioItem,
                        currentAudioId === audio.id && styles.activeAudioItem,
                      ]}
                    >
                      <Text numberOfLines={1} style={styles.audioTitle}>
                        {audio.filename}
                      </Text>
                      <Text style={styles.audioDuration}>
                        {formatDuration(audio.duration * 1000)}
                      </Text>
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  listContent: {
    paddingHorizontal: 10,
    paddingBottom: 20,
  },
  dateHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 12,
    marginBottom: 6,
    backgroundColor: '#eee',
    padding: 6,
    borderRadius: 4,
  },
  audioRow: {
    paddingVertical: 8,
  },
  audioItem: {
    padding: 10,
    backgroundColor: '#f1f1f1',
    borderRadius: 6,
    marginBottom: 6,
  },
  activeAudioItem: {
    backgroundColor: '#d0f0d0',
  },
  audioTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  audioDuration: {
    fontSize: 12,
    color: '#555',
    marginTop: 4,
  },
  loadingContainer: {
    paddingVertical: 20,
  },
  fullScreenLoading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Music