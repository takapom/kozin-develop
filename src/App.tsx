import React, { useState } from "react";
import {
  useFonts,
  ZenMaruGothic_500Medium,
  ZenMaruGothic_700Bold,
} from "@expo-google-fonts/zen-maru-gothic";
import { ActivityIndicator, View } from "react-native";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { TopScreen } from "./screens/TopScreen";
import { AuthScreen } from "./screens/auth/AuthScreen";
import { HomeScreen } from "./screens/HomeScreen";
import { HirobaScreen } from "./screens/HirobaScreen";
import { HirobaSettingsScreen } from "./screens/HirobaSettingsScreen";
import { colors } from "./theme/tokens";

type Screen = "top" | "auth" | "home" | "hiroba" | "hirobaSettings" | "settings";

function Router() {
  const { session, loading } = useAuth();
  const [screen, setScreen] = useState<Screen>("top");
  const [selectedHirobaId, setSelectedHirobaId] = useState<string | null>(null);

  // 初回セッション確認中
  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: colors.background,
        }}
      >
        <ActivityIndicator size="large" color={colors.accent} />
      </View>
    );
  }

  // ログイン済みならホームへ直行
  if (session && (screen === "top" || screen === "auth")) {
    setScreen("home");
    return null;
  }

  // 未ログインなのにホーム以降にいる場合はトップへ戻す
  if (!session && screen !== "top" && screen !== "auth") {
    setScreen("top");
    return null;
  }

  if (screen === "top") {
    return <TopScreen onStart={() => setScreen("auth")} />;
  }

  if (screen === "auth") {
    return <AuthScreen onLogin={() => setScreen("home")} />;
  }

  if (screen === "home") {
    return (
      <HomeScreen
        onSelectHiroba={(id: string) => {
          setSelectedHirobaId(id);
          setScreen("hiroba");
        }}
        onOpenSettings={() => setScreen("settings")}
      />
    );
  }

  if (screen === "hiroba" && selectedHirobaId) {
    return (
      <HirobaScreen
        hirobaId={selectedHirobaId}
        onBack={() => setScreen("home")}
        onOpenSettings={() => setScreen("hirobaSettings")}
      />
    );
  }

  if (screen === "hirobaSettings" && selectedHirobaId) {
    return (
      <HirobaSettingsScreen
        hirobaId={selectedHirobaId}
        onBack={() => setScreen("hiroba")}
      />
    );
  }

  if (screen === "settings") {
    return (
      <HirobaSettingsScreen
        onBack={() => setScreen("home")}
      />
    );
  }

  return null;
}

export default function App() {
  const [fontsLoaded] = useFonts({
    ZenMaruGothic_500Medium,
    ZenMaruGothic_700Bold,
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router />
      </AuthProvider>
    </QueryClientProvider>
  );
}
