import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  Dimensions,
  FlatList,
  StyleSheet,
} from "react-native";
import { PROMO_DATA } from "../constants/promos";

const { width } = Dimensions.get("window");

export const PromoCarousel = () => {
  const flatListRef = useRef(null);

  useEffect(() => {
    let internalIndex = 0;
    const timer = setInterval(() => {
      internalIndex = (internalIndex + 1) % PROMO_DATA.length;
      if (flatListRef.current) {
        flatListRef.current.scrollToIndex({
          index: internalIndex,
          animated: true,
        });
      }
    }, 4000);

    return () => clearInterval(timer);
  }, []);

  return (
    <FlatList
      ref={flatListRef}
      data={PROMO_DATA}
      horizontal
      pagingEnabled
      showsHorizontalScrollIndicator={false}
      keyExtractor={(item) => item.id}
      getItemLayout={(data, index) => ({
        length: width - 48,
        offset: (width - 48) * index,
        index,
      })}
      renderItem={({ item }) => (
        <View
          style={[
            styles.promoCard,
            { backgroundColor: item.bg, width: width - 48 },
          ]}
        >
          <View style={styles.promoTextContainer}>
            <Text style={styles.promoTitle}>{item.title}</Text>
            <Text style={styles.promoDesc}>{item.desc}</Text>
          </View>
          <item.icon color="rgba(255,255,255,0.6)" size={40} />
        </View>
      )}
    />
  );
};

const styles = StyleSheet.create({
  promoCard: {
    height: 120,
    borderRadius: 24,
    padding: 24,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginRight: 12,
    marginBottom: 32,
  },
  promoTitle: { color: "white", fontSize: 18, fontWeight: "800" },
  promoDesc: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 13,
    fontWeight: "500",
    marginTop: 4,
  },
});
