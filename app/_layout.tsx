import FontAwesome from "@expo/vector-icons/FontAwesome";
import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { Suspense, useEffect } from "react";
import { useColorScheme } from "@/components/useColorScheme";
export { ErrorBoundary } from "expo-router";
import { ActivityIndicator } from "react-native";
import { SQLiteProvider } from "expo-sqlite";
import { db } from "@/db/db";
import { useMigrations } from "drizzle-orm/expo-sqlite/migrator";
import migrations from "@/drizzle/migrations";
import "react-native-reanimated";
import "@/globals.css";

export const DATABASE_NAME = "db.db";
export const unstable_settings = {  initialRouteName: "(tabs)"};
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();
  const { success, error } = useMigrations(db, migrations);
  return (
    <Suspense fallback={<ActivityIndicator />}>
      <SQLiteProvider databaseName={"db.db"} options={{ enableChangeListener: true }} useSuspense>
        <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="modal" options={{ presentation: "modal" }} />
          </Stack>
        </ThemeProvider>
      </SQLiteProvider>
    </Suspense>
  );
}

// import { useEffect } from 'react'
// import { initDatabase } from '@/lib/init-db'

// export default function RootLayout() {
//   useEffect(() => {
//     initDatabase()
//   }, [])

//   return <Slot />
// }
