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
} from "react-native-responsive-screen";
import { useStateIfMounted } from "use-state-if-mounted";
import { RFValue } from "react-native-responsive-fontsize";
// import Fontisto from 'react-native-vector-icons/Fontisto';
import AsyncStorage from "@react-native-community/async-storage";
import CheckBox from "@react-native-community/checkbox";
import DropDownPicker from 'react-native-dropdown-picker';
import Spinner from "react-native-loading-spinner-overlay";
import CustomHeader from "../Components/CustomHeader";
import TableRowEditDeposit from "../Components/TableRowEditDeposit";
import TableRow from "../Components/TableRow";
import CommonTop from "../Components/CommonTop";
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { WalletColors } from "../assets/Colors.js";
import { height, marginBottom } from 'styled-system';
import { parseSync } from '@babel/core';
import styles from '../lib/global_css';
import Request from "../lib/request";
import KTime from '../lib/formatTime';

const request = new Request();

const Deposit = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const [spinner, onSpinnerChanged] = useStateIfMounted(false);
  const [authType, setAuthType] = useStateIfMounted("");
  const [token, setToken] = useStateIfMounted("");
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
  const [pickerGroup, setPickerGroup] = useStateIfMounted(null);
  const [pickerGroupList, setPickerGroupList] = useStateIfMounted([]);
  const [groupList, setGroupList] = useStateIfMounted([]);
  const [userList, setUserList] = useStateIfMounted([]);
  const [pickerUserList, setPickerUserList] = useStateIfMounted([]);
  const [tableRowHtml, setTableRowHtml] = useStateIfMounted([]);
  const [tableRowEditHtml, setTableRowEditHtml] = useStateIfMounted([]);
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


  const LeftButton = "Yesterday";
  const RightButton = "Today";
  const tableHeader = [
    ["Time", "(HDL Time)"],
    ["Message"],
    ["Status"],
  ];
  const tableRowOne = {
    time: "10:10 AM",
    HDLtime: ["(12:10 AM)"],
    wallet: "Alipay",
    amount: 11320,
    refNo: 12345,
    status: "Pending",
  };
  const tableRowTwo = {
    time: ["10:10 AM"],
    HDLtime: ["(12:10 AM)"],
    wallet: "Alipay",
    amount: 11320,
    refNo: 12345,
    status: "Accepted",
  };
  const tableRowThree = {
    time: ["10:10 AM"],
    HDLtime: ["(12:10 AM)"],
    wallet: "Alipay",
    amount: 11320,
    refNo: 12345,
    status: "Rejected",
  };
  const agentTableHeader = [
    ["Time", "(HDL Time)"],
    ["Message"],
    ["Action"],
  ];
  const agentTableRowOne = {
    rowId: 1,
    time: "10:10 AM",
    HDLtime: ["(12:10 AM)"],
    wallet: "Alipay",
    amount: "11320",
    refNo: 1212121212,
    sent: false
  };
  const agentTableRowTwo = {
    rowId: 2,
    time: "10:10 AM",
    HDLtime: ["(12:10 AM)"],
    wallet: "Alipay",
    amount: "12320",
    refNo: 1313131313,
    sent: false
  };
  const agentTableRowThree = {
    rowId: 3,
    time: "10:10 AM",
    HDLtime: ["(12:10 AM)"],
    wallet: "Alipay",
    amount: "13320",
    refNo: 1414141414,
    sent: false
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

      AsyncStorage.getItem('token').then((token) => {
        setToken(token);
      })

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
      renderTablesData();
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
  const renderTablesData = async () => {
    onSpinnerChanged(true);
    //onSpinnerChanged(false);
    const msgsUrl = request.getAllMessageUrl();
    let purpose = 'Yesterday';
    if (transType == 'Yesterday') {
      purpose = 'Today';
    }
    const params = JSON.stringify(
      {
        token: token, 
        role: authType,
        purpose: purpose,
       // purpose: 'deposite',
      }
    );
    const content = await request.post(msgsUrl, params);

    if (content.ok) {
      // ftatus filter
      let messages = content.msg.filter((msg) => {
        if (accepted && msg.status == 'accepted') return true;
        if (rejected && msg.status == 'rejected') return true;
        if (pending && msg.status == 'pending') return true;
        if (noStatus && msg.status == null) return true;

        return false;
      })
      // wallet filter
      messages = messages.filter((msg) => {
        if (parseInt(walletType) == parseInt(msg.walletId)) return true;
        if (authType == 'admin' || authType == 'subadmin') {
          if (parseInt(walletPickerType) == parseInt(msg.walletId)) return true;
        }
        return false;
      })
      // user & client filter
      if (authType == 'admin' || authType == 'subadmin') {
        messages = messages.filter((msg) => {
          if (pickerGroup && pickerGroup == msg.belongclient) return true;
          return false;
        })
      }
      if (authType == 'client') {
        messages = messages.filter((msg) => {
          if (pickerUser && pickerUser == msg.fromuser) return true;
          return false;
        })
      }
      
      let msg_html = [];
      if (authType == 'agent' && transType == 'Today') {
        msg_html.push(<TableRowEditDeposit key={0} header={true} rowData={agentTableHeader} />)
        messages.map((msg) => {
          let msg_data = {
            rowId: msg.id,
            time: KTime.format(msg.createdatetime),
            wallet: msg.walletName,
            amount: msg.amount,
            refNo: msg.refno,
            sent: false
          };
          msg_html.push(<TableRowEditDeposit key={msg.id} header={false} rowData={msg_data} />)
        })
        setTableRowEditHtml(msg_html);
      } else {
        msg_html.push(<TableRow key={0} header={true} rowData={tableHeader} />)
        messages.map((msg) => {
          let msg_data = [];
          msg_data.push([KTime.format(msg.createdatetime),  "(" + KTime.format(msg.updatedatetime) + ")"]);
          if (authType == 'client' || authType == 'admin' || authType == 'subadmin') {
            msg_data.push(["Ref. No. : " + msg.refno, "Amount : " + msg.amount, "Wallet    : " + msg.walletName, "User      : " + msg.fromuser]);
          } else {
            msg_data.push(["Ref. No. : " + msg.refno, "Amount : " + msg.amount, "Wallet    : " + msg.walletName]);
          }
          msg_data.push([msg.status]);
          msg_html.push(<TableRow key={msg.id} header={false} rowData={msg_data} />)
        })
        setTableRowHtml(msg_html);
      }
    }
    onSpinnerChanged(false);
  }

  return (
    <SafeAreaView style={styles.header}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <Spinner
        //visible={spinner}
        // textContent={"Loading..."}
        textStyle={styles.spinnerTextStyle}
      />
      <View style={styles.header}>
      {authType == ("admin" || "subadmin") ?
          <View style={styles.admin_deposit_withdrawel_header}>
              <CustomHeader 
                title={"Deposit"}
              /> 
              <View style={styles.admin_deposit_withdrawel_nav_top}>
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
            </View> 
          </View>
        :
        <View style={styles.header}>
          <CustomHeader 
            title={"Deposit"}
          /> 
          <View style={styles.deposit_withdrawel_nav_top}>
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
          </View> 
        </View>
      }
      
        <View style={styles.deposit_withdrawel_treport_body}>
          {authType == "client" ? 
          <View style={styles.client_picker}>
            <View style={styles.picker}>
              <DropDownPicker
                style={styles.client_dropdownpicker}
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
                textStyle={{fontSize: RFValue(13)}}
                labelStyle={{fontWeight: "bold"}}
              />
              </View>
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
                    value={pickerGroup}
                    items={pickerGroupList}
                    setOpen={setOpenAdminPickerGroup}
                    setValue={setPickerGroup}
                    setItems={setPickerGroupList}
                    textStyle={{fontSize: RFValue(13)}}
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
                    textStyle={{fontSize: RFValue(13)}}
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
            <View style={styles.agent_status_row_container}>
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
              </View>
              :
              <View></View>
            ]
          :
          ([authType == ("admin" || "subadmin") ?
            <View style={styles.admin_subadmin_status_row_container}>
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
            :
            <View style={styles.others_status_row_container}>
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
          ]
          )
          }
          {authType == 'agent' ?
            [transType == 'Today' ? 
            <View style={styles.agent_container}>
              <View style={styles.view_deposit_withdrawel_treport_rectangle}>
                <FlatList data={[{key: 'item1' }]}
                  renderItem={({ item, index, separators }) => (
                    <TouchableOpacity>
                      <View style={styles.header}>
                        <TableRowEditDeposit header={true} rowData={agentTableHeader} />
                        <TableRowEditDeposit header={false} rowData={agentTableRowOne} />
                        <TableRowEditDeposit header={false} rowData={agentTableRowTwo} />
                        <TableRowEditDeposit header={false} rowData={agentTableRowThree} />
                      </View>
                    </TouchableOpacity>)}
                  />
                </View>
              </View>
            :
            <>
              <View style={styles.view_deposit_withdrawel_treport_rectangle}>
                <FlatList data={[{key: 'item1' }]}
                  renderItem={({ item, index, separators }) => (
                    <TouchableOpacity>
                      <View style={styles.header}>
                        <TableRow header={true} rowData={tableHeader} />
                        <TableRow header={false} rowData={tableRowOne} />
                        <TableRow header={false} rowData={tableRowTwo} />
                        <TableRow header={false} rowData={tableRowThree} />
                      </View>
                    </TouchableOpacity>)}
                  />
              </View>
              <View styles={styles.total}>
                <Text style={styles.total_text}>Total Amount  : TK   {acceptedTotal}</Text>
              </View>
              
            </>
            ]
          :
            <>
              <View style={styles.view_deposit_withdrawel_treport_rectangle}>
              <FlatList data={[{key: 'item1' }]}
                renderItem={({ item, index, separators }) => (
                  <TouchableOpacity>
                    <View style={styles.header}>
                      <TableRow header={true} rowData={tableHeader} />
                      <TableRow header={false} rowData={tableRowOne} />
                      <TableRow header={false} rowData={tableRowTwo} />
                      <TableRow header={false} rowData={tableRowThree} />
                      <TableRow header={false} rowData={tableRowOne} />
                      <TableRow header={false} rowData={tableRowTwo} />
                      <TableRow header={false} rowData={tableRowThree} />
                    </View>
                  </TouchableOpacity>)}
                />
              </View>
              <View style={styles.total}>
                <View style={{flexDirection:"row"}}>
                  <View style={{flexDirection: "column"}}>
                    <Text style={styles.total_text}>Pending</Text>
                    <Text style={styles.total_text}>Accepted</Text>
                  </View>  
                  <View style={{flexDirection: "column"}}>
                  <View style={{flexDirection: "row"}}>
                    <Text style={styles.total_text}> : </Text>
                    <Text style={styles.total_text}>TK   </Text>
                    <Text style={styles.total_text}>{pendingTotal}</Text>
                  </View> 
                  <View style={{flexDirection: "row"}}>
                    <Text style={styles.total_text}> : </Text>
                    <Text style={styles.total_text}>TK   </Text>
                    <Text style={styles.total_text}>{acceptedTotal}</Text>
                  </View>
                  </View>    
                </View>
              </View>
            </>
          }  
          </View>
        </View>
    </SafeAreaView>
  );
};


export default Deposit;
