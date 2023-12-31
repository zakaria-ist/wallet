import {StyleSheet,Dimensions} from 'react-native';
import {heightPercentageToDP, widthPercentageToDP} from "react-native-responsive-screen";
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {WalletColors} from "../assets/Colors.js";
import {RFValue} from "react-native-responsive-fontsize";

const windowHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
  //Splash Out Screen
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#307ecc',
  },
  activityIndicator: {
    alignItems: 'center',
    height: windowHeight / 2 - heightPercentageToDP("60%"),
  },

  //DrawerStack
  drawercontainer: {
    flex: 1,
    marginTop: heightPercentageToDP("1%"),
    marginBottom: heightPercentageToDP("15%"),
    flexDirection: 'column',
  },
  drawerHeader: {
    height: heightPercentageToDP("10%"),
    backgroundColor: 'white',
    flexDirection: 'column',
    marginBottom: heightPercentageToDP("5%")
  },
  drawerImage: {
    alignSelf:'center',
    height: heightPercentageToDP("15%"),
    width: heightPercentageToDP("15%"),
    borderRadius: 75
  },
  userName: {
    paddingTop: 10,
    alignSelf:'center',
  },
  drawerItem: {
    marginHorizontal:0,
    marginVertical: 0,
    borderBottomWidth: StyleSheet.hairlineWidth, 
    borderBottomColor:'#265684',
  },
  version: {
    paddingRight: heightPercentageToDP("2%"),
    paddingTop: -heightPercentageToDP("1%"),
    alignSelf:'flex-end',
    fontSize: RFValue(10),
    color: WalletColors.grey,
  },

  //Login Screen
  login_text_input: {
    width: widthPercentageToDP("70%"),
    height: heightPercentageToDP("6.5%"),
    marginTop: heightPercentageToDP("2.2%"),
    borderRadius: 20,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: WalletColors.Wblue,
    borderStyle: 'solid',
    textAlign:'center',
    justifyContent: 'center',
    alignItems: 'center',
    color: WalletColors.black,
    flex: 1, 
    fontSize: RFValue(14),
    alignSelf: 'center'
  },
  sign_button: {
    width: widthPercentageToDP("35%"),
    height: heightPercentageToDP("8%"),
    marginTop: heightPercentageToDP("6%"),
    borderRadius: 30,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: WalletColors.Wblue,
    borderStyle: 'solid',
    justifyContent: 'center',
    backgroundColor: WalletColors.Wblue,
    alignItems: 'center',
    alignSelf: 'center'
  },
  sign_button_text: {
    color: WalletColors.white,
    fontSize: RFValue(18)
  },
  logo:{
    width: windowHeight / 2 - heightPercentageToDP("37%"),
    height: windowHeight / 2 - heightPercentageToDP("37%"),
  },
  view_logo: {
    flexDirection: "column", 
    alignItems: "center", 
    marginTop: heightPercentageToDP("4%"),
  },
  view_logo_logo: {
    width: windowHeight / 2 - heightPercentageToDP("30%"),
    height: windowHeight / 2 - heightPercentageToDP("30%"),
    flex: 1,
    borderRadius: 100,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: WalletColors.Wblue,
    borderStyle: 'solid',
    marginTop: heightPercentageToDP("8%"),
    justifyContent: 'center',
    alignItems: 'center'
  },
  view_logo_logo_text: {
    fontSize: 30, 
    fontWeight: "bold", 
    textAlign: 'center'
  },
  login_view_input: {
    flexDirection: "column", 
    flex: 1, 
    textAlign:'center',
    justifyContent: 'center',
    marginTop: heightPercentageToDP("8%"),
  },

  //always use
  header:{
    flex:1,
    backgroundColor: Colors.white
  },
  total: {
    flex:1,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  total_text: {
    fontSize: RFValue(13),
    fontWeight: "bold"
  },

  //Create Message Screen
  message_nav_top:{
    flex:2.4, 
    alignSelf:"center",
  },
  message_quick_insert:{
    marginTop: heightPercentageToDP("3%"),
    alignSelf:"center",
  },
  create_message_body: {
    flex:3.55,
    backgroundColor: Colors.white,
    flexDirection: 'column',
    alignItems: "center",
  },
  sumbit_button: {
    width: widthPercentageToDP("30%"),
    height: heightPercentageToDP("5%"),
    margin: heightPercentageToDP("1%"),
    borderRadius: 10,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: WalletColors.Wgreen,
    borderStyle: 'solid',
    justifyContent: 'center',
    backgroundColor: WalletColors.Wgreen,
    alignItems: 'center'
  },
  sumbit_confirm_text: {
    color: WalletColors.white,
    fontSize: RFValue(14),
    alignSelf: "center"
  },
  insert_button: {
    width: widthPercentageToDP("30%"),
    height: heightPercentageToDP("4%"),
    marginTop: heightPercentageToDP("-3%"),
    marginBottom: heightPercentageToDP("1%"),
    borderRadius: 8,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: WalletColors.Worange,
    borderStyle: 'solid',
    justifyContent: 'center',
    backgroundColor: WalletColors.Worange,
    alignItems: 'center',
    marginLeft: widthPercentageToDP("60%"),
  },
  insert_button_text: {
    color: WalletColors.white,
    fontSize: RFValue(14)
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  modalView: {
    margin: 0,
    backgroundColor: "white",
    borderColor: WalletColors.Wblue,
    borderStyle: 'solid',
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 20,
    padding: widthPercentageToDP("4%"),
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modal_header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center"
  },
  modal_text_input: {
    fontSize: RFValue(14),
    color: "black",
    width: widthPercentageToDP("85%"),
    height: heightPercentageToDP("25%"),
    marginTop: heightPercentageToDP("2%"),
    padding: heightPercentageToDP("1%"),
    paddingLeft: heightPercentageToDP("2%"),
    paddingRight: heightPercentageToDP("2%"),
    borderColor: WalletColors.Wblue,
    borderRadius: 15,
    borderStyle: 'solid',
    borderWidth: StyleSheet.hairlineWidth,
  },
  confirm: {
    width: widthPercentageToDP("30%"),
    height: heightPercentageToDP("5%"),
    marginTop: heightPercentageToDP("1%"),
    borderRadius: 10,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: WalletColors.Wgreen,
    borderStyle: 'solid',
    justifyContent: 'center',
    backgroundColor: WalletColors.Wgreen,
    alignSelf: "center",
  },
  modal_title: {
    alignSelf: "center",
    marginLeft: heightPercentageToDP("0.8%"),
    color: WalletColors.black,
    fontSize: RFValue(18),
    fontWeight: "bold"
  },
  modal_close: {
    alignSelf: "flex-end",
    color: WalletColors.black,
    textAlign: "center",
    marginTop:-heightPercentageToDP("4%")
  },

  //Deposit & Withdrawel & today Screen
  admin_deposit_withdrawel_header:{
    flex:0.64,
  },
  deposit_withdrawel_today_nav_top:{
    flex:2.4, 
    flexDirection:"row", 
    alignSelf:"center",
  },
  deposit_withdrawel_treport_body: {
    flex:3.8,
    backgroundColor: Colors.white,
    flexDirection: 'column',
    alignItems: "center",
  },
  admin_deposit_withdrawel_nav_top: {
    flex:1.35, 
    flexDirection:"row", 
    alignSelf:"center",
  },
  client_ss_picker: {
    width: widthPercentageToDP("30%"),
  },
  client_ss_dropdownpicker: {
    width: widthPercentageToDP("30%"),
    height: heightPercentageToDP("5%")
  },
  client_ms_picker: {
    width: widthPercentageToDP("35%"),
  },
  client_ms_dropdownpicker: {
    width: widthPercentageToDP("35%"),
    height: heightPercentageToDP("5%")
  },
  client_ls_picker: {
    width: widthPercentageToDP("39%"),
  },
  client_ls_dropdownpicker: {
    width: widthPercentageToDP("39%"),
    height: heightPercentageToDP("5%")
  },
  picker_ss_admin: {
    flex:0.41,
    marginBottom:heightPercentageToDP("0.5%"), 
    flexDirection: "row",
    alignItems: "center",
    marginRight: widthPercentageToDP("6%"), 
    marginLeft: widthPercentageToDP("6%"),
  },
  picker_ms_admin: {
    flex:0.47, 
    flexDirection: "row",
    alignItems: "center",
    marginRight: widthPercentageToDP("6%"), 
    marginLeft: widthPercentageToDP("6%"),
  },
  picker_ls_admin: {
    flex:0.51,
    flexDirection: "row",
    alignItems: "center",
    marginRight: widthPercentageToDP("6%"), 
    marginLeft: widthPercentageToDP("6%"),
  },
  status_row_container: {
    flexDirection: "row"
  },
  status_agent_user_row_container: {
    flexDirection: "row",
    marginTop: -heightPercentageToDP("2%"),
  },
  status_row: {
    flexDirection: "row",
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
    transform: [{ scaleX: 0.55 }, { scaleY: 0.55 }],
    marginLeft: widthPercentageToDP("-2%"),
    marginRight: widthPercentageToDP("1.5%"),
  },
  label: {
    marginTop: widthPercentageToDP("-1%"),
    marginLeft: widthPercentageToDP("1.8%"),
    fontSize: RFValue(14)
  },
  agent_container: {
    marginBottom:heightPercentageToDP("1%"),
    marginTop:-heightPercentageToDP("0.5%")
  },
  view_deposit_withdrawel_treport_rectangle: {
    flex:10,
    flexDirection: "column",
    alignItems: "center",
    borderRadius: 20,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: WalletColors.Wblue,
    borderStyle: 'solid',
    justifyContent: "flex-start",
    width: widthPercentageToDP("90%"),
    padding: heightPercentageToDP("1%"),
  },

  //TableRow
  text_cell_wred: {
    fontSize: RFValue(13), 
    color: WalletColors.Wred
  },
  text_cell_wgreen: {
    fontSize: RFValue(13), 
    color: WalletColors.Wgreen
  },
  text_cell_wblack: {
    fontSize: RFValue(13), 
    color: WalletColors.black
  },

  //TableRow && TableRowDeposit && TableRowWithdrawal
  table_view_column: {
    flexDirection: "column", 
    margin:heightPercentageToDP("0.5%")
  },
  table_view_rectangle: {
    flex:1,
    flexDirection: "row", 
    alignItems: "center",
    borderRadius: 1,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: WalletColors.Wblue,
    borderStyle: 'solid',
    justifyContent: "flex-start",
    alignContent: "space-between",
    width: widthPercentageToDP("85%"),
  },
  table_view_left: {
    flex: 1/4,
    alignItems: "flex-start",
    justifyContent: "center",
  },
  table_view_center: {
    flex: 2/4,
    alignItems: "flex-start",
    justifyContent: "center",
  },
  table_view_right: {
    flex: 1/4,
    alignItems: "flex-end",
    justifyContent: "center",
  },
  text_input: {
    width: heightPercentageToDP("10%"),
    height: heightPercentageToDP("3%"),
    borderRadius: 6,
    textAlign: "left",
    padding: heightPercentageToDP("0.3%"),
    paddingLeft: heightPercentageToDP("1%"),
    paddingRight: heightPercentageToDP("1%"),
    marginTop:heightPercentageToDP("0.3%"),
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: WalletColors.Wblue,
    borderStyle: 'solid',
    color: WalletColors.Wblue,
    fontSize: RFValue(12),
  },
  view_input: {
    flexDirection: "row", 
    justifyContent: "center",
    alignItems: "center",
  },
  view_lineNumber: {
    flexDirection: "column", 
    alignItems: "center",
    justifyContent: "center",
    padding: heightPercentageToDP("0.5%"),
  },
  view_lineNumber_center: {
    flexDirection: "column",
    justifyContent: "center",
    paddingTop: heightPercentageToDP("1%"),
    paddingBottom: heightPercentageToDP("0.5%"),
  },
  cell_text_input: {
    marginBottom:heightPercentageToDP("0.5%"),
    marginTop:heightPercentageToDP("0.5%"),
    fontSize: RFValue(13),
  },
  cell_text_ref: {
    marginTop:-heightPercentageToDP("0.5%"),
    fontSize: RFValue(13),
  },
  cell_text_pin: {
    marginBottom:heightPercentageToDP("0.3%"),
    fontSize: RFValue(13),
  },
  cell_text_input_colon: {
    marginTop:heightPercentageToDP("0.5%"),
    fontSize: RFValue(13),
  },
  cell_text: {
    alignSelf: "flex-start",
    textAlign: "left",
    fontSize: RFValue(13),
  },
  cell_text_value: {
    alignSelf: "flex-start",
    textAlign: "left",
    fontSize: RFValue(13),
    maxWidth: heightPercentageToDP("10%"),
  },
  cell_text_header: {
    alignSelf: "flex-start",
    fontSize: RFValue(11),
    fontWeight: "bold",
  },
  button_view: {
    flexDirection: "row",
  },
  send_button_accept: {
    width: widthPercentageToDP("9.5%"),
    height: heightPercentageToDP("3.5%"),
    marginLeft: heightPercentageToDP("1%"),
    borderRadius: 5,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: WalletColors.Wgreen,
    borderStyle: 'solid',
    justifyContent: 'center',
    backgroundColor: WalletColors.Wgreen,
    alignItems: 'center'
  },
  send_button_reject: {
    width: widthPercentageToDP("9.5%"),
    height: heightPercentageToDP("3.5%"),
    borderRadius: 5,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: WalletColors.Wred,
    borderStyle: 'solid',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: WalletColors.Wred,
  },
  send_button: {
    width: widthPercentageToDP("10%"),
    height: heightPercentageToDP("3.5%"),
    borderRadius: 5,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: WalletColors.Wgreen,
    borderStyle: 'solid',
    justifyContent: 'center',
    backgroundColor: WalletColors.Wgreen,
    alignItems: 'center'
  },
  send_button_text: {
    color: WalletColors.white,
    fontSize: RFValue(10)
  },

  //SummaryReport
  summary_report_nav_top:{
    flex:1.2, 
    flexDirection:"row", 
    alignSelf:"center"
  },
  summary_report_body: {
    backgroundColor: Colors.white,
    flex:6.4,
    flexDirection: 'column',
    alignItems: "center",
  },

  //SummaryReportTableRow
  view_summary_rectangle: {
    flexDirection: "row", 
    alignItems: "center",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: WalletColors.black,
    borderStyle: 'solid',
    justifyContent: 'center',
    alignContent: "space-between",
    width: widthPercentageToDP("85%"),
    padding:heightPercentageToDP("0.5%"),
  },
  view_summary_border_line:{
    paddingRight: heightPercentageToDP("2%"),
    borderRightWidth: StyleSheet.hairlineWidth,
    borderColor: WalletColors.Wblue,
    borderStyle: 'solid',
  },
  view_summary_left: {
    flex: 3,
    justifyContent: "space-between",
  },
  view_summary_right: {
    flex: 1,
    paddingRight:heightPercentageToDP("0.5%"),
    alignItems: "center",
    justifyContent: "center",
  },
  view_summary_lineNumber: {
    flexDirection: "column",
    justifyContent: "center",
    margin: widthPercentageToDP("1%"),
  },
  view_sub_row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start"
  },
  view_sub_sub_row: {
    flexDirection: "row",
    alignSelf: "flex-start",
  },
  view_sub_column: {
    flex:1,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center"
  },
  cell_text_start: {
    fontSize: RFValue(11),
    alignSelf: "flex-start",
  },
  cell_text_center: {
    fontSize: RFValue(11),
    alignSelf: "center",
  },
  cell_text_end: {
    fontSize: RFValue(11),
    alignSelf: "flex-end",
  },
  cell_summary_text_header: {
    fontSize: RFValue(12),
    fontWeight: "bold",
    textAlign: "center",
  },
  cell_text_bold_end: {
    fontSize: RFValue(11),
    fontWeight: "bold",
    alignSelf: "flex-end",
  },
  cell_text_bold_center: {
    fontSize: RFValue(11),
    fontWeight: "bold",
    alignSelf: "center",
    flex:2,
  },
  cell_text_bold_center_sub: {
    fontSize: RFValue(11),
    fontWeight: "bold",
    alignSelf: "center",
    flex:0.5,
  },
  cell_text_bold_start: {
    fontSize: RFValue(11),
    fontWeight: "bold",
    alignSelf: "flex-start",
    flex:2,
  },
  cell_text_bold: {
    fontSize: RFValue(11),
    fontWeight: "bold",
    alignSelf: "flex-start",
  },

  //MessageBlock
  view_message_rectangle: {
    flexDirection: "row", 
    alignItems: "center",
    borderRadius: 10,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: WalletColors.Wblue,
    borderStyle: 'solid',
    justifyContent: 'center',
    margin: heightPercentageToDP("0.5%"),
    padding: heightPercentageToDP("0.2%"),
    width: widthPercentageToDP("90%"),
    flex:1,
  },
  view_message_left: {
    flex: 0.3,
    alignItems: "flex-end",
    justifyContent: "flex-end",
  },
  view_message_right: {
    flex: 3.5,
    alignItems: "flex-start",
    justifyContent: "flex-start",
  },
  view_message_dot:{
    fontSize: RFValue(13),
  },
  view_message_text:{
    fontSize: RFValue(13),
    margin: heightPercentageToDP("1%"),
  },
  text_message_input: {
    width: widthPercentageToDP("45%"),
    height: heightPercentageToDP("4%"),
    padding: heightPercentageToDP("0.5%"),
    paddingLeft: heightPercentageToDP("1.5%"),
    paddingRight: heightPercentageToDP("1.5%"),
    borderRadius: 20,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: WalletColors.Wblue,
    borderStyle: 'solid',
    justifyContent: 'center', 
    alignItems: 'center',
    color: WalletColors.Wblue,
    fontSize: RFValue(12),
  },
  view_message_input_label:{
    flex: 0.5, 
    flexDirection:"column",
  },
  view_message_input_box:{
    flex: 1, 
    flexDirection:"column",
    marginRight:heightPercentageToDP("3%")
  },
  view_message_lineNumber: {
    flex: 1, 
    alignItems: "center",
    justifyContent: "center",
  },

  //CustomHeader
  view_header_root: {
    flexDirection: "row", 
    flex: 1,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: WalletColors.Wblue,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  header_text: {
    fontSize: RFValue(16), 
    fontWeight: 'bold', 
    color: WalletColors.Wblue, 
    justifyContent: 'center', 
    marginRight: widthPercentageToDP('18%')
  },

  //CommonTop
  view_root: {
    flexDirection: "column", 
    flex: 1, 
    alignItems: "center",
  },
  view_root_admin: {
    flexDirection: "column", 
    flex: 1, 
    alignItems: "center", 
  },
  view_top_button: {
    flexDirection: "row", 
    flex: 1,
    justifyContent: "space-evenly",
  },
  view_bottom_button: {
    flexDirection: "row", 
    flex: 1,
    justifyContent: "space-evenly",
  },
  left_button: {
    width: widthPercentageToDP("30%"),
    height: heightPercentageToDP("4%"),
    borderRadius: 20,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: WalletColors.Wblue,
    borderStyle: 'solid',
    justifyContent: 'center',
    backgroundColor: WalletColors.white,
    alignItems: 'center',
    marginTop: widthPercentageToDP("2.5%"),
    marginRight: widthPercentageToDP("2%")
  },
  left_button_focus: {
    width: widthPercentageToDP("30%"),
    height: heightPercentageToDP("4%"),
    borderRadius: 20,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: WalletColors.Wblue,
    borderStyle: 'solid',
    justifyContent: 'center',
    backgroundColor: WalletColors.Wblue,
    alignItems: 'center',
    marginTop: widthPercentageToDP("2.5%"),
    marginRight: widthPercentageToDP("2%")
  },
  right_button: {
    width: widthPercentageToDP("30%"),
    height: heightPercentageToDP("4%"),
    borderRadius: 20,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: WalletColors.Wblue,
    borderStyle: 'solid',
    justifyContent: 'center',
    backgroundColor: WalletColors.white,
    alignItems: 'center',
    marginTop: widthPercentageToDP("2.5%"),
    marginLeft: widthPercentageToDP("2%")
  },
  right_button_focus: {
    width: widthPercentageToDP("30%"),
    height: heightPercentageToDP("4%"),
    borderRadius: 20,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: WalletColors.Wblue,
    borderStyle: 'solid',
    justifyContent: 'center',
    backgroundColor: WalletColors.Wblue,
    alignItems: 'center',
    marginTop: widthPercentageToDP("2.5%"),
    marginLeft: widthPercentageToDP("2%")
  },
  button_text_focus: {
    fontSize: RFValue(15),
    color: WalletColors.white,
  },
  button_text: {
    fontSize: RFValue(15),
    color: WalletColors.Wblue,
  },
  wal_left_button: {
    width: widthPercentageToDP("28%"),
    height: heightPercentageToDP("4%"),
    borderRadius: 10,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: WalletColors.Wblue,
    borderStyle: 'solid',
    justifyContent: 'center',
    backgroundColor: WalletColors.white,
    alignItems: 'center',
    margin: widthPercentageToDP("1%"),
  },
  wal_left_button_focus: {
    width: widthPercentageToDP("28%"),
    height: heightPercentageToDP("4%"),
    borderRadius: 10,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: WalletColors.Wblue,
    borderStyle: 'solid',
    justifyContent: 'center',
    backgroundColor: WalletColors.Wblue,
    alignItems: 'center',
    margin: widthPercentageToDP("1%"),
  },
  wal_mid_button: {
    width: widthPercentageToDP("28%"),
    height: heightPercentageToDP("4%"),
    borderRadius: 10,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: WalletColors.Wblue,
    borderStyle: 'solid',
    justifyContent: 'center',
    backgroundColor: WalletColors.white,
    alignItems: 'center',
    margin: widthPercentageToDP("1%"),
  },
  wal_mid_button_focus: {
    width: widthPercentageToDP("28%"),
    height: heightPercentageToDP("4%"),
    borderRadius: 10,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: WalletColors.Wblue,
    borderStyle: 'solid',
    justifyContent: 'center',
    backgroundColor: WalletColors.Wblue,
    alignItems: 'center',
    margin: widthPercentageToDP("1%"),
  },
  wal_right_button: {
    width: widthPercentageToDP("28%"),
    height: heightPercentageToDP("4%"),
    borderRadius: 10,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: WalletColors.Wblue,
    borderStyle: 'solid',
    justifyContent: 'center',
    backgroundColor: WalletColors.white,
    alignItems: 'center',
    margin: widthPercentageToDP("1%"),
  },
  wal_right_button_focus: {
    width: widthPercentageToDP("28%"),
    height: heightPercentageToDP("4%"),
    borderRadius: 10,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: WalletColors.Wblue,
    borderStyle: 'solid',
    justifyContent: 'center',
    backgroundColor: WalletColors.Wblue,
    alignItems: 'center',
    margin: widthPercentageToDP("1%"),
  },
  spinnerTextStyle: {
    color: WalletColors.Wblue,
  },
  badgeStyle: {
    position: 'absolute', 
    top: -10, 
    right: -5
  }
});

export default styles