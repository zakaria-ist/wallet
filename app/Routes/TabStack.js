import React, { useEffect } from "react";
import { Button } from 'react-native-elements';
import {StyleSheet, DeviceEventEmitter} from 'react-native';
import { useStateIfMounted } from "use-state-if-mounted";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Feather from 'react-native-vector-icons/Feather';
import { RFValue } from "react-native-responsive-fontsize";
import CreateMessage from "../Screens/CreateMessage";
import Deposit from "../Screens/Deposit";
import Withdrawal from "../Screens/Withdrawal";
import SummaryReport from "../Screens/SummaryReport";
import TodaysReport from "../Screens/TodaysReport";
import { WalletColors } from "../assets/Colors.js";
import {heightPercentageToDP} from "react-native-responsive-screen";
import AsyncStorage from "@react-native-community/async-storage";
import Request from "../lib/request";
import GLOBAL from "../lib/globals";

const request = new Request();

const getBadgeCount = async () => {
  const msgsUrl = request.getAllMessageUrl();
  const authToken = await AsyncStorage.getItem('token');
  const authType = await AsyncStorage.getItem('authType');
  const when = 'today';
  if (authType == 'agent') {
    const params = JSON.stringify(
      {
        token: authToken, 
        role: authType,
        purpose: 'any',
        when: 'today'
      }
    );
    const content = await request.post(msgsUrl, params);
    if (content.ok) {
      let myUserName = content.myUsername;
      let messages = [];
      messages = content.msg.filter((msg) => {
        return msg.toagent == myUserName;
      })
      let depositBadgeCount = 0;
      let withdrawalBadgeCount = 0;
      if (authType == 'agent' && when == 'today') {
        messages.map((msg) => {
          if (msg.purpose == "deposit" && msg.statusId == 0) {
            depositBadgeCount++;
          }
          if(msg.purpose == "withdrawal" && (msg.statusId == 0 || msg.statusId == 11)) {
            withdrawalBadgeCount++;
          }
        })
        GLOBAL.depositBadgeCount = depositBadgeCount;
        GLOBAL.withdrawalBadgeCount = withdrawalBadgeCount;
        DeviceEventEmitter.emit('updateBadgeCount',  {depositBadgeCount:GLOBAL.depositBadgeCount, withdrawalBadgeCount: GLOBAL.withdrawalBadgeCount})
      }
    }
  }
}

const Tab = createBottomTabNavigator();

