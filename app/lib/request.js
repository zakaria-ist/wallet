// import axios from "axios";
// import * as Localization from "expo-localization";

const authUrl = "https://kenny.hoelee.com/wp-json/hoeleeapi/v1/authentication";
const loginUrl = "https://kenny.hoelee.com/wp-json/hoeleeapi/v1/readWallets";

class Request {
  getAuthUrl() {
    return authUrl;
  }
  getLoginUrl() {
    return loginUrl;
  }
  async get(url) {
    const rawResponse = await fetch(url, {
      method: 'GET',
    });
    return(await rawResponse.json())
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