/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */
import React, {useState, useEffect, useCallback}  from 'react';
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
import { useIsFocused } from "@react-navigation/native";
import CustomHeader from "../Components/CustomHeader";
import TableRow from "../Components/TableRow";
import CommonTop from "../Components/CommonTop";
import { WalletColors } from "../assets/Colors.js";
import CustomAlert from "../lib/alert";
import Request from "../lib/request";
import KTime from '../lib/formatTime';
import Format from "../lib/format";
import resetTimeout from "../lib/resetTimeout";

const format = new Format();
const request = new Request();
const alert = new CustomAlert();
const time = new KTime();

let authType = "";
let transType = "withdrawal";
let authToken = "";
let walletType = 1;
let accepted = true;
let rejected = true;
let refreshTimeout;
let autoRefresh = false;

const TodaysReport = () => {
  const isFocused = useIsFocused();
  const isDarkMode = useColorScheme() === 'dark';
  const [spinner, onSpinnerChanged] = useStateIfMounted(false);
  const [walletData, setWalletData] = useStateIfMounted([]);
  const [acceptedTotal, setAcceptedTotal] = useStateIfMounted("");
  const [tableData, setTableData] = useStateIfMounted([]);
  const [refreshing, setRefreshing] = React.useState(false);

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
    resetTimeout();
    renderTablesData();
    wait(1000).then(() => setRefreshing(false));
  }, []);

  useEffect(() => {
    InteractionManager.runAfterInteractions(() => {
      //clear all auto refresh
      resetTimeout();
      
      AsyncStorage.getItem('walletData').then( async (walletData) => {
        let wData = [];
        if (walletData == null || walletData == undefined) {
          const walletUrl = request.getWalletUrl();  
          await request.get(walletUrl)
            .then(data => {
              wData = Object.values(data['wallets']);
              setWalletData(Object.values(data['wallets']));
              AsyncStorage.setItem('walletData', JSON.stringify(Object.values(data['wallets'])));
            })
        }
        else {
          wData = JSON.parse(walletData);
          setWalletData(JSON.parse(walletData));
        }
        
        wData.map((wallet, index) => {
          if (index == 0) {
            walletType = wallet.id;
          }
        })
      })
      AsyncStorage.getItem('token').then((token) => {
        authToken = token;
      })
      AsyncStorage.getItem('authType').then((auth_type) => {
        if (auth_type != null) {
          authType = auth_type;
          transType = "withdrawal";
          autoRefresh = false;
          renderTablesData();
        }
      })
    })
  }, []);

  const handleLeftButton = () => {
    transType = "deposit";
    resetTimeout();
    renderTablesData();
  }

  const handleRightButton = () => {
    transType = "withdrawal";
    resetTimeout();
    renderTablesData();
  }

  const handleWalLeftButton = () => {
    walletType = 1;
    resetTimeout();
    renderTablesData();
  }

  const handleWalMidButton = () => {
    walletType = 2;
    resetTimeout();
    renderTablesData();
  }

  const handleWalRightButton = () => {
    walletType = 3;
    resetTimeout();
    renderTablesData();
  }

  const handleCheckBox = () => {
    resetTimeout();
    renderTablesData();
  }

  const handleSetTimeout = () => {
    isFocused ? refreshTimeout = setTimeout(() => {
      autoRefresh = true;
      renderTablesData();
    }
    , 5000) : clearTimeout(refreshTimeout);
  }

  const renderTablesData = async () => {
    if (!autoRefresh) onSpinnerChanged(true);
    const msgsUrl = request.getAllMessageUrl();
    let purpose = 'deposit';
    if (transType == 'withdrawal') {
      purpose = 'withdrawal';
    }
    if (authToken == "") {
      authToken = await AsyncStorage.getItem('token');
    }
    if (authType == "") {
      authType = await AsyncStorage.getItem('authType');
    }
    const params = JSON.stringify(
      {
        token: authToken, 
        role: authType,
        purpose: purpose,
        when: 'today'
      }
    );
    try{
      const content = await request.post(msgsUrl, params);
      if (content.ok) {
        let myUserName = content.myUsername;
        let messages = content.msg.filter((msg) => {
          return msg.toagent == myUserName;
        })
        // status filter
        messages = messages.filter((msg) => {
          if (accepted && (
                msg.statusId == 1 || 
                msg.statusId == 3 || 
                msg.statusId == 22
              )) return true;
          if (rejected && msg.statusId == 2) return true;
          return false;
        })
        // wallet filter
        messages = messages.filter((msg) => {
          return (parseInt(walletType) == parseInt(msg.walletId))
        })
        
        let msg_list = [];
        let total = 0;
        msg_list.push(tableHeader);
        messages.map((msg) => {
          let amount = parseFloat(String(msg.amount).replace(',', ''));
          if (msg.statusId == 1 || msg.statusId == 3 || msg.statusId == 22) {
            total += amount;
            msg.status = 'Accepted'
          }
          else if (msg.statusId == 2) {
            msg.status = 'Rejected'
          }
          let msg_data = {};
          if (purpose == 'deposit') {
            msg_data = {
              id: msg.id,
              time: time.format(msg.createdatetime),
              HDLtime: "(" + msg.updatedatetime ? time.format(msg.updatedatetime) : "" + ")",
              wallet: msg.walletName,
              amount: amount,
              oldAmount: msg.oldamount ? msg.oldamount : 0,
              refNo: msg.refno ? msg.refno : "",
              user: msg.fromuser,
              status: msg.status,
            };
          } else {
            msg_data = {
              id: msg.id,
              time: time.format(msg.createdatetime),
              HDLtime: "(" + msg.updatedatetime ? time.format(msg.updatedatetime) : "" + ")",
              wallet: msg.walletName,
              amount: amount,
              pinNo: msg.pinno ? msg.pinno : "-",
              mobile: msg.mobile ? msg.mobile : "",
              user: msg.fromuser,
              status: msg.status,
            };
          }
          msg_list.push(msg_data);
        })
        setTableData(msg_list);
        setAcceptedTotal(total);
      } else {
        let msg_list = [];
        msg_list.push(tableHeader);
        setTableData(msg_list);
        setAcceptedTotal(0);
      }
      // onSpinnerChanged(false);
      // handleSetTimeout();
      // autoRefresh = false;
    } catch(e) {
      console.log('ERROR', e);
      alert.info("Check your internet connection.");
    } finally {
      onSpinnerChanged(false);
      handleSetTimeout();
      autoRefresh = false;
    }
  }

  const renderItem =  ({ item }) => (
    <TableRow rowData={item} />
  );
  const keyExtractor = useCallback((item) => item.id.toString(), []);

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
        <View style={styles.deposit_withdrawel_today_nav_top}>
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
          <View style={styles.status_agent_user_row_container}>
            <View style={styles.status_row}>
              <View style={styles.checkboxContainer}>
                <Text style={styles.label}>Status:   </Text>
                <TouchableOpacity 
                      onPress={() => {
                        accepted = !accepted;
                        handleCheckBox();
                      }}
                    >
                  <Text style={styles.label}>Accepted</Text>
                </TouchableOpacity>
                <CheckBox
                  value={accepted}
                  onValueChange={value => {
                    accepted = value;
                    handleCheckBox();
                  }}
                  style={styles.checkbox}
                  tintColors={{ true: WalletColors.Wblue, false: WalletColors.Wblue }}
                />
              </View>
              <View style={styles.checkboxContainer}>
                <TouchableOpacity 
                  onPress={() => {
                    rejected = !rejected;
                    handleCheckBox();
                  }}
                >
                  <Text style={styles.label}>Rejected</Text>
                </TouchableOpacity>
                <CheckBox
                  value={rejected}
                  onValueChange={value => {
                    rejected = value;
                    handleCheckBox();
                  }}
                  style={styles.checkbox}
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
              keyExtractor={keyExtractor}
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
