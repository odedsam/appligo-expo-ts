import '@/globals.css';
import 'react-native-reanimated';
import * as SplashScreen from 'expo-splash-screen';
import { useColorScheme } from '@/components/useColorScheme';
import { db } from '@/db/db';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator';
import { Suspense, useEffect } from 'react';
import { ActivityIndicator } from 'react-native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { SQLiteProvider } from 'expo-sqlite';
export { ErrorBoundary } from 'expo-router';
import migrations from '@/drizzle/migrations';
import FontAwesome from '@expo/vector-icons/FontAwesome';

export const DATABASE_NAME = 'db.db';
export const unstable_settings = { initialRouteName: 'welcome' };

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({ SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'), ...FontAwesome.font, });
  useEffect(() => { if (error) throw error; }, [error]);
  useEffect(() => { if (loaded) { SplashScreen.hideAsync(); }}, [loaded]);
  if (!loaded) { return null; }
  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();
  const { success, error } = useMigrations(db, migrations);

  return (
    <Suspense fallback={<ActivityIndicator />}>
      <SQLiteProvider databaseName={'db.db'} options={{ enableChangeListener: true }} useSuspense>
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <Stack screenOptions={{header:()=>false}}>
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
          </Stack>
        </ThemeProvider>
      </SQLiteProvider>
    </Suspense>
  );
}
