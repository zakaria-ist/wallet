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
  FlatList,
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

let authType = "";
let transType = "withdrawal";
let authToken = "";
let walletType = 1;

const TodaysReport = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const [spinner, onSpinnerChanged] = useStateIfMounted(false);
  // const [transType, setTransType] = useStateIfMounted("withdrawal");
  // const [token, setToken] = useStateIfMounted("");
  // const [authType, setAuthType] = useStateIfMounted("");
  // const [walletType, setWalletType] = useStateIfMounted(1);
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
    HDLtime: [""],
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
        // setToken(token);
        authToken = token;
      })
      AsyncStorage.getItem('authType').then((auth_type) => {
        if (auth_type != null) {
          // setAuthType(auth_type);
          authType = auth_type;
          renderTablesData();
        }
      })
    })
  }, []);

  const handleLeftButton = () => {
    // setTransType("deposit");
    transType = "deposit";
    renderTablesData();
  }

  const handleRightButton = () => {
    // setTransType("withdrawal");
    transType = "withdrawal";
    renderTablesData();
  }

  const handleWalLeftButton = () => {
    // setWalletType(1);
    walletType = 1;
    renderTablesData();
  }

  const handleWalMidButton = () => {
    // setWalletType(2);
    walletType = 2;
    renderTablesData();
  }

  const handleWalRightButton = () => {
    // setWalletType(3);
    walletType = 3;
    renderTablesData();
  }

  const handleCheckBox = () => {
    renderTablesData();
  }
  const renderTablesData = async () => {
    onSpinnerChanged(true);
    const msgsUrl = request.getAllMessageUrl();
    let purpose = 'deposit';
    if (transType == 'withdrawal') {
      purpose = 'withdrawal';
    }
    
    const params = JSON.stringify(
      {
        token: authToken, 
        role: authType,
        purpose: purpose,
      }
    );

    const content = await request.post(msgsUrl, params);
    console.log(transType, content)
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
      // amount = format.separator(amount);
      let msg_data = {};
      if (purpose == 'deposit') {
        msg_data = {
          time: time.format(msg.createdatetime),
          HDLtime: "(" + msg.updatedatetime ? time.format(msg.updatedatetime) : "" + ")",
          wallet: msg.walletName,
          amount: amount,
          refNo: msg.refno ? msg.refno : "",
          status: msg.status,
        };
      } else {
        msg_data = {
          time: time.format(msg.createdatetime),
          HDLtime: "(" + msg.updatedatetime ? time.format(msg.updatedatetime) : "" + ")",
          wallet: msg.walletName,
          amount: amount,
          pinNo: msg.pino ? msg.pino : "-",
          mobile: msg.mobile ? msg.mobile : "",
          status: msg.status,
        };
      }
        
        msg_html.push(<TableRow key={msg.id} header={false} rowData={msg_data} />)
        console.log('msg_data', msg_data)
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
          {transType == "deposit" ?
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
            <View style={{marginTop:-heightPercentageToDP("0.3%")}}></View>
          }

          <View style={styles.view_deposit_withdrawel_treport_rectangle}>
          <FlatList 
            data={[{key: 'item1' }]}
            //style={{height: heightPercentageToDP("64%")}}
            renderItem={({ item, index, separators }) => (
            <TouchableOpacity>
              <View style={styles.header}>
                  {tableRowHtml}
                {/* <TableRow header={true} rowData={tableHeader} />
                <TableRow header={false} rowData={tableRowOne} />
                <TableRow header={false} rowData={tableRowTwo} />
                <TableRow header={false} rowData={tableRowThree} /> */}
              </View>
            </TouchableOpacity>)}
          />
          </View>
          <View styles={styles.total}>
            <Text style={styles.total_text}>Total Amount : TK {format.separator(acceptedTotal)}</Text>
          </View>
        </View>
    </SafeAreaView>
  );
};

export default TodaysReport;
