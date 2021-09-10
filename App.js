import { StatusBar } from "expo-status-bar";
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";


import { useFonts } from "expo-font";
import AppLoading from "expo-app-loading";

import Welcome from "./screens/Welcome";
import Main from "./screens/Main";

const FontSize = require("./assets/styles/FontSize");
const Colors = require("./assets/styles/Colors");
const Stack = createNativeStackNavigator();

export default function App() {
  const [loaded] = useFonts({
    GreatVibes: require("./assets/styles/Fonts/GreatVibes-Regular.ttf"),
    Audiowide: require("./assets/styles/Fonts/Audiowide-Regular.ttf"),
  });

  if (!loaded) {
    return <AppLoading />;
  }

  return (
    <NavigationContainer>
      <StatusBar style="light" />
      <Stack.Navigator initialRouteName="Welcome">
        <Stack.Screen
          options={{ headerShown: false }}
          name="Welcome"
          component={Welcome}
        />
        <Stack.Screen
          options={{
            headerTitle: "SANAMUZE",
            headerStyle: {
              backgroundColor: Colors.seconday,
            },
            headerTintColor: "#FFFFFF",
            headerTitleStyle: {
              fontFamily: "Audiowide",
              fontSize: FontSize.normalizeFont(20),
              color: "#FFFFFF"
            }
          }}
          name="Main"
          component={Main}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
