import React from "react";
import { Button } from 'react-native-elements';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Feather from 'react-native-vector-icons/Feather';
import { RFValue } from "react-native-responsive-fontsize";

import CreateMessage from "../Screens/CreateMessage";
import Deposit from "../Screens/Deposit";
import Withdrawal from "../Screens/Withdrawal";
import SummaryReport from "../Screens/SummaryReport";
import TodaysReport from "../Screens/TodaysReport";
import { WalletColors } from "../assets/Colors.js";
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";

import { Dimensions , StatusBar } from 'react-native';
import Screensize from '../lib/screensize.js';

const screensize = new Screensize();
const Tab = createBottomTabNavigator();

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
    backgroundColor: WalletColors.white,
  },
  headerTitleStyle: {
    fontWeight: 'bold',
    color: WalletColors.Wblue,
  },
  tabBarStyle: {
    height: (screensize.getLargeScreen() ? (StatusBar.currentHeight - heightPercentageToDP("2%")) : (StatusBar.currentHeight + heightPercentageToDP("2%")))
  },
  tabBarLabelStyle: {height:0},
  headerTitleAlign: 'center',
  tabBarActiveTintColor: WalletColors.Wblue,
  tabBarInactiveTintColor: 'gray',
  headerLeft: () => (
      <Button 
        onPress={() => {}}  
        icon={<Feather name="menu" color="black" size={RFValue(28)} />}
        buttonStyle={{backgroundColor: "white", marginLeft: 10}}
      />
    ),
  headerShown: false,
};