const screenOptionStyle = {
  headerStyle: {
    backgroundColor: WalletColors.white,
  },
  headerTitleStyle: {
    fontWeight: 'bold',
    color: WalletColors.Wblue,
  },
  tabBarStyle: {
    height: heightPercentageToDP("6.5%")
  },
  tabBarShowLabel: false,
  headerTitleAlign: 'center',
  tabBarActiveTintColor: WalletColors.Wblue,
  tabBarInactiveTintColor: 'gray',
  headerLeft: () => (
    <Button 
      onPress={() => {}}  
      icon={<Feather name="menu" color="black" size={RFValue(28)} />}
      buttonStyle={{borderBottomWidth: StyleSheet.hairlineWidth,backgroundColor: "white", marginLeft: 10}}
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
          tabBarLabel: "Summary Report",
          tabBarIcon: ({ color, size }) => <Feather name="file-text" color={color} size={size}/>,
        }}
      />
      <Tab.Screen
        name="Deposit"
        component={Deposit}
        options={{
         tabBarLabel: "Deposit",
          tabBarIcon: ({ color, size }) => <Feather name="download" color={color} size={size} />,
        }}
        listeners={({ navigation})=>({
          tabPress: (e) => {
            // Prevent default action
            e.preventDefault();
            // navigation.navigate("TabNavigationAdminDeposit");
            navigation.reset({
              index: 0,
              key: null,
              routes: [{ name: "TabNavigationAdminDeposit" }],
            });
          },
        })}
      />
      <Tab.Screen
        name="Withdrawal"
        component={Withdrawal}
        options={{
          tabBarLabel: "Withdrawal",
          tabBarIcon: ({ color, size }) => <Feather name="upload" color={color} size={size} />,
        }}
        listeners={({ navigation})=>({
          tabPress: (e) => {
            e.preventDefault();
            // navigation.navigate("TabNavigationAdminWithdrawal");
            navigation.reset({
              index: 0,
              key: null,
              routes: [{ name: "TabNavigationAdminWithdrawal" }],
            });
          },
        })}
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
          tabBarLabel: "Summary Report",
          tabBarIcon: ({ color, size }) => <Feather name="file-text" color={color} size={size} />,
        }}
        listeners={({ navigation})=>({
          tabPress: (e) => {
            e.preventDefault();
            // navigation.navigate("TabNavigationAdmin");
            navigation.reset({
              index: 0,
              key: null,
              routes: [{ name: "TabNavigationAdmin" }],
            });
          },
        })}
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
        listeners={({ navigation})=>({
          tabPress: (e) => {
            e.preventDefault();
            // navigation.navigate("TabNavigationAdminWithdrawal");
            navigation.reset({
              index: 0,
              key: null,
              routes: [{ name: "TabNavigationAdminWithdrawal" }],
            });
          },
        })}
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
          tabBarLabel: "Summary Report",
          tabBarIcon: ({ color, size }) => <Feather name="file-text" color={color} size={size} />,
        }}
        listeners={({ navigation})=>({
          tabPress: (e) => {
            e.preventDefault();
            // navigation.navigate("TabNavigationAdmin");
            navigation.reset({
              index: 0,
              key: null,
              routes: [{ name: "TabNavigationAdmin" }],
            });
          },
        })}
      />
      <Tab.Screen
        name="Deposit"
        component={Deposit}
        options={{
          tabBarLabel: "Deposit",
          tabBarIcon: ({ color, size }) => <Feather name="download" color={color} size={size} />,
        }}
        listeners={({ navigation})=>({
          tabPress: (e) => {
            e.preventDefault();
            // navigation.navigate("TabNavigationAdminDeposit");
            navigation.reset({
              index: 0,
              key: null,
              routes: [{ name: "TabNavigationAdminDeposit" }],
            });
          },
        })}
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
        listeners={({ navigation})=>({
          tabPress: (e) => {
            e.preventDefault();
            // navigation.navigate("TabNavigationUserDeposit");
            navigation.reset({
              index: 0,
              key: null,
              routes: [{ name: "TabNavigationUserDeposit" }],
            });
          },
        })}
      />
      <Tab.Screen
        name="Withdrawal"
        component={Withdrawal}
        options={{
          tabBarLabel: "Withdrawal",
          tabBarIcon: ({ color, size }) => <Feather name="upload" color={color} size={size} />,
        }}
        listeners={({ navigation})=>({
          tabPress: (e) => {
            e.preventDefault();
            // navigation.navigate("TabNavigationUserWithdrawal");
            navigation.reset({
              index: 0,
              key: null,
              routes: [{ name: "TabNavigationUserWithdrawal" }],
            });
          },
        })}
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
          tabBarLabel: "Create Message",
          tabBarIcon: ({ color, size }) => <Feather name="file-plus" color={color} size={size} />,
        }}
        listeners={({ navigation})=>({
          tabPress: (e) => {
            e.preventDefault();
            // navigation.navigate("TabNavigationUser");
            navigation.reset({
              index: 0,
              key: null,
              routes: [{ name: "TabNavigationUser" }],
            });
          },
        })}
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
        listeners={({ navigation})=>({
          tabPress: (e) => {
            e.preventDefault();
            // navigation.navigate("TabNavigationUserWithdrawal");
            navigation.reset({
              index: 0,
              key: null,
              routes: [{ name: "TabNavigationUserWithdrawal" }],
            });
          },
        })}
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
          tabBarLabel: "Create Message",
          tabBarIcon: ({ color, size }) => <Feather name="file-plus" color={color} size={size} />,
        }}
        listeners={({ navigation})=>({
          tabPress: (e) => {
            e.preventDefault();
            // navigation.navigate("TabNavigationUser");
            navigation.reset({
              index: 0,
              key: null,
              routes: [{ name: "TabNavigationUser" }],
            });
          },
        })}
      />
      <Tab.Screen
        name="Deposit"
        component={Deposit}
        options={{
          tabBarLabel: "Deposit",
          tabBarIcon: ({ color, size }) => <Feather name="download" color={color} size={size} />,
        }}
        listeners={({ navigation})=>({
          tabPress: (e) => {
            e.preventDefault();
            // navigation.navigate("TabNavigationUserDeposit");
            navigation.reset({
              index: 0,
              key: null,
              routes: [{ name: "TabNavigationUserDeposit" }],
            });
          },
        })}
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

