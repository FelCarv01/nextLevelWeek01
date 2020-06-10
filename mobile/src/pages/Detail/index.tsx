import React, { useEffect, useState } from "react";
import { Feather as Icon, FontAwesome } from "@expo/vector-icons";
import { useNavigation, useRoute, useLinking } from "@react-navigation/native";
import { RectButton } from "react-native-gesture-handler";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  SafeAreaView,
  Linking,
} from "react-native";
import api from "../../services/api";
import * as MailComposer from "expo-mail-composer";

interface paramsdata {
  point_id: number;
}
interface Data {
  point: {
    image: string;
    name: string;
    email: string;
    whatsapp: string;
    city: string;
    uf: string;
  };
  items: { title: string }[];
}

const Detail = () => {
  const [data, setData] = useState<Data>({} as Data);

  const navigation = useNavigation();
  const route = useRoute();

  const routeData = route.params as paramsdata;

  useEffect(() => {
    api.get(`points/${routeData.point_id}`).then((res) => {
      setData(res.data);
    });
  }, []);

  function handlerNavigationBack() {
    navigation.goBack();
  }

  function handleComposeMail() {
    MailComposer.composeAsync({
      subject: "Interece na coleta de residuos",
      recipients: [data.point.email],
    });
  }

  function handkewhatsapp() {
    Linking.openURL(
      `whatsapp://send?phone=${data.point.whatsapp}&text=Tenho interece sobre coleta de Reiduos`
    );
  }

  if (!data.point) {
    return null;
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <TouchableOpacity onPress={handlerNavigationBack}>
          <Icon name="arrow-left" size={24} color="#34CB79" />
        </TouchableOpacity>

        <Image
          style={styles.pointImage}
          source={{
            uri: data.point.image,
          }}
        />
        <Text style={styles.pointName}>{data.point.name}</Text>
        <Text style={styles.pointItems}>
          {data.items.map((item) => item.title).join(",")}
        </Text>

        <View style={styles.address}>
          <Text style={styles.addressTitle}>Endereço</Text>
          <Text style={styles.addressContent}>
            {data.point.city}, {data.point.uf}
          </Text>
        </View>

        <View style={styles.footer}>
          <RectButton style={styles.button} onPress={handkewhatsapp}>
            <FontAwesome name="whatsapp" color="#fff" size={20} />
            <Text style={styles.buttonText}>Whatsapp</Text>
          </RectButton>

          <RectButton style={styles.button} onPress={handleComposeMail}>
            <Icon name="mail" color="#fff" size={20} />
            <Text style={styles.buttonText}>E-mail</Text>
          </RectButton>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Detail;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 32,
    paddingTop: 20,
  },

  pointImage: {
    width: "100%",
    height: 152,
    resizeMode: "cover",
    borderRadius: 10,
    marginTop: 32,
  },

  pointName: {
    color: "#322153",
    fontSize: 28,
    fontFamily: "Ubuntu_700Bold",
    marginTop: 24,
  },

  pointItems: {
    fontFamily: "Roboto_400Regular",
    fontSize: 18,
    lineHeight: 24,
    marginTop: 8,
    color: "#34CB79",
  },

  address: {
    marginTop: 32,
    marginBottom: 50,
  },

  addressTitle: {
    color: "#322153",
    fontFamily: "Roboto_500Medium",
    fontSize: 16,
  },

  addressContent: {
    fontFamily: "Roboto_400Regular",
    lineHeight: 24,
    marginTop: 8,
    color: "#6C6C80",
  },

  footer: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: "#999",
    paddingVertical: 20,
    paddingBottom: 0,
    paddingHorizontal: 32,
    flexDirection: "row",
    justifyContent: "space-between",
  },

  button: {
    width: "48%",
    backgroundColor: "#34CB79",
    borderRadius: 10,
    height: 50,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },

  buttonText: {
    marginLeft: 8,
    color: "#FFF",
    fontSize: 16,
    fontFamily: "Roboto_500Medium",
  },
});