const TabNavigationAdmin = (props) => {
  if (!props?.route) return null;
  
  return (
    <Tab.Navigator
      initialRouteName="SummaryReport"
      screenOptions={screenOptionStyle}
      backBehavior="history"
    >
      <Tab.Screen
        name="SummaryReport"
        component={SummaryReport}
        options={{
          //tabBarLabel: "Summary Report",
          tabBarIcon: ({ color, size }) => <Feather name="file-text" color={color} size={size}/>,
        }}
      />
      <Tab.Screen
        name="Deposit"
        component={Deposit}
        options={{
         // tabBarLabel: "Deposit",
          tabBarIcon: ({ color, size }) => <Feather name="download" color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="Withdrawal"
        component={Withdrawal}
        options={{
          //tabBarLabel: "Withdrawal",
          tabBarIcon: ({ color, size }) => <Feather name="upload" color={color} size={size} />,
        }}
      />
    </Tab.Navigator>
  );
}
const TabNavigationAdminDeposit = (props) => {
  if (!props?.route) return null;
  
  return (
    <Tab.Navigator
      initialRouteName="Deposit"
      screenOptions={screenOptionStyle}
      backBehavior="history"
    >
      <Tab.Screen
        name="SummaryReport"
        component={SummaryReport}
        options={{
         // tabBarLabel: "Summary Report",
          tabBarIcon: ({ color, size }) => <Feather name="file-text" color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="Deposit"
        component={Deposit}
        options={{
        //  tabBarLabel: "Deposit",
          tabBarIcon: ({ color, size }) => <Feather name="download" color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="Withdrawal"
        component={Withdrawal}
        options={{
        //  tabBarLabel: "Withdrawal",
          tabBarIcon: ({ color, size }) => <Feather name="upload" color={color} size={size} />,
        }}
      />
    </Tab.Navigator>
  );
}
const TabNavigationAdminWithdrawal = (props) => {
  if (!props?.route) return null;
  
  return (
    <Tab.Navigator
      initialRouteName="Withdrawal"
      screenOptions={screenOptionStyle}
      backBehavior="history"
    >
      <Tab.Screen
        name="SummaryReport"
        component={SummaryReport}
        options={{
        //  tabBarLabel: "Summary Report",
          tabBarIcon: ({ color, size }) => <Feather name="file-text" color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="Deposit"
        component={Deposit}
        options={{
         // tabBarLabel: "Deposit",
          tabBarIcon: ({ color, size }) => <Feather name="download" color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="Withdrawal"
        component={Withdrawal}
        options={{
         // tabBarLabel: "Withdrawal",
          tabBarIcon: ({ color, size }) => <Feather name="upload" color={color} size={size} />,
        }}
      />
    </Tab.Navigator>
  );
}

const TabNavigationUser = (props) => {
  if (!props?.route) return null;
  
  return (
    <Tab.Navigator
      initialRouteName="CreateMessage"
      screenOptions={screenOptionStyle}
      backBehavior="history"
    >
      <Tab.Screen
        name="CreateMessage"
        component={CreateMessage}
        options={{
        //  tabBarLabel: "Create Message",
          tabBarIcon: ({ color, size }) => <Feather name="file-plus" color={color} size={size} />,
        //  title: 'Create Message'
        }}
      />
      <Tab.Screen
        name="Deposit"
        component={Deposit}
        options={{
         // tabBarLabel: "Deposit",
          tabBarIcon: ({ color, size }) => <Feather name="download" color={color} size={size} />,
         // title: 'Deposit'
        }}
      />
      <Tab.Screen
        name="Withdrawal"
        component={Withdrawal}
        options={{
          //tabBarLabel: "Withdrawal",
          tabBarIcon: ({ color, size }) => <Feather name="upload" color={color} size={size} />,
         // title: 'Withdrawal'
        }}
      />
    </Tab.Navigator>
  );
}
const TabNavigationUserDeposit = (props) => {
  if (!props?.route) return null;
  
  return (
    <Tab.Navigator
      initialRouteName="Deposit"
      screenOptions={screenOptionStyle}
      backBehavior="history"
    >
      <Tab.Screen
        name="CreateMessage"
        component={CreateMessage}
        options={{
          tabBarLabel: "",
         // tabBarLabel: "Create Message",
          tabBarIcon: ({ color, size }) => <Feather name="file-plus" color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="Deposit"
        component={Deposit}
        options={{
        //  tabBarLabel: "Deposit",
          tabBarIcon: ({ color, size }) => <Feather name="download" color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="Withdrawal"
        component={Withdrawal}
        options={{
       //   tabBarLabel: "Withdrawal",
          tabBarIcon: ({ color, size }) => <Feather name="upload" color={color} size={size} />,
        }}
      />
    </Tab.Navigator>
  );
}
const TabNavigationUserWithdrawal = (props) => {
  if (!props?.route) return null;
  
  return (
    <Tab.Navigator
      initialRouteName="Withdrawal"
      screenOptions={screenOptionStyle}
      backBehavior="history"
    >
      <Tab.Screen
        name="CreateMessage"
        component={CreateMessage}
        options={{
        //  tabBarLabel: "Create Message",
          tabBarIcon: ({ color, size }) => <Feather name="file-plus" color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="Deposit"
        component={Deposit}
        options={{
        //  tabBarLabel: "Deposit",
          tabBarIcon: ({ color, size }) => <Feather name="download" color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="Withdrawal"
        component={Withdrawal}
        options={{
        //  tabBarLabel: "Withdrawal",
          tabBarIcon: ({ color, size }) => <Feather name="upload" color={color} size={size} />,
        }}
      />
    </Tab.Navigator>
  );
}

const TabNavigationAgent = (props) => {
  if (!props?.route) return null;
  
  return (
    <Tab.Navigator
      initialRouteName="TodaysReport"
      screenOptions={screenOptionStyle}
      backBehavior="history"
    >
      <Tab.Screen
        name="TodaysReport"
        component={TodaysReport}
        options={{
         // tabBarLabel: "Today's Report",
          tabBarIcon: ({ color, size }) => <Feather name="file-text" color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="Deposit"
        component={Deposit}
        options={{
         // tabBarLabel: "Deposit",
          tabBarIcon: ({ color, size }) => <Feather name="download" color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="Withdrawal"
        component={Withdrawal}
        options={{
        //  tabBarLabel: "Withdrawal",
          tabBarIcon: ({ color, size }) => <Feather name="upload" color={color} size={size} />,
        }}
      />
    </Tab.Navigator>
  );
}
const TabNavigationAgentDeposit = (props) => {
  if (!props?.route) return null;
  
  return (
    <Tab.Navigator
      initialRouteName="Deposit"
      screenOptions={screenOptionStyle}
      backBehavior="history"
    >
      <Tab.Screen
        name="TodaysReport"
        component={TodaysReport}
        options={{
        //  tabBarLabel: "Today's Report",
          tabBarIcon: ({ color, size }) => <Feather name="file-text" color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="Deposit"
        component={Deposit}
        options={{
        //  tabBarLabel: "Deposit",
          tabBarIcon: ({ color, size }) => <Feather name="download" color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="Withdrawal"
        component={Withdrawal}
        options={{
        //  tabBarLabel: "Withdrawal",
          tabBarIcon: ({ color, size }) => <Feather name="upload" color={color} size={size} />,
        }}
      />
    </Tab.Navigator>
  );
}
const TabNavigationAgentWithdrawal = (props) => {
  if (!props?.route) return null;
  
  return (
    <Tab.Navigator
      initialRouteName="Withdrawal"
      screenOptions={screenOptionStyle}
      backBehavior="history"
    >
      <Tab.Screen
        name="TodaysReport"
        component={TodaysReport}
        options={{
        //  tabBarLabel: "Today's Report",
          tabBarIcon: ({ color, size }) => <Feather name="file-text" color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="Deposit"
        component={Deposit}
        options={{
        //  tabBarLabel: "Deposit",
          tabBarIcon: ({ color, size }) => <Feather name="download" color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="Withdrawal"
        component={Withdrawal}
        options={{
         // tabBarLabel: "Withdrawal",
          tabBarIcon: ({ color, size }) => <Feather name="upload" color={color} size={size} />,
        }}
      />
    </Tab.Navigator>
  );
}

const TabNavigationGroup = (props) => {
  if (!props?.route) return null;
  
  return (
    <Tab.Navigator
      initialRouteName="Deposit"
      screenOptions={screenOptionStyle}
      backBehavior="history"
    >
      <Tab.Screen
        name="Deposit"
        component={Deposit}
        options={{
        //  tabBarLabel: "Deposit",
          tabBarIcon: ({ color, size }) => <Feather name="download" color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="Withdrawal"
        component={Withdrawal}
        options={{
        //  tabBarLabel: "Withdrawal",
          tabBarIcon: ({ color, size }) => <Feather name="upload" color={color} size={size} />,
        }}
      />
    </Tab.Navigator>
  );
}
const TabNavigationGroupWithdrawal = (props) => {
  if (!props?.route) return null;
  
  return (
    <Tab.Navigator
      initialRouteName="Withdrawal"
      screenOptions={screenOptionStyle}
      backBehavior="history"
    >
      <Tab.Screen
        name="Deposit"
        component={Deposit}
        options={{
         // tabBarLabel: "Deposit",
          tabBarIcon: ({ color, size }) => <Feather name="download" color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="Withdrawal"
        component={Withdrawal}
        options={{
         // tabBarLabel: "Withdrawal",
          tabBarIcon: ({ color, size }) => <Feather name="upload" color={color} size={size} />,
        }}
      />
    </Tab.Navigator>
  );
}

export { TabNavigationAdmin, TabNavigationAdminDeposit, TabNavigationAdminWithdrawal,
         TabNavigationUser, TabNavigationUserDeposit, TabNavigationUserWithdrawal,
         TabNavigationAgent, TabNavigationAgentDeposit, TabNavigationAgentWithdrawal,
         TabNavigationGroup, TabNavigationGroupWithdrawal 
       };