const TabNavigationAgent = (props) => {
  if (!props?.route) return null;
  // get new badge count
  getBadgeCount();

  const [depositBadgeCount, setDepositBadgeCount] = useStateIfMounted(GLOBAL.depositBadgeCount);
  const [withdrawalBadgeCount, setWithdrawalBadgeCount] = useStateIfMounted(GLOBAL.withdrawalBadgeCount);
  
  const handleBadgeCount = (value) => {
    setDepositBadgeCount(value.depositBadgeCount);
    setWithdrawalBadgeCount(value.withdrawalBadgeCount);
  };

  useEffect(() => {
    const listener = DeviceEventEmitter.addListener("updateBadgeCount", handleBadgeCount);
    return () =>
      listener.remove();
  }, []);
  
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
          tabBarBadge: depositBadgeCount
        }}
        listeners={({ navigation})=>({
          tabPress: (e) => {
            e.preventDefault();
            // navigation.navigate("TabNavigationAgentDeposit");
            navigation.reset({
              index: 0,
              key: null,
              routes: [{ name: "TabNavigationAgentDeposit" }],
            });
          },
        })}
      />
      <Tab.Screen
        name="Withdrawal"
        component={Withdrawal}
        options={{
          tabBarLabel: "Withdrawal",
          tabBarIcon: ({ color, size }) => <Feather name="upload" color={color} size={size} />,
          tabBarBadge: withdrawalBadgeCount
        }}
        listeners={({ navigation})=>({
          tabPress: (e) => {
            e.preventDefault();
            // navigation.navigate("TabNavigationAgentWithdrawal");
            navigation.reset({
              index: 0,
              key: null,
              routes: [{ name: "TabNavigationAgentWithdrawal" }],
            });
          },
        })}
      />
    </Tab.Navigator>
  );
}
const TabNavigationAgentDeposit = (props) => {
  if (!props?.route) return null;
  // get new badge count
  getBadgeCount();

  const [depositBadgeCount, setDepositBadgeCount] = useStateIfMounted(GLOBAL.depositBadgeCount);
  const [withdrawalBadgeCount, setWithdrawalBadgeCount] = useStateIfMounted(GLOBAL.withdrawalBadgeCount);
  
  const handleBadgeCount = (value) => {
    setDepositBadgeCount(value.depositBadgeCount);
    setWithdrawalBadgeCount(value.withdrawalBadgeCount);
  };

  useEffect(() => {
    const listener = DeviceEventEmitter.addListener("updateBadgeCount", handleBadgeCount);
    return () =>
      listener.remove();
  }, []);
  
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
          tabBarLabel: "Today's Report",
          tabBarIcon: ({ color, size }) => <Feather name="file-text" color={color} size={size} />,
        }}
        listeners={({ navigation})=>({
          tabPress: (e) => {
            e.preventDefault();
            // navigation.navigate("TabNavigationAgent");
            navigation.reset({
              index: 0,
              key: null,
              routes: [{ name: "TabNavigationAgent" }],
            });
          },
        })}
      />
      <Tab.Screen
        name="Deposit"
        component={Deposit}
        options={{
          tabBarLabel: "Deposit",
          tabBarIcon: ({ color, size }) => <Feather name="download" color={color} size={size} />,
          tabBarBadge: depositBadgeCount
        }}
      />
      <Tab.Screen
        name="Withdrawal"
        component={Withdrawal}
        options={{
          tabBarLabel: "Withdrawal",
          tabBarIcon: ({ color, size }) => <Feather name="upload" color={color} size={size} />,
          tabBarBadge: withdrawalBadgeCount
        }}
        listeners={({ navigation})=>({
          tabPress: (e) => {
            e.preventDefault();
            // navigation.navigate("TabNavigationAgentWithdrawal");
            navigation.reset({
              index: 0,
              key: null,
              routes: [{ name: "TabNavigationAgentWithdrawal" }],
            });
          },
        })}
      />
    </Tab.Navigator>
  );
}
const TabNavigationAgentWithdrawal = (props) => {
  if (!props?.route) return null;
  // get new badge count
  getBadgeCount();

  const [depositBadgeCount, setDepositBadgeCount] = useStateIfMounted(GLOBAL.depositBadgeCount);
  const [withdrawalBadgeCount, setWithdrawalBadgeCount] = useStateIfMounted(GLOBAL.withdrawalBadgeCount);

  const handleBadgeCount = (value) => {
    setDepositBadgeCount(value.depositBadgeCount);
    setWithdrawalBadgeCount(value.withdrawalBadgeCount);
  };

  useEffect(() => {
    const listener = DeviceEventEmitter.addListener("updateBadgeCount", handleBadgeCount);
    return () =>
      listener.remove();
  }, []);
  
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
          tabBarLabel: "Today's Report",
          tabBarIcon: ({ color, size }) => <Feather name="file-text" color={color} size={size} />,
        }}
        listeners={({ navigation})=>({
          tabPress: (e) => {
            e.preventDefault();
            // navigation.navigate("TabNavigationAgent");
            navigation.reset({
              index: 0,
              key: null,
              routes: [{ name: "TabNavigationAgent" }],
            });
          },
        })}
      />
      <Tab.Screen
        name="Deposit"
        component={Deposit}
        options={{
          tabBarLabel: "Deposit",
          tabBarIcon: ({ color, size }) => <Feather name="download" color={color} size={size} />,
          tabBarBadge: depositBadgeCount
        }}
        listeners={({ navigation})=>({
          tabPress: (e) => {
            e.preventDefault();
            // navigation.navigate("TabNavigationAgentDeposit");
            navigation.reset({
              index: 0,
              key: null,
              routes: [{ name: "TabNavigationAgentDeposit" }],
            });
          },
        })}
      />
      <Tab.Screen
        name="Withdrawal"
        component={Withdrawal}
        options={{
          tabBarLabel: "Withdrawal",
          tabBarIcon: ({ color, size }) => <Feather name="upload" color={color} size={size} />,
          tabBarBadge: withdrawalBadgeCount
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
        listeners={({ navigation})=>({
          tabPress: (e) => {
            e.preventDefault();
            // navigation.navigate("TabNavigationGroupWithdrawal");
            navigation.reset({
              index: 0,
              key: null,
              routes: [{ name: "TabNavigationGroupWithdrawal" }],
            });
          },
        })}
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
          tabBarLabel: "Deposit",
          tabBarIcon: ({ color, size }) => <Feather name="download" color={color} size={size} />,
        }}
        listeners={({ navigation})=>({
          tabPress: (e) => {
            e.preventDefault();
            // navigation.navigate("TabNavigationGroup");
            navigation.reset({
              index: 0,
              key: null,
              routes: [{ name: "TabNavigationGroup" }],
            });
          },
        })}
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

export { TabNavigationAdmin, TabNavigationAdminDeposit, TabNavigationAdminWithdrawal,
         TabNavigationUser, TabNavigationUserDeposit, TabNavigationUserWithdrawal,
         TabNavigationAgent, TabNavigationAgentDeposit, TabNavigationAgentWithdrawal,
         TabNavigationGroup, TabNavigationGroupWithdrawal 
       };
