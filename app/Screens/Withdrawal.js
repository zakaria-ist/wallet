/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */
import React, {useMemo, useState, useEffect, useCallback}  from 'react';
import {
  FlatList,
  StatusBar,
  Text,
  SafeAreaView,
  useColorScheme,
  View,
  InteractionManager,
  RefreshControl,
  TouchableOpacity,
  TouchableWithoutFeedback,
  KeyboardAvoidingView
} from 'react-native';
import {heightPercentageToDP, widthPercentageToDP,} from "react-native-responsive-screen";
import { useStateIfMounted } from "use-state-if-mounted";
import { RFValue } from "react-native-responsive-fontsize";
import Fontisto from 'react-native-vector-icons/Fontisto';
import AsyncStorage from "@react-native-community/async-storage";
import CheckBox from "@react-native-community/checkbox";
import DropDownPicker from 'react-native-dropdown-picker';
import Spinner from "react-native-loading-spinner-overlay";
import { useIsFocused } from "@react-navigation/native";
import CustomHeader from "../Components/CustomHeader";
import TableRowEditWithdra from "../Components/TableRowEditWithdrawel";
import TableRow from "../Components/TableRow";
import CommonTop from "../Components/CommonTop";
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { WalletColors } from "../assets/Colors.js";
import styles from '../lib/global_css';
import Request from "../lib/request";
import KTime from '../lib/formatTime';
import Format from "../lib/format";
import Picker from '../lib/picker';

const picker = new Picker();

const format = new Format();
const request = new Request();
const time = new KTime();

let authType = "";
let transType = "Today";
let authToken = "";
let walletType = 1;
let pending = true;
let noStatus = true;
let accepted = true;
let refreshTimeout;
let autoRefresh = false;

