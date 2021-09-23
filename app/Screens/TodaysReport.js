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
import Spinner from "react-native-loading-spinner-overlay";
import CustomHeader from "../Components/CustomHeader";
import TableRow from "../Components/TableRow";
import CommonTop from "../Components/CommonTop";
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { WalletColors } from "../assets/Colors.js";
import Request from "../lib/request";
import KTime from '../lib/formatTime';
import Format from "../lib/format";

const format = new Format();
const request = new Request();
const time = new KTime();

const TodaysReport = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const [spinner, onSpinnerChanged] = useStateIfMounted(false);
  const [transType, setTransType] = useStateIfMounted("withdrawal");
  const [token, setToken] = useStateIfMounted("");
  const [authType, setAuthType] = useStateIfMounted("");
  const [walletType, setWalletType] = useStateIfMounted(1);
  const [walletData, setWalletData] = useStateIfMounted([]);
  const [rejected, setRejected] = useStateIfMounted(true);
  const [accepted, setAccepted] = useStateIfMounted(true);
  const [acceptedTotal, setAcceptedTotal] = useStateIfMounted("20,000");
  const [tableRowHtml, setTableRowHtml] = useStateIfMounted([]);

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
      AsyncStorage.getItem('token').then((token) => {
        setToken(token);
      })
      AsyncStorage.getItem('authType').then((auth_type) => {
        if (auth_type != null) {
          setAuthType(auth_type);
        }
      })
      
      renderTablesData();
    })
  }, []);

  const handleLeftButton = () => {
    setTransType("deposit");
    renderTablesData();
  }

  const handleRightButton = () => {
    setTransType("withdrawal");
    renderTablesData();
  }

  const handleWalLeftButton = () => {
    setWalletType(1);
    renderTablesData();
  }

  const handleWalMidButton = () => {
    setWalletType(2);
    renderTablesData();
  }

  const handleWalRightButton = () => {
    setWalletType(3);
    renderTablesData();
  }

  const handleCheckBox = () => {
    renderTablesData();
  }
  const renderTablesData = async () => {
    onSpinnerChanged(true);
    const msgsUrl = request.getAllMessageUrl();
    let purpose = 'deposit';
    if (transType == 'deposit') {
      purpose = 'withdrawal';
    }
    
    const params = JSON.stringify(
      {
        token: token, 
        role: authType,
        purpose: purpose,
      }
    );

    const content = await request.post(msgsUrl, params);
    // console.log(transType, content)
    if (content.ok) {
      // ftatus filter
      let messages = content.msg.filter((msg) => {
        if (accepted && msg.status == 'accepted') return true;
        if (rejected && msg.status == 'rejected') return true;
        if (msg.status == 'new') return true;
        return false;
      })
      // wallet filter
      messages = messages.filter((msg) => {
        if (parseInt(walletType) == parseInt(msg.walletId)) return true;
        return false;
      })
      
      let msg_html = [];
      let total = 0;
      msg_html.push(<TableRow key={0} header={true} rowData={tableHeader} />)
      messages.map((msg) => {
        let amount = parseFloat(String(msg.amount).replace(',', ''))
        total += amount;
        amount = format.separator(amount);
        let msg_data = [];
        msg_data.push([time.format(msg.createdatetime), "(" + time.format(msg.updatedatetime) + ")"]);
        if (transType == 'Withdrawal') {
          msg_data.push(["Ref. No. : " + msg.refno, "Amount : " + amount, "Wallet    : " + msg.walletName]);
        } else {
          msg_data.push(["Pin No.  : " + msg.pino, "Amount : " + amount, "Wallet    : " + msg.walletName, "Mobile No.  : " + msg.mobile]);
        }
        msg_data.push([msg.status]);
        msg_html.push(<TableRow key={msg.id} header={false} rowData={msg_data} />)

      })
      setTableRowHtml(msg_html);
      setAcceptedTotal(total);
    }
    onSpinnerChanged(false);
  }

  return (
    <SafeAreaView>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <Spinner
        visible={spinner}
        // textContent={"Loading..."}
        textStyle={styles.spinnerTextStyle}
      />
      <ScrollView
        stickyHeaderIndices={[0]}
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
            {/* <TableRow header={true} rowData={tableHeader} />
            <TableRow header={false} rowData={tableRowOne} />
            <TableRow header={false} rowData={tableRowTwo} />
            <TableRow header={false} rowData={tableRowThree} /> */}
            {tableRowHtml}
          </View>
          <View styles={styles.total}>
            <Text style={styles.total_text}>Total Amount : TK {acceptedTotal}</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
  body: {
    backgroundColor: Colors.white,
    flexDirection: 'column',
    alignItems: "center",
    paddingBottom: heightPercentageToDP("2%"),
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
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: WalletColors.Wblue,
    borderStyle: 'solid',
    justifyContent: "flex-start",
    marginTop: heightPercentageToDP("1%"),
    width: widthPercentageToDP("90%"),
    //height: windowHeight - heightPercentageToDP("40%"),
    marginBottom: heightPercentageToDP("2%"),
    padding: heightPercentageToDP("1%"),
  },
  total: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    marginTop: heightPercentageToDP("1%"),
  },
  total_text: {
    fontSize: RFValue(13),
    fontWeight: "bold"
  },
  spinnerTextStyle: {
    color: WalletColors.Wblue,
  }
});

export default TodaysReport;
