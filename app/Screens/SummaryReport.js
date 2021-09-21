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
  useColorScheme,
  View,
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
    <SafeAreaView>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <ScrollView
        stickyHeaderIndices={[0]}
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
          <CustomHeader 
            title={"Summary Report"}
          />
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

        <View style={styles.body}>
          <View style={styles.view_rectangle}>
            <SummaryTableRow header={true} rowData={tableHeader} />
            <SummaryTableRow header={false} rowData={groupData} />
            <SummaryTableRow header={false} rowData={groupData} />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  body: {
    backgroundColor: Colors.white,
    flexDirection: 'column',
    alignItems: "center",
    paddingBottom: heightPercentageToDP("1%"),
  },
  view_rectangle: {
    flexDirection: "column", 
    alignItems: "center",
    borderRadius: 20,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: WalletColors.Wblue,
    borderStyle: 'solid',
    justifyContent: 'center',
    marginTop: heightPercentageToDP("1%"),
    width: widthPercentageToDP("95%"),
    marginBottom: heightPercentageToDP("1%"),
  },
});

export default SummaryReport;
