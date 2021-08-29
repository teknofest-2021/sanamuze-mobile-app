import React from "react";
import {
  View,
  Text,
  Image,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

import { useFonts } from "expo-font";
import AppLoading from "expo-app-loading";

const FontSize = require("../assets/styles/FontSize");
const Colors = require("../assets/styles/Colors");
const Logo = require("../assets/logo.png");

export default function Welcome({ navigation }) {
  const [loaded] = useFonts({
    GreatVibes: require("../assets/styles/Fonts/GreatVibes-Regular.ttf"),
  });

  if (!loaded) {
    return <AppLoading />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <Image resizeMode="contain" style={styles.logo} source={Logo} />
      <Text style={styles.title}> SanAmuze </Text>
      <Text style={styles.description}>
        Bu uyguluma aracılığı ile SanAmuze'de bulunan eserler ile çizimlerinizi
        karşılaştırabilirsin. Tek yapman gereken QR kodunu okutup, çizimini
        göndermek.
      </Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("Main")}
      >
        <Text style={styles.buttonText}>BAŞLA</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    height: "40%",
    width: "80%",
  },
  title: {
    marginTop: "5%",
    fontSize: FontSize.normalizeFont(50),
    fontFamily: "GreatVibes",
  },
  description: {
    textAlign: "center",
    marginLeft: "5%",
    marginRight: "5%",
    marginBottom: "5%",
    fontSize: FontSize.normalizeFont(14),
  },
  button: {
    width: "90%",
    height: "6%",
    backgroundColor: Colors.accept,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: Colors.textPrimary,
    fontSize: FontSize.normalizeFont(18),
    fontWeight: "bold"
  },
});
