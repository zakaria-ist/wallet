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
    <SafeAreaView style={styles.header}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <Spinner
        visible={spinner}
        // textContent={"Loading..."}
        textStyle={styles.spinnerTextStyle}
      />
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

          <View style={styles.view_deposit_withdrawel_treport_rectangle}>
            <ScrollView>
              {tableRowHtml}
            </ScrollView>
          </View>
          <View styles={styles.total}>
            <Text style={styles.total_text}>Total Amount : TK   {acceptedTotal}</Text>
          </View>
        </View>
      {/* </ScrollView> */}
    </SafeAreaView>
  );
};

export default TodaysReport;
