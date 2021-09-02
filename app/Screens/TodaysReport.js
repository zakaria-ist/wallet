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
import CheckBox from "@react-native-community/checkbox";

import CustomHeader from "../Components/CustomHeader";
import TableRow from "../Components/TableRow";
import CommonTop from "../Components/CommonTop";
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { WalletColors } from "../assets/Colors.js";

const TodaysReport = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const [transType, setTransType] = useStateIfMounted("Withdrawal");
  const [walletType, setWalletType] = useStateIfMounted(1);
  const [walletData, setWalletData] = useStateIfMounted([]);
  const [rejected, setRejected] = useStateIfMounted(true);
  const [accepted, setAccepted] = useStateIfMounted(true);
  const [acceptedTotal, setAcceptedTotal] = useStateIfMounted("20,000.00");

  const backgroundStyle = {
    backgroundColor: Colors.white,
    borderTopColor: WalletColors.Wblue,
    borderWidth: 1,
    borderStyle: 'solid',
  };

  const LeftButton = "Deposit";
  const RightButton = "Withdrawal";
  const tableHeader = [
    ["Time", "(HDL Time)"],
    ["Message"],
    ["Status"],
  ];
  const tableRowOne = [
    ["10:10 AM",],
    ["Ref. No. : 12345", "Amount : 11,320", "Wallet  : Alipay"],
    ["Rejected"],
  ];
  const tableRowTwo = [
    ["10:10 AM", "(12:10 AM)"],
    ["Ref. No. : 12345", "Amount : 11,320", "Wallet  : Alipay"],
    ["Accepted"],
  ];
  const tableRowThree = [
    ["10:10 AM", "(12:10 AM)"],
    ["Ref. No. : 12345", "Amount : 11,320", "Wallet  : Alipay"],
    ["Accepted"],
  ];

  useEffect(() => {
    InteractionManager.runAfterInteractions(() => {
      AsyncStorage.getItem('walletData').then((walletData) => {
        setWalletData(JSON.parse(walletData));
      })
    })
  }, []);

  const handleLeftButton = () => {
    setTransType("Deposit");
  }

  const handleRightButton = () => {
    setTransType("Withdrawal");
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

  const handleCheckBox = () => {
    renderTablesData();
  }
  const renderTablesData = () => {
    
  }

  return (
    <SafeAreaView>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
          <CustomHeader 
            title={"Today's Report"}
          />
          <CommonTop
            admin={false}
            LeftButton={LeftButton}
            RightButton={RightButton}
            handleLeftButton={handleLeftButton}
            handleRightButton={handleRightButton}
            handleWalLeftButton={handleWalLeftButton}
            handleWalMidButton={handleWalMidButton}
            handleWalRightButton={handleWalRightButton}
          />

        <View style={styles.body}>
          {transType == "Deposit" ?
            <View style={styles.status_row}>
              <View style={styles.checkboxContainer}>
                <Text style={styles.label}>Status:   </Text>
                <Text style={styles.label}>Accepted</Text>
                <CheckBox
                  value={accepted}
                  onValueChange={setAccepted}
                  style={styles.checkbox}
                  onChange={handleCheckBox}
                  tintColors={{ true: WalletColors.Wblue, false: WalletColors.Wblue }}
                />
                
              </View>
              <View style={styles.checkboxContainer}>
                <Text style={styles.label}>Rejected</Text>
                <CheckBox
                  value={rejected}
                  onValueChange={setRejected}
                  style={styles.checkbox}
                  onChange={handleCheckBox}
                  tintColors={{ true: WalletColors.Wblue, false: WalletColors.Wblue }}
                />
              </View>
            </View>
          :
            <View style={styles.checkboxContainer}></View>
          }
          
          <View style={styles.view_rectangle}>
            <TableRow header={true} rowData={tableHeader} />
            <TableRow header={false} rowData={tableRowOne} />
            <TableRow header={false} rowData={tableRowTwo} />
            <TableRow header={false} rowData={tableRowThree} />
          </View>
          <View styles={styles.total}>
            <Text style={styles.total_text}>Total Amount : TK {acceptedTotal}</Text>
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
    paddingBottom: heightPercentageToDP("5%"),
  },
  status_row: {
    marginTop: heightPercentageToDP("2%"),
    flexDirection: "row",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center"
  },
  checkboxContainer: {
    flexDirection: "row",
    marginTop: heightPercentageToDP("1%"),
  },
  checkbox: {
    alignSelf: "center",
    marginRight: widthPercentageToDP("3%"),
  },
   label: {
    marginTop: widthPercentageToDP("1%"),
    marginLeft: widthPercentageToDP("2%"),
    paddingRight: widthPercentageToDP("0%"),
    fontSize: RFValue(14)
  },
  view_rectangle: {
    flexDirection: "column", 
    alignItems: "center",
    borderRadius: 20,
    borderWidth: 2,
    borderColor: WalletColors.Wblue,
    borderStyle: 'solid',
    justifyContent: 'center',
    marginTop: heightPercentageToDP("3%"),
    width: widthPercentageToDP("90%"),
    marginBottom: heightPercentageToDP("3%"),
  },
  total: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    marginTop: heightPercentageToDP("1%"),
  },
  total_text: {
    fontSize: RFValue(20),
    fontWeight: "bold"
  }
});

export default TodaysReport;
