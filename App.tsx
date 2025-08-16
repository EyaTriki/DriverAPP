import React from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { GluestackUIProvider } from "@gluestack-ui/themed";
import customConfig from "./config";
import MainNavigator from "./src/navigation/MainNavigator";
import "./global.css";

const App = () => {
  return (
    <GluestackUIProvider config={customConfig}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <MainNavigator />
      </GestureHandlerRootView>
    </GluestackUIProvider>
  );
};

export default App;
