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
import { useIsFocused } from "@react-navigation/native";
import SummaryTableRow from "../Components/SummaryTableRow";
import CustomHeader from "../Components/CustomHeader";
import CommonTop from "../Components/CommonTop";
import styles from '../lib/global_css';
import CustomAlert from "../lib/alert";
import Request from "../lib/request";
import KTime from '../lib/formatTime';
import Format from "../lib/format";
import resetTimeout from "../lib/resetTimeout";

const format = new Format();
const alert = new CustomAlert();
const request = new Request();
const time = new KTime();

let authType = "";
let transType = "Today";
let authToken = "";
let walletType = 1;
let refreshTimeout;
let autoRefresh = false;

const SummaryReport = () => {
  const isFocused = useIsFocused();
  const isDarkMode = useColorScheme() === 'dark';
  const [spinner, onSpinnerChanged] = useStateIfMounted(false);
  const [walletData, setWalletData] = useStateIfMounted([]);
  const [tableData, setTableData] = useStateIfMounted([]);
  const [refreshing, setRefreshing] = React.useState(false);

  const LeftButton = "Yesterday";
  const RightButton = "Today";
  const tableHeader = {
    id: "0",
    Header: true,
    Group: "Group Details",
    Total: "Total(TK)",
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
      
      AsyncStorage.getItem('walletData').then( async(walletData) => {
        if (walletData == null || walletData == undefined) {
          const walletUrl = request.getWalletUrl();  
          await request.get(walletUrl)
            .then(data => {
              setWalletData(Object.values(data['wallets']));
              AsyncStorage.setItem('walletData', JSON.stringify(Object.values(data['wallets'])));
            })
        }
        else {
          setWalletData(JSON.parse(walletData));
        }
      })
      AsyncStorage.getItem('token').then((token) => {
        authToken = token;
      })
      AsyncStorage.getItem('authType').then((auth_type) => {
        if (auth_type != null) {
          authType = auth_type;
          transType = "Today";
          autoRefresh = false;
          renderTablesData();
        }
      })
    })
  }, []);

  const handleLeftButton = () => {
    transType = "Yesterday";
    resetTimeout();
    renderTablesData();
  }

  const handleRightButton = () => {
    transType = "Today";
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

  const handleSetTimeout = () => {
    isFocused ? refreshTimeout = setTimeout(() => {
      autoRefresh = true;
      renderTablesData();
    }
    , 5000) : clearTimeout(refreshTimeout);
  }

  const renderTablesData = async () => {
    if (!autoRefresh) onSpinnerChanged(true);
    const statisticUrl = request.getStatisticUrl();
    let when = 'yesterday';
    if (transType == 'Today') {
      when = 'today';
    }
    const params = JSON.stringify(
      {
        token: authToken, 
        role: authType,
        when: when
      }
    );
    try {
      const content = await request.post(statisticUrl, params);
      if (content.ok) {
        let msg_list = [];
        msg_list.push(tableHeader);
        messages = content.clientGroups.map((msg) => {
          msg_list.push(msg);
        })
        setTableData(msg_list);
      } else {
        let msg_list = [];
        msg_list.push(tableHeader);
        setTableData(msg_list);
      }
    } catch(e) {
      console.log('ERROR', e);
      alert.info("Check your internet connection.");
    } finally {
      onSpinnerChanged(false);
      handleSetTimeout();
      autoRefresh = false;
    }
  }

  const renderItem = ({ item }) => (
    <View style={styles.header}>
      <SummaryTableRow rowData={item} />
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
        <View style={{paddingBottom: heightPercentageToDP("1%")}}> 
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
