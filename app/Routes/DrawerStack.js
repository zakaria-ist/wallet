import React, {useState, useEffect} from "react";
import { Text, Image, View} from 'react-native';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem
} from '@react-navigation/drawer';
import DeviceInfo from 'react-native-device-info';
import {RFValue} from "react-native-responsive-fontsize";
import {widthPercentageToDP} from "react-native-responsive-screen";
import Feather from 'react-native-vector-icons/Feather';
import AntDesign from 'react-native-vector-icons/AntDesign';
import AsyncStorage from "@react-native-community/async-storage";
import CustomAlert from "../lib/alert";
import { 
  TabNavigationAdmin, 
  TabNavigationAdminDeposit, 
  TabNavigationAdminWithdrawal,
  TabNavigationUser, 
  TabNavigationUserDeposit, 
  TabNavigationUserWithdrawal,
  TabNavigationAgent, 
  TabNavigationAgentDeposit, 
  TabNavigationAgentWithdrawal,
  TabNavigationGroup, 
  TabNavigationGroupWithdrawal} from "./TabStack";
import styles from "../lib/global_css";

const Drawer = createDrawerNavigator();
const alert = new CustomAlert();

const DrawerStack = () => {
  const [authType, setAuthType] = useState("");
  const [userName, setUserName] = useState("Username");
  const [appVersion, setAppVersion] = useState("");
  const [isUser, setIsUser] = useState(false);
  // const [initRender, setInitRender] = useState(true);

  const CustomDrawerContent = (props) => {
    return (
      <DrawerContentScrollView {...props}>
        <View style={styles.drawercontainer}> 
          <View style={styles.drawerHeader}> 
            <Text style={styles.version}>Version: {appVersion}</Text>
            <View style={{ flexDirection: 'column'} }> 
              <Text style={styles.version}></Text>
              <Image
                style={styles.drawerImage}
                source={require('../assets/icons/user.png')} />
              <Text style={styles.userName}>{userName}</Text>
            </View>   
          </View>   
        </View>
        <DrawerItemList {...props} />
        <DrawerItem
          style={styles.drawerItem}
          label="Sign Out"
          labelStyle={{fontSize: RFValue(15)}}
          icon={({ color, size }) => <AntDesign name="logout" color={color} size={size} />}
          onPress={() => {
            alert.ask('Are you sure? You want to sign out?', ()=>{
              AsyncStorage.clear();
              // props.navigation.replace('Auth');
              props.navigation.reset({
                index: 0,
                key: null,
                routes: [{ name: "Auth" }],
              });
            })
          }}
        />
      </DrawerContentScrollView>
    );
  }

  // useEffect(() => {
  //   setInitRender(false);
  // }, [initRender]);
  
  useEffect(() => {
    AsyncStorage.getItem('isUser').then((value) => {
      if (value) {
        setIsUser(true);
      }
    });
    AsyncStorage.getItem('authType').then((value) => {
      setAuthType(value);
    })
    AsyncStorage.getItem('username').then((value) => {
      setUserName(value);
    })

    setAppVersion(DeviceInfo.getVersion());
  }, []);

  const showDrawer = false;
  
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      style={styles.drawerItem}
      screenOptions={{
          headerShown: false,
          drawerType: 'back',
          unmountOnBlur: true,
          drawerStyle: {width: !showDrawer ? null : widthPercentageToDP("70%")},
          // drawerStyle: {width: initRender ? null : widthPercentageToDP("70%")},
          drawerItemStyle: styles.drawerItem,
          drawerLabelStyle:{fontSize: RFValue(15)},
      }}
    >
      {(authType == 'admin' || authType == 'subadmin') ? (
        <>
          <Drawer.Screen name="TabNavigationAdmin" component={TabNavigationAdmin} key={TabNavigationAdmin}
            options={{
              title: "Summary Report",
              drawerIcon: ({ color, size }) => <Feather name="file-text" color={color} size={size}/>,
            }} 
          />
          <Drawer.Screen name="TabNavigationAdminDeposit" component={TabNavigationAdminDeposit} key={TabNavigationAdminDeposit}
            options={{
              title: "Deposit",
              drawerIcon: ({ color, size }) => <Feather name="download" color={color} size={size} />,
            }} 
          />
          <Drawer.Screen name="TabNavigationAdminWithdrawal" component={TabNavigationAdminWithdrawal} key={TabNavigationAdminWithdrawal}
            options={{
              title: "Withdrawal",
              drawerIcon: ({ color, size }) => <Feather name="upload" color={color} size={size} />,
            }} 
          />
        </>
      ) : (
        [
          authType == 'user' ? (
            <>
              <Drawer.Screen name="TabNavigationUser" component={TabNavigationUser} key={TabNavigationUser}
                options={{
                  title: "Create Message",
                  drawerIcon: ({ color, size }) => <Feather name="file-plus" color={color} size={size} />,
                }} 
              />
              <Drawer.Screen name="TabNavigationUserDeposit" component={TabNavigationUserDeposit} key={TabNavigationUserDeposit}
                options={{
                  title: "Deposit",
                  drawerIcon: ({ color, size }) => <Feather name="download" color={color} size={size} />,
                }} 
              />
              <Drawer.Screen name="TabNavigationUserWithdrawal" component={TabNavigationUserWithdrawal} key={TabNavigationUserWithdrawal}
                options={{
                  title: "Withdrawal",
                  drawerIcon: ({ color, size }) => <Feather name="upload" color={color} size={size} />,
                }} 
              />
            </>
          ) : (
            [
              authType == 'agent' ? (
                <>
                  <Drawer.Screen name="TabNavigationAgent" component={TabNavigationAgent} key={TabNavigationAgent}
                    options={{
                      title: "Today's Report",
                      drawerIcon: ({ color, size }) => <Feather name="file-text" color={color} size={size} />,
                    }} 
                  />
                  <Drawer.Screen name="TabNavigationAgentDeposit" component={TabNavigationAgentDeposit} key={TabNavigationAgentDeposit}
                    options={{
                      title: "Deposit",
                      drawerIcon: ({ color, size }) => <Feather name="download" color={color} size={size} />,
                    }} 
                  />
                  <Drawer.Screen name="TabNavigationAgentWithdrawal" component={TabNavigationAgentWithdrawal} key={TabNavigationAgentWithdrawal}
                    options={{
                      title: "Withdrawal",
                      drawerIcon: ({ color, size }) => <Feather name="upload" color={color} size={size} />,
                    }} 
                  />
                </>
              ) : (
                <>
                  <Drawer.Screen name="TabNavigationGroup" component={TabNavigationGroup} key={TabNavigationGroup}
                    options={{
                      title: "Deposit",
                      drawerIcon: ({ color, size }) => <Feather name="download" color={color} size={size} />,
                    }} 
                  />
                  <Drawer.Screen name="TabNavigationGroupWithdrawal" component={TabNavigationGroupWithdrawal} key={TabNavigationGroupWithdrawal}
                    options={{
                      title: "Withdrawal",
                      drawerIcon: ({ color, size }) => <Feather name="upload" color={color} size={size} />,
                    }} 
                  />
                </>
              )
            ]
          )
        ]
      )}
    </Drawer.Navigator>
  );
}

export default DrawerStack;