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
// import Fontisto from 'react-native-vector-icons/Fontisto';
import AsyncStorage from "@react-native-community/async-storage";
import CheckBox from "@react-native-community/checkbox";
import DropDownPicker from 'react-native-dropdown-picker';

import CustomHeader from "../Components/CustomHeader";
import TableRow from "../Components/TableRow";
import CommonTop from "../Components/CommonTop";
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { WalletColors } from "../assets/Colors.js";

const Deposit = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const [authType, setAuthType] = useStateIfMounted("");
  const [transType, setTransType] = useStateIfMounted("Today");
  const [walletType, setWalletType] = useStateIfMounted(1);
  const [walletPickerType, setWalletPickerType] = useStateIfMounted(1);
  const [walletData, setWalletData] = useStateIfMounted([]);
  const [walletPickerList, setWalletPickerList] = useStateIfMounted([]);
  const [pending, setPending] = useStateIfMounted(true);
  const [accepted, setAccepted] = useStateIfMounted(true);
  const [rejected, setRejected] = useStateIfMounted(true);
  const [noStatus, setNoStatus] = useStateIfMounted(true);
  const [pendingTotal, setPendingTotal] = useStateIfMounted("10,000.00");
  const [acceptedTotal, setAcceptedTotal] = useStateIfMounted("20,000.00");
  const [openClientPicker, setOpenClientPicker] = useState(false);
  const [openAdminPickerGroup, setOpenAdminPickerGroup] = useStateIfMounted(false);
  const [openAdminPickerWallet, setOpenAdminPickerWallet] = useStateIfMounted(false);
  const [pickerUser, setPickerUser] = useStateIfMounted(null);
  const [pickergroup, setPickerGroup] = useStateIfMounted(null);
  const [userList, setUserList] = useStateIfMounted([
    {label: 'Australia', value: 'Australia'},
    {label: 'Canada', value: 'Canada'},
    {label: 'Bangladesh', value: 'Bangladesh'},
    {label: 'Egypt', value: 'Egypt'},
    {label: 'Ireland', value: 'Ireland'},
  ]);
  const [groupList, setGroupList] = useStateIfMounted([
    {label: 'Group 1', value: 'Group 1'},
    {label: 'Group 2', value: 'Group 2'},
    {label: 'Group 3', value: 'Group 3'},
  ]);

  const backgroundStyle = {
    backgroundColor: Colors.white,
    borderTopColor: WalletColors.Wblue,
    borderWidth: 1,
    borderStyle: 'solid',
  };

  const LeftButton = "Yesterday";
  const RightButton = "Today";
  const tableHeader = [
    ["Time", "(HDL Time)"],
    ["Message"],
    ["Status"],
  ];
  const tableRowOne = [
    ["10:10 AM",],
    ["Ref. No. : 12345", "Amount : 11,320", "Wallet  : Alipay"],
    ["Pending"],
  ];
  const tableRowTwo = [
    ["10:10 AM", "(12:10 AM)"],
    ["Ref. No. : 12345", "Amount : 11,320", "Wallet  : Alipay"],
    ["Accepted"],
  ];
  const tableRowThree = [
    ["10:10 AM", "(12:10 AM)"],
    ["Ref. No. : 12345", "Amount : 11,320", "Wallet  : Alipay"],
    ["Rejected"],
  ];

  useEffect(() => {
    InteractionManager.runAfterInteractions(() => {
      AsyncStorage.getItem('walletData').then((walletData) => {
        setWalletData(JSON.parse(walletData));
        let data = JSON.parse(walletData);
        let wData = [];
        for (var i=0; i<data.length; i++) {
          wData.push({label: data[i].name, value: data[i].name})
        }
        setWalletPickerList(wData);
      });

      AsyncStorage.getItem('authType').then((auth_type) => {
        if (authType != null) {
          setAuthType(auth_type);
        }
      });
    })
  }, []);

  const handleLeftButton = () => {
    setTransType("Yesterday");
    renderTablesData();
  }

  const handleRightButton = () => {
    setTransType("Today");
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
  const renderTablesData = () => {
    
  }

  return (
    <SafeAreaView>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
          <CustomHeader 
            title={"Deposit"}
          />
          <CommonTop
            admin={authType == ("admin" || "subadmin") ? true : false}
            LeftButton={LeftButton}
            RightButton={RightButton}
            handleLeftButton={handleLeftButton}
            handleRightButton={handleRightButton}
            handleWalLeftButton={handleWalLeftButton}
            handleWalMidButton={handleWalMidButton}
            handleWalRightButton={handleWalRightButton}
          />

        <View style={styles.body}>
          {authType == "client" ? 
            <View style={styles.picker}>
              <DropDownPicker
                onChangeValue={(value) => {
                  setPickerUser(value); 
                  renderTablesData();
                }}
                open={openClientPicker}
                value={pickerUser}
                items={userList}
                setOpen={setOpenClientPicker}
                setValue={setPickerUser}
                setItems={setUserList}
                textStyle={{fontSize: RFValue(16)}}
                labelStyle={{fontWeight: "bold"}}
              />
            </View>
          :
            [authType == ("admin" || "subadmin") ? 
              <View style={{flexDirection: "row"}}>
                <View style={styles.picker_admin}>
                  <DropDownPicker
                    onChangeValue={(value) => {
                      setPickerGroup(value); 
                      renderTablesData();
                    }}
                    open={openAdminPickerGroup}
                    value={pickergroup}
                    items={groupList}
                    setOpen={setOpenAdminPickerGroup}
                    setValue={setPickerGroup}
                    setItems={setGroupList}
                    textStyle={{fontSize: RFValue(16)}}
                    labelStyle={{fontWeight: "bold"}}
                  />
                </View>
                <View style={styles.picker_admin}>
                  <DropDownPicker
                    onChangeValue={(value) => {
                      setWalletPickerType(value); 
                      renderTablesData();
                    }}
                    open={openAdminPickerWallet}
                    value={walletPickerType}
                    items={walletPickerList}
                    setOpen={setOpenAdminPickerWallet}
                    setValue={setWalletPickerType}
                    setItems={setWalletPickerList}
                    textStyle={{fontSize: RFValue(16)}}
                    labelStyle={{fontWeight: "bold"}}
                  />
                </View>
              </View>
            :
              <View/>
            ]
          }
          {authType == 'agent' ?
            [transType == 'Yesterday' ?
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
                <View style={styles.checkboxContainer}>
                  <Text style={styles.label}>No Status</Text>
                  <CheckBox
                    value={noStatus}
                    onValueChange={setNoStatus}
                    style={styles.checkbox}
                    onChange={handleCheckBox}
                    tintColors={{ true: WalletColors.Wblue, false: WalletColors.Wblue }}
                  />
                </View>
              </View>
              :
              <View></View>
            ]
          :
            <View style={styles.status_row}>
              <View style={styles.checkboxContainer}>
                <Text style={styles.label}>Status:   </Text>
                <Text style={styles.label}>Pending</Text>
                <CheckBox
                  value={pending}
                  onValueChange={setPending}
                  style={styles.checkbox}
                  onChange={handleCheckBox}
                  tintColors={{ true: WalletColors.Wblue, false: WalletColors.Wblue }}
                />
              </View>
              <View style={styles.checkboxContainer}>
                <Text style={styles.label}>Accepted</Text>
                <CheckBox
                  value={accepted}
                  onValueChange={setAccepted}
                  style={styles.checkbox}
                  onChange={handleCheckBox}
                  tintColors={{ true: WalletColors.Wblue, false: WalletColors.Wblue }}
                />
              </View>
              [transType == "Today" ? 
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
              :
                <View style={styles.checkboxContainer}>
                  <Text style={styles.label}>No Status</Text>
                  <CheckBox
                    value={noStatus}
                    onValueChange={setNoStatus}
                    style={styles.checkbox}
                    onChange={handleCheckBox}
                    tintColors={{ true: WalletColors.Wblue, false: WalletColors.Wblue }}
                  />
                </View>
              ]
            </View>
          }
          <View style={styles.view_rectangle}>
            <TableRow header={true} rowData={tableHeader} />
            <TableRow header={false} rowData={tableRowOne} />
            <TableRow header={false} rowData={tableRowTwo} />
            <TableRow header={false} rowData={tableRowThree} />
          </View>
          <View styles={styles.total}>
            <Text style={styles.total_text}>Pending  : TK {pendingTotal}</Text>
            <Text style={styles.total_text}>Accepted : TK {acceptedTotal}</Text>
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
    flex: 1,
    alignItems: "center",
    paddingBottom: heightPercentageToDP("5%"),
  },
  picker: {
    marginTop: heightPercentageToDP("2%"),
    height: heightPercentageToDP("5%"),
    width: widthPercentageToDP("50%"),
    flexDirection: "row",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center"
  },
  picker_admin: {
    marginTop: heightPercentageToDP("2%"),
    height: heightPercentageToDP("5%"),
    width: widthPercentageToDP("40%"),
    flexDirection: "row",
    alignItems: "center",
    marginRight: 10, 
    marginLeft: 10
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

export default Deposit;
