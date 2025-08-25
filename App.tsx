import React, { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { GluestackUIProvider } from "@gluestack-ui/themed";
import customConfig from "./config";
import MainNavigator from "./src/navigation/MainNavigator";
import { useAuthStore } from "./src/stores/authStore";
import { useSocketStore } from "./src/stores/socket";
import "./global.css";

const App = () => {
  const { token, isAuthenticated } = useAuthStore();
  const { connect, disconnect, isConnected } = useSocketStore();

  // Initialize socket connection when user is authenticated
  useEffect(() => {
    console.log('🔍 Auth state check:', { isAuthenticated, hasToken: !!token, isConnected });
    console.log('🔍 Token value in App:', token);
    
    if (isAuthenticated && token && !isConnected) {
      console.log('Initializing socket connection...');
      connect(token);
    } else if (!isAuthenticated && isConnected) {
      console.log('Disconnecting socket...');
      disconnect();
    }
  }, [isAuthenticated, token, isConnected]);

  return (
    <GluestackUIProvider config={customConfig}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <MainNavigator />
      </GestureHandlerRootView>
    </GluestackUIProvider>
  );
};

export default App;
