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
  RefreshControl,
  useColorScheme,
  View,
  InteractionManager,
  TouchableOpacity,
  KeyboardAvoidingView
} from 'react-native';
import {heightPercentageToDP, widthPercentageToDP} from "react-native-responsive-screen";
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
  const [walletData, setWalletData] = useStateIfMounted([]);
  const [rejected, setRejected] = useStateIfMounted(true);
  const [accepted, setAccepted] = useStateIfMounted(true);
  const [acceptedTotal, setAcceptedTotal] = useStateIfMounted("");
  const [tableData, setTableData] = useStateIfMounted([]);
  const [refreshing, setRefreshing] = React.useState(false);

  const backgroundStyle = {
    backgroundColor: Colors.white
  };

  const LeftButton = "Deposit";
  const RightButton = "Withdrawal";
  const tableHeader = {
    id: "0",
    Time: "Time",
    HDLTime: "(HDL Time)",
    Message: "Message",
    Status: "Status",
    Header: true
  };

  const wait = (timeout) => {
    return new Promise(resolve => setTimeout(resolve, timeout));
  }

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    renderTablesData();
    wait(2000).then(() => setRefreshing(false));
  }, []);

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
          transType = "withdrawal";
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
    console.log(transType, authType, authToken, walletType, content)
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
      
      let msg_list = [];
      let total = 0;
      msg_list.push(tableHeader);
      messages.map((msg) => {
        let amount = parseFloat(String(msg.amount).replace(',', ''))
        total += amount;
        // amount = format.separator(amount);
        let msg_data = {};
        if (purpose == 'deposit') {
          msg_data = {
            id: msg.id,
            time: time.format(msg.createdatetime),
            HDLtime: "(" + msg.updatedatetime ? time.format(msg.updatedatetime) : "" + ")",
            wallet: msg.walletName,
            amount: amount,
            refNo: msg.refno ? msg.refno : "",
            status: msg.status,
          };
        } else {
          msg_data = {
            id: msg.id,
            time: time.format(msg.createdatetime),
            HDLtime: "(" + msg.updatedatetime ? time.format(msg.updatedatetime) : "" + ")",
            wallet: msg.walletName,
            amount: amount,
            pinNo: msg.pino ? msg.pino : "-",
            mobile: msg.mobile ? msg.mobile : "",
            status: msg.status,
          };
        }
        msg_list.push(msg_data);
      })
      // console.log('msg_data', msg_list);
      setTableData(msg_list);
      setAcceptedTotal(total);
    }
    onSpinnerChanged(false);
  }

  const renderItem = ({ item }) => (
    <TableRow rowData={item} />
  );

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
          {tableData ?
            <FlatList
              data={tableData}
              renderItem={renderItem}
              keyExtractor={item => item.id}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={onRefresh}
                />
              }
            />
          :
            <></>
          }
        </View>
        <View styles={styles.total}>
          <Text style={styles.total_text}>Total Amount : TK {format.separator(acceptedTotal)}</Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default TodaysReport;
