import {
  Roboto_400Regular,
  Roboto_500Medium,
  Roboto_600SemiBold,
  Roboto_700Bold,
  useFonts,
} from '@expo-google-fonts/roboto';
import { DarkTheme, DefaultTheme, router, Stack, ThemeProvider } from 'expo-router';
import { SQLiteProvider } from 'expo-sqlite';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { Pressable } from 'react-native';
import 'react-native-reanimated';
import { ChevronLeft } from 'lucide-react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { KeyboardProvider } from 'react-native-keyboard-controller';

import Theme from '@/components/Theme';
import { DraftTransactionProvider } from '@/components/transaction-form';
import '@/global.css';
import { useColorScheme } from '@/hooks/useColorScheme';
import useColors from '@/hooks/useColors';
import { migrate } from '@/utils/db';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  anchor: '(tabs)',
};

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Roboto_400Regular,
    Roboto_500Medium,
    Roboto_600SemiBold,
    Roboto_700Bold,
  });

  useEffect(() => {
    if (fontError) {
      throw fontError;
    }
  }, [fontError]);

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();
  const colors = useColors();
  const navigationTheme = colorScheme === 'dark' ? DarkTheme : DefaultTheme;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <KeyboardProvider>
        <SQLiteProvider databaseName="spendly.db" onInit={migrate}>
          <ThemeProvider
            value={{
              ...navigationTheme,
              colors: {
                ...navigationTheme.colors,
                background: colors.background,
                card: colors.background,
                primary: colors.primary,
                text: colors.foreground,
                border: colors.border,
              },
            }}
          >
            <Theme>
              <DraftTransactionProvider>
                <Stack
                  screenOptions={{
                    headerTintColor: colors.foreground,
                    headerTransparent: false,
                  }}
                >
                  <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                  <Stack.Screen
                    name="transaction-form"
                    options={{
                      presentation: 'modal',
                      headerShown: false,
                    }}
                  />
                  <Stack.Screen
                    name="ledger-report"
                    options={{
                      presentation: 'modal',
                      title: 'Báo cáo',
                      headerShown: true,
                      headerBackVisible: true,
                      headerBackButtonDisplayMode: 'minimal',
                      headerShadowVisible: false,
                      headerLeft: () => (
                        <Pressable
                          accessibilityRole="button"
                          accessibilityLabel="Quay lại"
                          className="size-9 items-center justify-center"
                          onPress={() => router.back()}
                        >
                          <ChevronLeft size={24} color={colors.foreground} />
                        </Pressable>
                      ),
                    }}
                  />
                  <Stack.Screen
                    name="transaction/[id]"
                    options={{
                      title: '',
                      headerBackButtonDisplayMode: 'minimal',
                      headerShadowVisible: false,
                      headerShown: true,
                    }}
                  />
                </Stack>
              </DraftTransactionProvider>
            </Theme>
          </ThemeProvider>
        </SQLiteProvider>
      </KeyboardProvider>
    </GestureHandlerRootView>
  );
}
