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
  Dimensions,
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
import TableRowEditDeposit from "../Components/TableRowEditDeposit";
import TableRow from "../Components/TableRow";
import CommonTop from "../Components/CommonTop";
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { WalletColors } from "../assets/Colors.js";
import { height, marginBottom } from 'styled-system';
import { parseSync } from '@babel/core';

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
  const [pendingTotal, setPendingTotal] = useStateIfMounted("10,000");
  const [acceptedTotal, setAcceptedTotal] = useStateIfMounted("20,000");
  const [openClientPicker, setOpenClientPicker] = useState(false);
  const [openAdminPickerGroup, setOpenAdminPickerGroup] = useStateIfMounted(false);
  const [openAdminPickerWallet, setOpenAdminPickerWallet] = useStateIfMounted(false);
  const [pickerUser, setPickerUser] = useStateIfMounted(null);
  const [pickergroup, setPickerGroup] = useStateIfMounted(null);
  const [pickerGroupList, setPickerGroupList] = useStateIfMounted([]);
  const [groupList, setGroupList] = useStateIfMounted([]);
  const [userList, setUserList] = useStateIfMounted([]);
  const [pickerUserList, setPickerUserList] = useStateIfMounted([]);
  // const [userList, setUserList] = useStateIfMounted([
  //   {label: 'Australia', value: 'Australia'},
  //   {label: 'Canada', value: 'Canada'},
  //   {label: 'Bangladesh', value: 'Bangladesh'},
  //   {label: 'Egypt', value: 'Egypt'},
  //   {label: 'Ireland', value: 'Ireland'},
  // ]);
  // const [groupList, setGroupList] = useStateIfMounted([
  //   {label: 'Group 1', value: 'Group 1'},
  //   {label: 'Group 2', value: 'Group 2'},
  //   {label: 'Group 3', value: 'Group 3'},
  // ]);

  const backgroundStyle = {
    backgroundColor: Colors.white
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
    ["Ref. No. : 12345", "Amount : 11,320", "Wallet    : Alipay"],
    ["Pending"],
  ];
  const tableRowTwo = [
    ["10:10 AM", "(12:10 AM)"],
    ["Ref. No. : 12345", "Amount : 11,320", "Wallet    : Alipay"],
    ["Accepted"],
  ];
  const tableRowThree = [
    ["10:10 AM", "(12:10 AM)"],
    ["Ref. No. : 12345", "Amount : 11,320", "Wallet    : Alipay"],
    ["Rejected"],
  ];
  const agentTableHeader = [
    ["Time", "(HDL Time)"],
    ["Message"],
    ["Action"],
  ];
  const agentTableRowOne = {
    rowId: 1,
    time: "10:10 AM",
    wallet: "Alipay",
    amount: 11320,
    refNo: 1212121212
  };
  const agentTableRowTwo = {
    rowId: 2,
    time: "10:10 AM",
    wallet: "Alipay",
    amount: 12320,
    refNo: 1313131313
  };
  const agentTableRowThree = {
    rowId: 3,
    time: "10:10 AM",
    wallet: "Alipay",
    amount: 13320,
    refNo: 1414141414
  };

  useEffect(() => {
    InteractionManager.runAfterInteractions(() => {
      AsyncStorage.getItem('walletData').then((walletData) => {
        setWalletData(JSON.parse(walletData));
        let data = JSON.parse(walletData);
        let wData = [];
        data.map((wallet) => {
          wData.push({label: wallet.name, value: wallet.name})
        })
        setWalletPickerList(wData);
      });

      AsyncStorage.getItem('authType').then((auth_type) => {
        if (auth_type != null) {
          setAuthType(auth_type);
          if (auth_type == 'admin' || auth_type == 'subadmin') {
            AsyncStorage.getItem('groupList').then((groups) => {
              if (groups != null) {
                groups = JSON.parse(groups);
                setGroupList(groups);

                let pickerGroupList = [];
                groups.map(group => {
                  pickerGroupList.push({label: group.username, value: group.username})
                })
                setPickerGroupList(pickerGroupList);
              }
            });
          } else if (auth_type == 'client' || auth_type == 'agent') {
            AsyncStorage.getItem('userList').then((users) => {
              if (users != null) {
                users = JSON.parse(users);
                setUserList(users);

                if (auth_type == 'client') {
                  let pickerUserList = [];
                  users.map(user => {
                    pickerUserList.push({label: user.username, value: user.username})
                  })
                  setPickerUserList(pickerUserList);
                }
              }
            });
          }
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

  const rejectCallback = () => {
    
  }
  const acceptCallback = () => {
    
  }

  return (
    <SafeAreaView>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <ScrollView
        stickyHeaderIndices={[0]}
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
                style={{height: heightPercentageToDP("5%")}}
                onChangeValue={(value) => {
                  setPickerUser(value); 
                  renderTablesData();
                }}
                open={openClientPicker}
                value={pickerUser}
                items={pickerUserList}
                setOpen={setOpenClientPicker}
                setValue={setPickerUser}
                setItems={setPickerUserList}
                textStyle={{fontSize: RFValue(16)}}
                labelStyle={{fontWeight: "bold"}}
              />
            </View>
          :
            [authType == ("admin" || "subadmin") ? 
              <View style={{flexDirection: "row"}}>
                <View style={styles.picker_admin}>
                  <DropDownPicker
                    style={{height: heightPercentageToDP("5%")}}
                    onChangeValue={(value) => {
                      setPickerGroup(value); 
                      renderTablesData();
                    }}
                    open={openAdminPickerGroup}
                    value={pickergroup}
                    items={pickerGroupList}
                    setOpen={setOpenAdminPickerGroup}
                    setValue={setPickerGroup}
                    setItems={setPickerGroupList}
                    textStyle={{fontSize: RFValue(16)}}
                    labelStyle={{fontWeight: "bold"}}
                  />
                </View>
                <View style={styles.picker_admin}>
                  <DropDownPicker
                    style={{height: heightPercentageToDP("5%")}}
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
                  <Text style={styles.label}>Status:  </Text>
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
              {transType == "Today" ? 
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
              }
            </View>
          }
          {authType == 'agent' ?
            [transType == 'Today' ? 
              <View style={styles.view_rectangle}>
                <TableRowEditDeposit 
                  header={true} 
                  rowData={agentTableHeader} 
                  type={transType} 
                  rejectCallback={rejectCallback}
                  acceptCallback={acceptCallback}
                />
                <TableRowEditDeposit 
                  header={false} 
                  rowData={agentTableRowOne} 
                  type={transType} 
                  rejectCallback={rejectCallback}
                  acceptCallback={acceptCallback}
                />
                <TableRowEditDeposit 
                  header={false} 
                  rowData={agentTableRowTwo} 
                  type={transType} 
                  rejectCallback={rejectCallback}
                  acceptCallback={acceptCallback}
                />
                <TableRowEditDeposit 
                  header={false} 
                  rowData={agentTableRowThree} 
                  type={transType} 
                  rejectCallback={rejectCallback}
                  acceptCallback={acceptCallback}
                />
              </View>
            :
            <>
              <View style={styles.view_rectangle}>
                <TableRow header={true} rowData={tableHeader} />
                <TableRow header={false} rowData={tableRowOne} />
                <TableRow header={false} rowData={tableRowTwo} />
                <TableRow header={false} rowData={tableRowThree} />
              </View>
              <View styles={styles.total}>
                <Text style={styles.total_text}>Total Amount  : TK {acceptedTotal}</Text>
              </View>
            </>
            ]
          :
            <>
              <View style={styles.view_rectangle}>
                <TableRow header={true} rowData={tableHeader} />
                <TableRow header={false} rowData={tableRowOne} />
                <TableRow header={false} rowData={tableRowTwo} />
                <TableRow header={false} rowData={tableRowThree} />
              </View>
              <View style={styles.total}>
                <View style={{flexDirection:"row"}}>
                  <View style={{flexDirection: "column"}}>
                    <Text style={styles.total_text}>Pending</Text>
                    <Text style={styles.total_text}>Accepted</Text>
                  </View>  
                  <View style={{flexDirection: "column"}}>
                  <View style={{flexDirection: "row"}}>
                    <Text style={styles.total_text}>:</Text>
                    <Text style={styles.total_text}>TK</Text>
                    <Text style={styles.total_text}>{pendingTotal}</Text>
                  </View> 
                  <View style={{flexDirection: "row"}}>
                    <Text style={styles.total_text}>:</Text>
                    <Text style={styles.total_text}>TK</Text>
                    <Text style={styles.total_text}>{acceptedTotal}</Text>
                  </View>
                  </View>    
                </View>
              </View>
            </>
          }
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
    flex: 1,
    alignItems: "center",
    paddingBottom: heightPercentageToDP("2%"),
  },
  picker: {
    marginTop: heightPercentageToDP("2%"),
    width:  windowWidth/2 - widthPercentageToDP("10%"),
    flexDirection: "row",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
  },
  picker_admin: {
    marginTop: heightPercentageToDP("2%"),
    height: 5,
    width:  windowWidth/2 - widthPercentageToDP("10%"),
    flexDirection: "row",
    alignItems: "center",
    marginRight: 10, 
    marginLeft: 10,
  },
  status_row: {
    marginTop: heightPercentageToDP("1%"),
    flexDirection: "row",
    flex: 1,
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
   // height: heightPercentageToDP("1%"),
    transform: [{ scaleX: 0.5 }, { scaleY: 0.5 }],
    //alignSelf: "center",
   // marginBottom: heightPercentageToDP("4%")
    //marginTop: heightPercentageToDP("-1%"),
    marginLeft: widthPercentageToDP("-2%"),
    marginRight: widthPercentageToDP("2%"),
  },
  label: {
    marginTop: widthPercentageToDP("-1%"),
    marginLeft: widthPercentageToDP("2%"),
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
   // height: windowHeight - heightPercentageToDP("47%"),
    padding: heightPercentageToDP("1%"),
    //paddingBottom: windowHeight/2 - heightPercentageToDP("30%"),
  },
  total: {
    flexDirection: "column",
    textAlign: "left",
    // alignItems: "center",
    // justifyContent: "center",
    marginTop: heightPercentageToDP("1%"),
  },
  total_text: {
    fontSize: RFValue(13),
    fontWeight: "bold",
    marginLeft: heightPercentageToDP("1%"),
  }
});

export default Deposit;
