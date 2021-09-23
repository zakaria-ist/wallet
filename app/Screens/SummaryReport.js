/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useState, useEffect}  from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  PixelRatio,
  useColorScheme,
  View,
  Dimensions,
  InteractionManager,
  TouchableOpacity,
  KeyboardAvoidingView
} from 'react-native';
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";
import { useStateIfMounted } from "use-state-if-mounted";
import { RFValue } from "react-native-responsive-fontsize";
import Fontisto from 'react-native-vector-icons/Fontisto';
import AsyncStorage from "@react-native-community/async-storage";

import SummaryTableRow from "../Components/SummaryTableRow";
import CustomHeader from "../Components/CustomHeader";
import CommonTop from "../Components/CommonTop";
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { WalletColors } from "../assets/Colors.js";
import { flexDirection, height } from 'styled-system';
import { block } from 'react-native-reanimated';

const SummaryReport = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const [transType, setTransType] = useStateIfMounted("Today");
  const [walletType, setWalletType] = useStateIfMounted(1);
  const [walletData, setWalletData] = useStateIfMounted([]);

  const backgroundStyle = {
    backgroundColor: Colors.white
  };

  const LeftButton = "Yesterday";
  const RightButton = "Today";
  const tableHeader = [
    ["Group Details"],
    ["Total(TK)"],
  ];
  let groupData = [
    {
      "group": "1. Group A",
      "subtotal": {
        "deposit" : 10500,
        "withdrawal" : 19500
      },
      "total": -9000,
      "walletData" : [
        {
          "wallet" : "Alipay",
          "deposit" : {
            "count": 100,
            "amount": 3500,
          },
          "withdrawal" : {
            "count": 50,
            "amount": 6500,
          }
        },
        {
          "wallet" : "Alipay",
          "deposit" : {
            "count": 100,
            "amount": 3500,
          },
          "withdrawal" : {
            "count": 50,
            "amount": 6500,
          }
        },
        {
          "wallet" : "Alipay",
          "deposit" : {
            "count": 100,
            "amount": 3500,
          },
          "withdrawal" : {
            "count": 50,
            "amount": 6500,
          }
        }
      ]
    }
  ];

  useEffect(() => {
    InteractionManager.runAfterInteractions(() => {
      AsyncStorage.getItem('walletData').then((walletData) => {
        setWalletData(JSON.parse(walletData));
      })
    })
  }, []);

  const handleLeftButton = () => {
    setTransType("Yesterday");
  }

  const handleRightButton = () => {
    setTransType("Today");
  }

  const handleWalLeftButton = () => {
    setWalletType(1);
  }

  const handleWalMidButton = () => {
    setWalletType(2);
  }

  const handleWalRightButton = () => {
    setWalletType(3);
  }

  return (
    <SafeAreaView style={{backgroundColor: Colors.white,flex:1}}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <View style={styles.header}>
        <CustomHeader 
          title={"Summary Report"}
        />   
        <View style={styles.menu}>
        <CommonTop
          admin={true}
          LeftButton={LeftButton}
          RightButton={RightButton}
          handleLeftButton={handleLeftButton}
          handleRightButton={handleRightButton}
          handleWalLeftButton={handleWalLeftButton}
          handleWalMidButton={handleWalMidButton}
          handleWalRightButton={handleWalRightButton}
        />
      </View>
      </View>
      <View style={styles.body}> 
        <View style={styles.view_rectangle}>
        <ScrollView>
          <SummaryTableRow header={true} rowData={tableHeader} />
          <SummaryTableRow header={false} rowData={groupData} />
          <SummaryTableRow header={false} rowData={groupData} />
          <SummaryTableRow header={false} rowData={groupData} /> 
          <SummaryTableRow header={false} rowData={groupData} />
        </ScrollView>
        </View>
      </View>
    </SafeAreaView>
  );
};

const windowHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
  header:{
    flex:1,
  },
  menu:{
    flex:1, 
    flexDirection:"row", 
    alignSelf:"center"
  },
  body: {
    marginTop:heightPercentageToDP("1%"),
    backgroundColor: Colors.white,
    flex:5.6,
    flexDirection: 'column',
    alignItems: "center",
    paddingBottom: heightPercentageToDP("1%"),
  },
  view_rectangle: {
    flex:1,
    flexDirection: "column", 
    alignItems: "center",
    borderRadius: 20,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: WalletColors.Wblue,
    borderStyle: 'solid',
    justifyContent: "flex-start",
    width: widthPercentageToDP("90%"),
    padding: heightPercentageToDP("1%"),
  },
});

export default SummaryReport;
