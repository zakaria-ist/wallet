/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useEffect } from 'react';
import { StatusBar, BackHandler } from "react-native";
import { enableScreens } from 'react-native-screens';
import { NavigationContainer } from "@react-navigation/native";
import {createStackNavigator} from '@react-navigation/stack';
import BackdropProvider from "@mgcrea/react-native-backdrop-provider";
import Navigator from "./app/Routes/LoginStack";
import CustomAlert from "./app/lib/alert";
import DrawerStack from "./app/Routes/DrawerStack";
import LoginScreen from "./app/Screens/LoginScreen";
import SplashOut from "./app/Screens/SplashOut";

const alert = new CustomAlert();
const Stack = createStackNavigator();

const Auth = () => {
  // Stack Navigator for Login Screen
  return (
    <Stack.Navigator initialRouteName="LoginScreen">
      <Stack.Screen
        name="LoginScreen"
        component={LoginScreen}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
};

const App = () => {
    enableScreens();

    // handle back button action
    const backAction = () => {
      alert.ask("Are you sure you want to exit from app?", ()=> {
        BackHandler.exitApp()
      });
      return true;
    };

    useEffect(() => {
      BackHandler.addEventListener("hardwareBackPress", backAction);
      return () =>
        BackHandler.removeEventListener("hardwareBackPress", backAction);
    }, []);

    return (
      <BackdropProvider>
        <StatusBar barStyle="default" />
        <NavigationContainer>
        {/* <DrawerStack/> */}
          <Stack.Navigator 
            initialRouteName="SplashOut"
          >
            {/* SplashScreen which will come once for 5 Seconds */}
            <Stack.Screen
              name="SplashOut"
              component={SplashOut}
              options={{headerShown: false}}
            />
            {/* Auth Navigator: Include Login and Signup */}
            <Stack.Screen
              name="Auth"
              component={Auth}
              options={{headerShown: false}}
            />
            {/* Navigation Drawer as a landing page */}
            <Stack.Screen
              name="DrawerStack"
              component={DrawerStack}
              options={{headerShown: false}}
            />
          </Stack.Navigator>
        </NavigationContainer>
        {/* <Navigator /> */}
      </BackdropProvider>
    );
};


export default App;
