import React from "react";
import {
  View,
  Text,
  Image,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

import { useFonts } from "expo-font";
import AppLoading from "expo-app-loading";

const FontSize = require("../assets/styles/FontSize");
const Colors = require("../assets/styles/Colors");
const Logo = require("../assets/logo.png");

export default function Welcome({ navigation }) {
  const [loaded] = useFonts({
    GreatVibes: require("../assets/styles/Fonts/GreatVibes-Regular.ttf"),
    Audiowide: require("../assets/styles/Fonts/Audiowide-Regular.ttf"),
  });

  if (!loaded) {
    return <AppLoading />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={["#101010", "#353535"]} style={styles.gradient}>
        <Image resizeMode="contain" style={styles.logo} source={Logo} />
        <Text style={styles.title}> SAN<Text style={[styles.title, {color: Colors.accept}]}>A</Text>MUZE </Text>
        <Text style={styles.description}>
          Bu uyguluma aracılığı ile SanAmuze'de bulunan eserler ile
          çizimlerinizi karşılaştırabilirsin. Tek yapman gereken QR kodunu
          okutup, çizimini göndermek.
        </Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("Main")}
        >
          <Text style={styles.buttonText}>BAŞLA</Text>
        </TouchableOpacity>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.seconday,
    // alignItems: "center",
    // justifyContent: "center",
  },
  gradient: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    height: "40%",
    width: "80%",
  },
  title: {
    marginTop: "5%",
    fontSize: FontSize.normalizeFont(45),
    fontFamily: "Audiowide",
    color: Colors.textPrimary
  },
  description: {
    textAlign: "center",
    marginLeft: "5%",
    marginRight: "5%",
    marginBottom: "5%",
    fontSize: FontSize.normalizeFont(14),
    color: Colors.textSecondary
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
    fontWeight: "bold",
  },
});
