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
  useColorScheme,
  View,
  InteractionManager,
  TouchableOpacity,
  KeyboardAvoidingView
} from 'react-native';
import { useStateIfMounted } from "use-state-if-mounted";
import Fontisto from 'react-native-vector-icons/Fontisto';
import AsyncStorage from "@react-native-community/async-storage";

import SummaryTableRow from "../Components/SummaryTableRow";
import CustomHeader from "../Components/CustomHeader";
import CommonTop from "../Components/CommonTop";
import styles from '../lib/global_css';

const SummaryReport = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const [transType, setTransType] = useStateIfMounted("Today");
  const [walletType, setWalletType] = useStateIfMounted(1);
  const [walletData, setWalletData] = useStateIfMounted([]);

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
    <SafeAreaView style={styles.header}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <View style={styles.header}>
        <CustomHeader 
          title={"Summary Report"}
        />   
        <View style={styles.summary_report_nav_top}>
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
      <View style={styles.summary_report_body}> 
        <View style={styles.view_deposit_withdrawel_treport_rectangle}>
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


export default SummaryReport;
