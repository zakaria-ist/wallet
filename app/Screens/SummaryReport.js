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
  useColorScheme,
  View,
  InteractionManager,
  RefreshControl,
} from 'react-native';
import {heightPercentageToDP, widthPercentageToDP} from "react-native-responsive-screen";
import { useStateIfMounted } from "use-state-if-mounted";
import Fontisto from 'react-native-vector-icons/Fontisto';
import AsyncStorage from "@react-native-community/async-storage";
import Spinner from "react-native-loading-spinner-overlay";
import SummaryTableRow from "../Components/SummaryTableRow";
import CustomHeader from "../Components/CustomHeader";
import CommonTop from "../Components/CommonTop";
import styles from '../lib/global_css';
import Request from "../lib/request";
import KTime from '../lib/formatTime';
import Format from "../lib/format";

const format = new Format();
const request = new Request();
const time = new KTime();

let authType = "";
let transType = "Today";
let authToken = "";
let walletType = 1;

const SummaryReport = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const [spinner, onSpinnerChanged] = useStateIfMounted(false);
  const [walletData, setWalletData] = useStateIfMounted([]);
  const [tableData, setTableData] = useStateIfMounted([]);
  const [refreshing, setRefreshing] = React.useState(false);

  const LeftButton = "Yesterday";
  const RightButton = "Today";
  const tableHeader = [
    ["Group Details"],
    ["Total(TK)"],
  ];

  const wait = (timeout) => {
    return new Promise(resolve => setTimeout(resolve, timeout));
  }

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    renderTablesData();
    wait(1000).then(() => setRefreshing(false));
  }, []);

  useEffect(() => {
    InteractionManager.runAfterInteractions(() => {
      AsyncStorage.getItem('walletData').then((walletData) => {
        setWalletData(JSON.parse(walletData));
      })
      AsyncStorage.getItem('token').then((token) => {
        authToken = token;
      })
      AsyncStorage.getItem('authType').then((auth_type) => {
        if (auth_type != null) {
          authType = auth_type;
          transType = "Today";
          renderTablesData();
        }
      })
    })
  }, []);

  const handleLeftButton = () => {
    transType = "Yesterday";
    renderTablesData();
  }

  const handleRightButton = () => {
    transType = "Today";
    renderTablesData();
  }

  const handleWalLeftButton = () => {
    walletType = 1;
    renderTablesData();
  }

  const handleWalMidButton = () => {
    walletType = 2;
    renderTablesData();
  }

  const handleWalRightButton = () => {
    walletType = 3;
    renderTablesData();
  }

  const renderTablesData = async () => {
    onSpinnerChanged(true);
    const statisticUrl = request.getStatisticUrl();
    let when = 'Yesterday';
    if (transType == 'Today') {
      when = 'Today';
    }
    const params = JSON.stringify(
      {
        token: authToken, 
        role: authType,
        when: when
      }
    );
    const content = await request.post(statisticUrl, params);
    if (content.ok) {
      let msg_list = [];
      msg_list.push(tableHeader);
      messages = content.msg.filter((msg, grandTotal) => {
        if (transType == 'Today') {
           msg_data = {
            id: msg.id,
            wallet: msg.walletName,
            amount: msg.amount,
          };
           sub_data ={ 
            totalwithdrawamount: grandTotal.totalwithdrawamount,
            totalwithdrawmsgcount: grandTotal.totalwithdrawmsgcount,
            totaldepositamount: grandTotal.totaldepositamount,
            totaldepositmsgcount: grandTotal.totaldepositmsgcount,
            totalamount: grandTotal.totalamount,
            totalmsgcount: grandTotal.totalmsgcount
          };
          msg_list.push(msg_data);
          msg_list.push(sub_data);
         // console.log('msg_data', msg_data);
         // console.log('sub_data', sub_data);
        } else {
          msg_data = {
            id: msg.id,
            wallet: msg.walletName,
            amount: msg.amount,
          };
           sub_data ={ 
            totalwithdrawamount: grandTotal.totalwithdrawamount,
            totalwithdrawmsgcount: grandTotal.totalwithdrawmsgcount,
            totaldepositamount: grandTotal.totaldepositamount,
            totaldepositmsgcount: grandTotal.totaldepositmsgcount,
            totalamount: grandTotal.totalamount,
            totalmsgcount: grandTotal.totalmsgcount
          };
          msg_list.push(msg_data);
          msg_list.push(sub_data);
         // console.log('msg_data', msg_data);
          //console.log('sub_data', sub_data);
          msg_list.push(msg_data);
          msg_list.push(sub_data);
        }
        msg_list.push(msg_data);
      })
        setTableData(msg_list);
       // console.log('msg_list', msg_list);
       onSpinnerChanged(false);
    }
    onSpinnerChanged(false);
  }

  const renderItem = ({ item }) => (
    <View style={styles.header}>
     {/* <SummaryTableRow header={true} rowData={tableHeader} />*/}
     {/*  <SummaryTableRow header={false} rowData={item} />*/}
    </View>
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
        <View style={{ marginTop:-heightPercentageToDP("1%")}}> 
          <View style={styles.view_deposit_withdrawel_treport_rectangle}>
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
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};


export default SummaryReport;