const Withdrawal = () => {
  const isFocused = useIsFocused();
  const isDarkMode = useColorScheme() === 'dark';
  const [spinner, onSpinnerChanged] = useStateIfMounted(false);
  const [walletPickerType, setWalletPickerType] = useStateIfMounted("");
  const [walletData, setWalletData] = useStateIfMounted([]);
  const [walletPickerList, setWalletPickerList] = useStateIfMounted([]);
  const [pendingTotal, setPendingTotal] = useStateIfMounted(0);
  const [acceptedTotal, setAcceptedTotal] = useStateIfMounted(0);
  const [openClientPicker, setOpenClientPicker] = useStateIfMounted(false);
  const [openAdminPickerGroup, setOpenAdminPickerGroup] = useStateIfMounted(false);
  const [openAdminPickerWallet, setOpenAdminPickerWallet] = useStateIfMounted(false);
  const [pickerUser, setPickerUser] = useStateIfMounted(null);
  const [pickerGroup, setPickerGroup] = useStateIfMounted(null);
  const [pickerGroupList, setPickerGroupList] = useStateIfMounted([]);
  const [groupList, setGroupList] = useStateIfMounted([]);
  const [userList, setUserList] = useStateIfMounted([]);
  const [pickerUserList, setPickerUserList] = useStateIfMounted([]);
  const [tableData, setTableData] = useStateIfMounted([]);
  const [tableEditData, setTableEditData] = useStateIfMounted([]);
  const [keyboard, setKeyboard] = useState(Boolean);
  const [refreshing, setRefreshing] = React.useState(false);

  const LeftButton = "Yesterday";
  const RightButton = "Today";
  
  const tableHeader = {
    id: "0",
    Time: "Time",
    HDLTime: "(HDL Time)",
    Message: "Message",
    Status: "Status",
    Header: true
  };
  const agentTableHeader = {
    id: "0",
    Time: "Time",
    HDLTime: "(HDL Time)",
    Message: "Message",
    Status: "Action",
    Header: true
  };

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
        let data = JSON.parse(walletData);
        let wData = [];
        data.map((wallet, index) => {
          if (index == 0) {
            setWalletPickerType(wallet.id);
          }
          wData.push({label: wallet.name, value: wallet.id})
        })
        setWalletPickerList(wData);
      });

      AsyncStorage.getItem('token').then((token) => {
        authToken = token;
      })

      AsyncStorage.getItem('authType').then((auth_type) => {
        if (auth_type != null) {
          authType = auth_type;
          transType = "Today";
          if (auth_type == 'admin' || auth_type == 'subadmin') {
            AsyncStorage.getItem('groupList').then((groups) => {
              if (groups != null) {
                groups = JSON.parse(groups);
                setGroupList(groups);

                let pickerGroupList = [];
                groups.map((group, index) => {
                  if (index == 0) {
                    setPickerGroup(group.username);
                  }
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
                  users.map((user, index) => {
                    if (index == 0) {
                      setPickerUser(user.username);
                    }
                    pickerUserList.push({label: user.username, value: user.username})
                  })
                  setPickerUserList(pickerUserList);
                }
              }
            });
          }
          autoRefresh = false;
          renderTablesData();
        }
      });
    })
  }, [isFocused]);

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

  const handleCheckBox = () => {
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
    let when = 'today';
    if (transType == 'Yesterday') {
      when = 'yesterday';
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
        purpose: "withdrawal",
        when: when
      }
    );
    const content = await request.post(msgsUrl, params);
    if (content.ok) {
      let myUserName = content.myUsername;
      let messages = [];
      if (authType == 'agent') {
        messages = content.msg.filter((msg) => {
          return msg.toagent == myUserName;
        })
      } else if (authType == 'client') {
        messages = content.msg.filter((msg) => {
          return msg.belongclient == myUserName;
        })
      } else if (authType == 'user') {
        messages = content.msg.filter((msg) => {
          return msg.fromuser == myUserName;
        })
      }
      // porpose filter
      messages = messages.filter((msg) => {
        return (msg.purpose == "withdrawal")
      })
      // ftatus filter
      messages = messages.filter((msg) => {
        if (accepted && String(msg.status).toLowerCase() == 'accepted') return true;
        // if (rejected && msg.status == 'rejected') return true;
        if (pending && (String(msg.status).toLowerCase() == 'pending' || 
            String(msg.status).toLowerCase() == 'outdated')) return true;
        if (noStatus && msg.status == null) return true;
        return false;
      })
      // wallet filter
      messages = messages.filter((msg) => {
        if (authType == 'admin' || authType == 'subadmin') {
          return (parseInt(walletPickerType) == parseInt(msg.walletId))
        } else {
          return (parseInt(walletType) == parseInt(msg.walletId))
        }
      })
      // user & client filter
      if (authType == 'admin' || authType == 'subadmin') {
        messages = messages.filter((msg) => {
          return (pickerGroup && pickerGroup == msg.belongclient)
        })
      }
      if (authType == 'client') {
        messages = messages.filter((msg) => {
          return (pickerUser && pickerUser == msg.fromuser)
        })
      }
      
      let msg_list = [];
      let accepted_total = 0;
      let pending_total = 0;
      if (authType == 'agent' && transType == 'Today') {
        messages = messages.filter((msg) => {
          return String(msg.status).toLowerCase() == 'pending';
        })
        msg_list.push(agentTableHeader);
        messages.map((msg) => {
          let amount = parseFloat(String(msg.amount).replace(',', ''));
          let msg_data = {
            id: msg.id,
            time: time.format(msg.createdatetime),
            wallet: msg.walletName,
            amount: amount,
            mobile: msg.mobile,
            sent: false
          };
          msg_list.push(msg_data);
        })
        setTableEditData(msg_list);
      } else {
        msg_list.push(tableHeader);
        messages.map((msg) => {
          let msg_data = {};
          let amount = parseFloat(String(msg.amount).replace(',', ''));
          if (String(msg.status).toLowerCase() == 'pending' || 
                String(msg.status).toLowerCase() == 'outdated') {
            pending_total += amount;
            if (when == 'today') {
              msg.status = 'Pending'
            } else {
              msg.status = ''
            }
          }
          else if (String(msg.status).toLowerCase() == 'accepted') {
            accepted_total += amount;
            msg.status = 'Accepted'
          }
          if (authType == 'agent') {
            msg_data = {
              id: msg.id,
              time: time.format(msg.createdatetime),
              HDLtime: "(" + msg.updatedatetime ? time.format(msg.updatedatetime) : "" + ")",
              wallet: msg.walletName,
              amount: amount,
              pinNo: msg.pinno ? msg.pinno : "",
              mobile: msg.mobile ? msg.mobile : "",
              status: msg.status,
            };
          } else {
            msg_data = {
              id: msg.id,
              time: time.format(msg.createdatetime),
              HDLtime: "(" + msg.updatedatetime ? time.format(msg.updatedatetime) : "" + ")",
              wallet: msg.walletName,
              amount: amount,
              pinNo: msg.pinno ? msg.pinno : "",
              mobile: msg.mobile ? msg.mobile : "",
              user: msg.fromuser,
              status: msg.status,
            };
          }
          msg_list.push(msg_data);
        })
        setTableData(msg_list);
        setAcceptedTotal(accepted_total);
        setPendingTotal(pending_total);
        handleSetTimeout();
      }
    } else {
      let msg_list = [];
      if (authType == 'agent' && transType == 'Today') {
        msg_list.push(agentTableHeader);
      } else {
        msg_list.push(tableHeader);
        handleSetTimeout();
      }
      setTableData(msg_list);
      setAcceptedTotal(0);
      setPendingTotal(0);
    }
    onSpinnerChanged(false);
    autoRefresh = false;
  }

  const renderItem = useCallback(({ item }) => (
    <TouchableOpacity onPress={() => false || onWalletPickerOpen() || onGroupPickerOpen() || onClientPickerOpen()} activeOpacity={1}> 
      <TableRow rowData={item} />
    </TouchableOpacity> 
  ));
  const renderItemEdit = useCallback(({ item }) => (
    <TouchableOpacity onPress={() => false || onWalletPickerOpen() || onGroupPickerOpen() || onClientPickerOpen()} activeOpacity={1}> 
       <TableRowEditWithdra rowData={item} />
    </TouchableOpacity> 
  ));
  const memoizedItemValue = useMemo(() => renderItem);
  const memoizedItemEditValue = useMemo(() => renderItemEdit);
  const keyExtractor = useCallback((item) => item.id.toString(), []);
  const onWalletPickerOpen = useCallback(() => {
    setOpenClientPicker(false);
    setOpenAdminPickerGroup(false);
  }, []);
  const onGroupPickerOpen = useCallback(() => {
    setOpenClientPicker(false);
    setOpenAdminPickerWallet(false);
  }, []);
  const onClientPickerOpen = useCallback(() => {
    setOpenAdminPickerGroup(false);
    setOpenAdminPickerWallet(false);
  }, []);

  return (
    <TouchableWithoutFeedback onPress={() => onWalletPickerOpen() || onGroupPickerOpen() || onClientPickerOpen()} style={styles.header}>
      <KeyboardAvoidingView style={styles.header}
      behavior='absolute' 
      keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
      enabled={true}>          
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <Spinner
        visible={spinner}
        // textContent={"Loading..."}
        onSpinnerChanged={false}
        textStyle={styles.spinnerTextStyle}
      />
      <View style={styles.header}>
        <View style={((authType == "admin" || authType == "subadmin") ? styles.admin_deposit_withdrawel_header : styles.header)}>
          <CustomHeader 
            title={"Withdrawal"}
          /> 
            <View style={((authType == "admin" || authType == "subadmin") ? styles.admin_deposit_withdrawel_nav_top : styles.deposit_withdrawel_today_nav_top)}>
              <CommonTop
                admin={(authType == "admin" || authType == "subadmin") ? true : false}
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
          {authType == "client" ? 
            <View style={picker.smallclientpicker() || picker.mediumclientpicker() || picker.largeclientpicker()}>
              <DropDownPicker
                style={picker.smallclientdpicker() || picker.mediumclientdpicker() || picker.largeclientdpicker()}
                listItemContainerStyle={{height: heightPercentageToDP("5%")}}
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
                  placeholder="Users"
                  onOpen={onClientPickerOpen}
                />
              </View>
            :
              [(authType == "admin" || authType == "subadmin") ? 
                <View style={{flexDirection: "row"}}>
                  <View style={picker.smalladminpicker() || picker.mediumadminpicker() || picker.largeadminpicker()}>
                    <DropDownPicker
                      style={{height: heightPercentageToDP("5%")}}
                      listItemContainerStyle={{height: heightPercentageToDP("5%")}}
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
                      placeholder="Clients"
                      onOpen={onGroupPickerOpen}
                    />
                  </View>
                  <View style={picker.smalladminpicker() || picker.mediumadminpicker() || picker.largeadminpicker()}>
                    <DropDownPicker
                      style={{height: heightPercentageToDP("5%")}}
                      listItemContainerStyle={{height: heightPercentageToDP("5%")}}
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
                      placeholder="Wallets"
                      onOpen={onWalletPickerOpen}
                    />
                    </View>
                </View>
              :
                <></>
              ]
          }
          {authType == 'agent' ?
            [transType == 'Yesterday' ?
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
                      noStatus = !noStatus;
                      handleCheckBox();
                    }}
                  >
                    <Text style={styles.label}>No Status</Text>
                  </TouchableOpacity>
                  <CheckBox
                    value={noStatus}
                    onValueChange={value => {
                      noStatus = value;
                      handleCheckBox();
                    }}
                    style={styles.checkbox}
                    tintColors={{ true: WalletColors.Wblue, false: WalletColors.Wblue }}
                  />
                </View>
              </View>
            </View>
              :
              <View></View>
            ]
          :
            <View style={(authType == "admin" || authType == "subadmin" || authType == "client") ? styles.status_row_container : styles.status_agent_user_row_container}>
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
            </View>
              <View style={styles.checkboxContainer}>
                {transType == "Today" ? 
                  <TouchableOpacity 
                    onPress={() => {
                      pending = !pending;
                      handleCheckBox();
                    }}
                  >
                    <Text style={styles.label}>Pending</Text>
                  </TouchableOpacity> 
                : 
                  <TouchableOpacity 
                    onPress={() => {
                      noStatus = !noStatus;
                      handleCheckBox();
                    }}
                  >
                    <Text style={styles.label}>No Status</Text>
                  </TouchableOpacity>}
                  <CheckBox
                    value={transType == "Today" ? pending : noStatus}
                    onValueChange={value => {
                      transType == "Today" ? pending = value : noStatus = value;
                      handleCheckBox();
                    }}
                    style={styles.checkbox}
                    tintColors={{ true: WalletColors.Wblue, false: WalletColors.Wblue }}
                  />
              </View>
            </View>
          }
          {authType == 'agent' ?
            [transType == 'Today' ? 
              <View style={styles.agent_container}>
                <View style={styles.view_deposit_withdrawel_treport_rectangle}>
                  {tableEditData ?
                    <FlatList
                      data={tableEditData}
                      renderItem={memoizedItemEditValue}
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
              </View>
            :
            <>
              <View style={styles.view_deposit_withdrawel_treport_rectangle}>
                {tableData ?
                  <FlatList
                    data={tableData}
                    renderItem={memoizedItemValue}
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
                <Text style={styles.total_text}>Total Amount : TK  {format.separator(acceptedTotal)}</Text>
              </View>
            </>
            ]
          :
            <>
              <View style={styles.view_deposit_withdrawel_treport_rectangle}>
                {tableData ?
                  <FlatList
                    data={tableData}
                    renderItem={memoizedItemValue}
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
              {[transType == 'Today' ? 
                <View style={styles.total}>
                  <View style={{flexDirection:"row"}}>
                    <View style={{flexDirection: "column"}}>
                      <Text style={styles.total_text}>Pending</Text>
                      <Text style={styles.total_text}>Accepted</Text>
                    </View>  
                    <View style={{flexDirection: "column"}}>
                    <View style={{flexDirection: "row"}}>
                      <Text style={styles.total_text}> : </Text>
                      <Text style={styles.total_text}>TK  </Text>
                      <Text style={styles.total_text}>{format.separator(pendingTotal)}</Text>
                    </View> 
                    <View style={{flexDirection: "row"}}>
                      <Text style={styles.total_text}> : </Text>
                      <Text style={styles.total_text}>TK  </Text>
                      <Text style={styles.total_text}>{format.separator(acceptedTotal)}</Text>
                    </View>
                    </View>    
                  </View>
                </View>                
            : 
              <View styles={styles.total}>
                <Text style={styles.total_text}>Accepted : TK  {format.separator(acceptedTotal)}</Text>
              </View>
            ]}
            </>
          }
        </View>
      </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};


export default Withdrawal;
