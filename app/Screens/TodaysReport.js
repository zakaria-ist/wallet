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
  Dimensions,
  PixelRatio,
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
import styles from '../lib/global_css';
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
  const [acceptedTotal, setAcceptedTotal] = useStateIfMounted("20,000");

  const backgroundStyle = {
    backgroundColor: Colors.white
  };

  const LeftButton = "Deposit";
  const RightButton = "Withdrawal";
  const tableHeader = [
    ["Time", "(HDL Time)"],
    ["Message"],
    ["Status"],
  ];
  const tableRowOne = {
    // rowId: 1,
    time: "10:10 AM",
    wallet: "Alipay",
    amount: 11320,
    refNo: 12345,
    status: "Pending",
  };
  const tableRowTwo = {
    // rowId: 1,
    time: ["10:10 AM"],
    HDLtime: ["(12:10 AM)"],
    wallet: "Alipay",
    amount: 11320,
    refNo: 12345,
    status: "Accepted",
  };
  const tableRowThree = {
    // rowId: 1,
    time: ["10:10 AM"],
    HDLtime: ["(12:10 AM)"],
    wallet: "Alipay",
    amount: 11320,
    refNo: 12345,
    status: "Accepted",
  };
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
    <SafeAreaView style={styles.header}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <View style={styles.header}>
          <CustomHeader 
            title={"Today's Report"}
          />
          <View style={styles.today_report_nav_top}>
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
           </View>
        </View>
        <View style={styles.deposit_withdrawel_treport_body}>
          {transType == "Deposit" ?
          <View style={styles.agent_status_row_container}>
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
            </View>
          :
            <View style={{marginTop:-heightPercentageToDP("1%")}}></View>
          }
        {transType == "Deposit" ?
          <View style={styles.view_deposit_withdrawel_treport_rectangle}>
          <ScrollView>
          <TableRow header={true} rowData={tableHeader} />
          <TableRow header={false} rowData={tableRowOne} />
          <TableRow header={false} rowData={tableRowTwo} />
          <TableRow header={false} rowData={tableRowThree} />
          <TableRow header={false} rowData={tableRowTwo} />
          <TableRow header={false} rowData={tableRowThree} />
          <TableRow header={false} rowData={tableRowTwo} />
          <TableRow header={false} rowData={tableRowThree} />
          <TableRow header={false} rowData={tableRowTwo} />
          <TableRow header={false} rowData={tableRowThree} />
          <TableRow header={false} rowData={tableRowTwo} />
          <TableRow header={false} rowData={tableRowThree} />
          </ScrollView>
        </View>
          :
          <View style={styles.view_deposit_withdrawel_treport_rectangle}>
            <ScrollView>
            <TableRow header={true} rowData={tableHeader} />
            <TableRow header={false} rowData={tableRowOne} />
            <TableRow header={false} rowData={tableRowTwo} />
            <TableRow header={false} rowData={tableRowThree} />
            </ScrollView>
        </View>
          }
          <View styles={styles.total}>
            <Text style={styles.total_text}>Total Amount : TK   {acceptedTotal}</Text>
          </View>
        </View>
      {/* </ScrollView> */}
    </SafeAreaView>
  );
};

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default TodaysReport;
