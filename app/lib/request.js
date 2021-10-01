// import axios from "axios";
// import * as Localization from "expo-localization";

const authUrl = "https://kenny.hoelee.com/wp-json/hoeleeapi/v1/authentication";
const walletUrl = "https://kenny.hoelee.com/wp-json/hoeleeapi/v1/readWallets";
const adminClientListUrl = "https://kenny.hoelee.com/wp-json/hoeleeapi/v1/adminListClients";
const subAdminClientListUrl = "https://kenny.hoelee.com/wp-json/hoeleeapi/v1/subAdminListClients";
const clientUserListUrl = "https://kenny.hoelee.com/wp-json/hoeleeapi/v1/clientListOwnUsers";
const agentUserListUrl = "https://kenny.hoelee.com/wp-json/hoeleeapi/v1/agentListOwnUsers";
const userSendMessageUrl = "https://kenny.hoelee.com/wp-json/hoeleeapi/v1/userSendMessage";
const pushNotificationUrl = "https://kenny.hoelee.com/wp-json/hoeleeapi/v1/pushNotification";
const agentReplyMessageUrl = "https://kenny.hoelee.com/wp-json/hoeleeapi/v1/agentReplyMessage";
const allMessageUrl = "https://kenny.hoelee.com/wp-json/hoeleeapi/v1/readMessages";

class Request {
  getAuthUrl() {
    return authUrl;
  }
  getWalletUrl() {
    return walletUrl;
  }
  getAdminClientListUrl() {
    return adminClientListUrl;
  }
  getSubAdminClientListUrl() {
    return subAdminClientListUrl;
  }
  getClientUserListUrl() {
    return clientUserListUrl;
  }
  getAgentUserListUrl() {
    return agentUserListUrl;
  }
  getUserSendMessageUrl() {
    return userSendMessageUrl;
  }
  getPushNotificationUrl() {
    return pushNotificationUrl;
  }
  getAgentReplyMessageUrl() {
    return agentReplyMessageUrl;
  }
  getAllMessageUrl() {
    return allMessageUrl;
  }
  async get(url) {
    const response = await fetch(url, {
      method: 'GET',
    })
    return(await response.json())
  }
  async post(url, body) {
    const rawResponse = await fetch(url, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: body
    });
    return(await rawResponse.json())
  }
} 


export default Request;