import React, { useEffect, useState } from "react";
import { Feather as Icon } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Image,
  SafeAreaView,
  Alert,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import { SvgUri } from "react-native-svg";
import api from "../../services/api";
import * as Location from "expo-location";

interface Item {
  id: number;
  title: string;
  image: string;
}
interface Points {
  id: number;
  image: string;
  name: string;
  latitude: number;
  longitude: number;
}
interface Params {
  uf: string;
  city: string;
}

const Points = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const routeParams = route.params as Params;
  const [items, setItems] = useState<Item[]>([]);
  const [Points, setPoints] = useState<Points[]>([]);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [initialPosition, setInitialPosition] = useState<[number, number]>([
    0,
    0,
  ]);

  useEffect(() => {
    api
      .get("points", {
        params: {
          uf: routeParams.uf,
          city: routeParams.city,
          items: selectedItems,
        },
      })
      .then((res) => {
        setPoints(res.data);
      });
  }, [selectedItems]);

  useEffect(() => {
    async function loadPosition() {
      const { status } = await Location.requestPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Ooops...",
          "Precisamos da sua permissão para obter a localização"
        );
        return;
      }

      const location = await Location.getCurrentPositionAsync();
      const { latitude, longitude } = location.coords;
      setInitialPosition([latitude, longitude]);
    }

    loadPosition();
  }, []);

  useEffect(() => {
    api.get("items").then((res) => {
      setItems(res.data);
    });
  }, []);

  function handlerNavigationBack() {
    navigation.goBack();
  }
  function handlerNavigationToDetail(id: number) {
    navigation.navigate("Detail", { point_id: id });
  }
  function handleSelectedItem(id: number) {
    const alreadySelected = selectedItems.findIndex((item) => item === id);
    if (alreadySelected >= 0) {
      const filterenItems = selectedItems.filter((item) => item !== id);

      setSelectedItems(filterenItems);
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <TouchableOpacity onPress={handlerNavigationBack}>
          <Icon name="arrow-left" size={24} color="#34CB79" />
        </TouchableOpacity>
        <View>
          <Text style={styles.title}>Bem vindo.</Text>
          <Text style={styles.description}>
            Encontre no mapa um ponto de coleta.
          </Text>
        </View>
        <View style={styles.mapContainer}>
          {initialPosition[0] !== 0 && (
            <MapView
              style={styles.map}
              loadingEnabled={initialPosition[0] === 0}
              initialRegion={{
                latitude: initialPosition[0],
                longitude: initialPosition[1],
                latitudeDelta: 0.012,
                longitudeDelta: 0.012,
              }}
            >
              {Points.map((point) => (
                <Marker
                  key={String(point.id)}
                  onPress={() => handlerNavigationToDetail(point.id)}
                  style={styles.mapMarker}
                  coordinate={{
                    latitude: point.latitude,
                    longitude: point.longitude,
                  }}
                >
                  <View style={styles.mapMarkerContainer}>
                    <Image
                      style={styles.mapMarkerImage}
                      source={{ uri: point.image }}
                    ></Image>
                    <Text style={styles.mapMarkerTitle}>{point.name}</Text>
                  </View>
                </Marker>
              ))}
            </MapView>
          )}
        </View>
      </View>
      <View style={styles.itemsContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: 18,
          }}
        >
          {items.map((item) => (
            <TouchableOpacity
              key={String(item.id)}
              style={[
                styles.item,
                selectedItems.includes(item.id) ? styles.selectedItem : {},
              ]}
              activeOpacity={0.65}
              onPress={() => handleSelectedItem(item.id)}
            >
              <SvgUri width={42} height={42} uri={item.image} />
              <Text style={styles.itemTitle}>{item.title}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default Points;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 32,
    paddingTop: 18,
  },

  title: {
    fontSize: 20,
    fontFamily: "Ubuntu_700Bold",
    marginTop: 24,
  },

  description: {
    color: "#6C6C80",
    fontSize: 16,
    marginTop: 4,
    fontFamily: "Roboto_400Regular",
  },

  mapContainer: {
    flex: 1,
    width: "100%",
    borderRadius: 10,
    overflow: "hidden",
    marginTop: 16,
  },

  map: {
    width: "100%",
    height: "100%",
  },

  mapMarker: {
    width: 90,
    height: 80,
  },

  mapMarkerContainer: {
    width: 90,
    height: 70,
    backgroundColor: "#34CB79",
    flexDirection: "column",
    borderRadius: 8,
    overflow: "hidden",
    alignItems: "center",
  },

  mapMarkerImage: {
    width: 90,
    height: 45,
    resizeMode: "cover",
  },

  mapMarkerTitle: {
    flex: 1,
    fontFamily: "Roboto_400Regular",
    color: "#FFF",
    fontSize: 13,
    lineHeight: 23,
  },

  itemsContainer: {
    flexDirection: "row",
    marginTop: 16,
    marginBottom: 32,
  },

  item: {
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "#eee",
    height: 120,
    width: 120,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 16,
    marginRight: 8,
    alignItems: "center",
    justifyContent: "space-between",

    textAlign: "center",
  },

  selectedItem: {
    borderColor: "#34CB79",
    borderWidth: 2,
  },

  itemTitle: {
    fontFamily: "Roboto_400Regular",
    textAlign: "center",
    fontSize: 13,
  },
});
