import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Feather from 'react-native-vector-icons/Feather';
import AsyncStorage from "@react-native-community/async-storage";
import LoginScreen from "../Screens/LoginScreen";
import CreateMessage from "../Screens/CreateMessage";
import Deposit from "../Screens/Deposit";
import Withdrawal from "../Screens/Withdrawal";
import SummaryReport from "../Screens/SummaryReport";
import TodaysReport from "../Screens/TodaysReport";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();
// class CustomTabButton extends React.Component {
//   render() {
//     const {
//       onPress,
//       onLongPress,
//       show,
//       accessibilityLabel,
//       ...props
//     } = this.props;

//     if (!show) return null;

//     return (
//       <TouchableOpacity
//         onPress={onPress}
//         onLongPress={onLongPress}
//         hitSlop={{ left: 15, right: 15, top: 5, bottom: 5 }}
//         accessibilityLabel={accessibilityLabel}
//       >
//         <View {...props} />
//       </TouchableOpacity>
//     );
//   }
// }
const screenOptionStyle = {
  headerStyle: {
    backgroundColor: "#9AC4F8",
  },
  tabBarActiveTintColor: '#e91e63',
  tabBarInactiveTintColor: 'gray',
  headerShown: false,
};

function NavigationAdmin(props) {
  if (!props?.route) return null;
  
  return (
    <Tab.Navigator
      initialRouteName="HomeAdmin"
      screenOptions={screenOptionStyle}
      backBehavior="history"
    >
      <Tab.Screen
        name="SummaryReport"
        component={SummaryReport}
        options={{
          // tabBarButton: (props) => <CustomTabButton show={true} {...props} />,
          tabBarLabel: "Summary Report",
          tabBarIcon: ({ color, size }) => <Feather name="file-text" color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="Deposit"
        component={Deposit}
        options={{
          tabBarLabel: "Deposit",
          tabBarIcon: ({ color, size }) => <Feather name="download" color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="Withdrawal"
        component={Withdrawal}
        options={{
          tabBarLabel: "Withdrawal",
          tabBarIcon: ({ color, size }) => <Feather name="upload" color={color} size={size} />,
        }}
      />
    </Tab.Navigator>
  );
}

function NavigationUser(props) {
  if (!props?.route) return null;
  
  return (
    <Tab.Navigator
      initialRouteName="HomeUser"
      screenOptions={screenOptionStyle}
      backBehavior="history"
    >
      <Tab.Screen
        name="CreateMessage"
        component={CreateMessage}
        options={{
          tabBarLabel: "Create Message",
          tabBarIcon: ({ color, size }) => <Feather name="file-plus" color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="Deposit"
        component={Deposit}
        options={{
          tabBarLabel: "Deposit",
          tabBarIcon: ({ color, size }) => <Feather name="download" color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="Withdrawal"
        component={Withdrawal}
        options={{
          tabBarLabel: "Withdrawal",
          tabBarIcon: ({ color, size }) => <Feather name="upload" color={color} size={size} />,
        }}
      />
    </Tab.Navigator>
  );
}

function NavigationAgent(props) {
  if (!props?.route) return null;
  
  return (
    <Tab.Navigator
      initialRouteName="HomeAgent"
      screenOptions={screenOptionStyle}
      backBehavior="history"
    >
      <Tab.Screen
        name="TodaysReport"
        component={TodaysReport}
        options={{
          tabBarLabel: "Today's Report",
          tabBarIcon: ({ color, size }) => <Feather name="file-text" color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="Deposit"
        component={Deposit}
        options={{
          tabBarLabel: "Deposit",
          tabBarIcon: ({ color, size }) => <Feather name="download" color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="Withdrawal"
        component={Withdrawal}
        options={{
          tabBarLabel: "Withdrawal",
          tabBarIcon: ({ color, size }) => <Feather name="upload" color={color} size={size} />,
        }}
      />
    </Tab.Navigator>
  );
}

function NavigationGroup(props) {
  if (!props?.route) return null;
  
  return (
    <Tab.Navigator
      initialRouteName="HomeGroup"
      screenOptions={screenOptionStyle}
      backBehavior="history"
    >
      <Tab.Screen
        name="Deposit"
        component={Deposit}
        options={{
          tabBarLabel: "Deposit",
          tabBarIcon: ({ color, size }) => <Feather name="download" color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="Withdrawal"
        component={Withdrawal}
        options={{
          tabBarLabel: "Withdrawal",
          tabBarIcon: ({ color, size }) => <Feather name="upload" color={color} size={size} />,
        }}
      />
    </Tab.Navigator>
  );
}
let signedIn = true;
let authType = 'admin';

export default function LoginStack() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        {/* <Stack.Screen name="LoginScreen" component={LoginScreen} />
        <Stack.Screen name="CreateMessage" component={CreateMessage} />
        <Stack.Screen name="Deposit" component={Deposit} />
        <Stack.Screen name="Withdrawal" component={Withdrawal} />
        <Stack.Screen name="SummaryReport" component={SummaryReport} />
        <Stack.Screen name="TodaysReport" component={TodaysReport} /> */}
        {!signedIn ? (
          <Stack.Screen name="LoginScreen" component={LoginScreen} />
        ) : (
          <>
            {authType == 'admin' ? (
              <Stack.Screen name="HomeAdmin" component={NavigationAdmin} />
            ) : (
              [authType == 'user' ? (
                <Stack.Screen name="HomeUser" component={NavigationUser} />
              ) : (
                [authType == 'group' ? (
                  <Stack.Screen name="HomeGroup" component={NavigationGroup} />
                ) : (
                  [authType == 'agent' ? (
                    <Stack.Screen name="HomeAgent" component={NavigationAgent} />
                  ) : (
                    <></>
                  )]
                )]
              )]
            )}
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
