// import axios from "axios";
// import * as Localization from "expo-localization";

const authUrl = "https://kenny.hoelee.com/wp-json/hoeleeapi/v1/authentication";


class Request {
  getAuthUrl() {
    return authUrl;
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


// (async () => {
//   const auth_url = "https://kenny.hoelee.com/wp-json/hoeleeapi/v1/authentication";
//   const rawResponse = await fetch(auth_url, {
//     method: 'POST',
//     headers: {
//       'Accept': 'application/json',
//       'Content-Type': 'application/json'
//     },
//     body: JSON.stringify({username: userName, password: password})
//   });
//   const content = await rawResponse.json();
//   console.log(content);
// })();