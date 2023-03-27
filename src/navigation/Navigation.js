import { useContext, useEffect, useState } from "react";
import { useCallback } from "react";
import { View, Text } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SplashScreen from "expo-splash-screen";
import LoginScreen from "../screens/Auth/LoginScreen";

import SignupScreen from "../screens/Auth/SignupScreen";
import WelcomeScreen from "../screens/Welcome/WelcomeScreen";

import { Colors } from "../constants/styles";
import { newColors } from "../constants/colors";

import AuthContentProvider, { AuthContext } from "../store/auth-context";
import IconButton from "../components/ui/IconButton";

import AppLoading from "expo-app-loading";
import AllPlaces from "../screens/Favorite/AllPlaces";
import AddPlace from "../screens/Favorite/AddPlace";
import Map from "../screens/Favorite/Map";
import { init } from "../util/database";
import PlaceDetails from "../screens/Favorite/PlaceDetails";

const Stack = createNativeStackNavigator();

function AuthStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: Colors.primary500 },
        headerTintColor: "white",
        contentStyle: { backgroundColor: Colors.primary100 },
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />
    </Stack.Navigator>
  );
}

function AuthenticatedStack() {
  const authCtx = useContext(AuthContext);
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: newColors.primary500 },
        headerTintColor: newColors.gray700,
        contentStyle: { backgroundColor: newColors.gray700 },
      }}
    >
      <Stack.Screen
        name="AllPlaces"
        component={AllPlaces}
        options={({ navigation }) => ({
          title: "Your Favorite Places",
          headerRight: ({ tintColor }) => (
            <IconButton
              icon="add"
              color={tintColor}
              size={24}
              onPress={() => navigation.navigate("AddPlace")}
            />
          ),
        })}
      />
      <Stack.Screen
        name="AddPlace"
        component={AddPlace}
        options={{
          title: "Add a new Place",
          headerRight: ({ tintColor }) => (
            <IconButton
              icon="exit"
              color={tintColor}
              size={24}
              onPress={authCtx.logout}
            />
          ),
        }}
      />
      <Stack.Screen name="Map" component={Map} />
      <Stack.Screen
        name="PlaceDetails"
        component={PlaceDetails}
        options={{
          title: "Loading Place...",
        }}
      />
      <Stack.Screen
        name="Welcome"
        component={WelcomeScreen}
        options={{
          headerRight: ({ tintColor }) => (
            <IconButton
              icon="exit"
              color={tintColor}
              size={24}
              onPress={authCtx.logout}
            />
          ),
        }}
      />
    </Stack.Navigator>
  );
}

function Navigation({ onLayoutRootView }) {
  const authCtx = useContext(AuthContext);
  return (
    <NavigationContainer onReady={onLayoutRootView}>
      {!authCtx.isAuthenticated && <AuthStack />}
      {authCtx.isAuthenticated && <AuthenticatedStack />}
    </NavigationContainer>
  );
}

function Root({ onLayoutRootView }) {
  const [isTryingLogin, setisTryingLogin] = useState(true);
  const authCtx = useContext(AuthContext);

  useEffect(() => {
    async function fetchToken() {
      const storedToken = await AsyncStorage.getItem("token");

      if (storedToken) {
        authCtx.authenticate(storedToken);
      }

      setisTryingLogin(false);
    }
    fetchToken();
  }, []);

  if (isTryingLogin) {
    return (
      <View>
        <Text>wadaw</Text>
      </View>
    );
  }

  return <Navigation onLayoutRootView={onLayoutRootView} />;
}

export default function NavigationComponent() {
  const [dbInitialized, setDbInitialized] = useState(false);
  useEffect(() => {
    const prepare = async () => {
      try {
        await SplashScreen.preventAutoHideAsync();
        init();
      } catch (e) {
        console.warn(e);
      } finally {
        setDbInitialized(true);
      }
    };
    prepare();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (dbInitialized) {
      await SplashScreen.hideAsync();
    }
  }, [dbInitialized]);

  if (!dbInitialized) return null;
  return (
    <>
      <StatusBar style="light" />
      <AuthContentProvider>
        <Root onLayoutRootView={onLayoutRootView} />
      </AuthContentProvider>
    </>
  );
}
