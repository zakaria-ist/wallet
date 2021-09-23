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
  const tableRowOne = [
    ["10:10 AM",],
    ["Ref. No. : 12345", "Amount : 11,320", "Wallet    :  Alipay"],
    ["Rejected"],
  ];
  const tableRowTwo = [
    ["10:10 AM", "(12:10 AM)"],
    ["Ref. No. : 12345", "Amount : 11,320", "Wallet    :  Alipay"],
    ["Accepted"],
  ];
  const tableRowThree = [
    ["10:10 AM", "(12:10 AM)"],
    ["Ref. No. : 12345", "Amount : 11,320", "Wallet    :  Alipay"],
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
    <SafeAreaView style={{flex:1,backgroundColor: Colors.white}}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <View style={styles.header}>
          <CustomHeader 
            title={"Today's Report"}
          />
          <View style={styles.menu}>
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
        <View style={styles.body}>
          {transType == "Deposit" ?
          <View style={{flex:0.1, flexDirection:"row"}}>
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
            <View style={styles.checkboxContainer}></View>
          }
        {transType == "Deposit" ?
          <View style={styles.view_rectangle}>
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
          <View style={styles.view_rectangle}>
            <ScrollView>
            <TableRow header={true} rowData={tableHeader} />
            <TableRow header={false} rowData={tableRowOne} />
            <TableRow header={false} rowData={tableRowTwo} />
            <TableRow header={false} rowData={tableRowThree} />
            </ScrollView>
        </View>
          }
          <View styles={styles.total}>
            <Text style={styles.total_text}>Total Amount : TK {acceptedTotal}</Text>
          </View>
        </View>
      {/* </ScrollView> */}
    </SafeAreaView>
  );
};

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
  header:{
    flex:1, 
  },
  menu:{
    flex:2, 
    flexDirection:"row", 
    alignSelf:"center",
  },
  body: {
    flex: 4,
    backgroundColor: Colors.white,
    flexDirection: 'column',
    alignItems: "center",
  },
  status_row: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
  },
  checkboxContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: heightPercentageToDP("1%"),
  },
  checkbox: {
    transform: [{ scaleX: 0.5 }, { scaleY: 0.5 }],
    marginLeft: widthPercentageToDP("-2%"),
    marginRight: widthPercentageToDP("2%"),
  },
  label: {
    marginTop: widthPercentageToDP("-1%"),
    marginLeft: widthPercentageToDP("2%"),
    fontSize: RFValue(14)
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
    //height:windowHeight-StatusBar.currentHeight-heightPercentageToDP("25%")
  },
  total: {
    flex:1,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    //marginTop: heightPercentageToDP("1%"),
  },
  total_text: {
    fontSize: RFValue(13),
    fontWeight: "bold"
  }
});

export default TodaysReport;
