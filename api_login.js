describe('API Tests', () => {
  it('should login and get user info', () => {
    const loginUrl = 'https://qa-api.xxxxxxxxx.com/v6/secm/oam/oauth2/token';
    const userInfoUrl = 'https://qa-api.xxxxxxxx.com/v5/secm/user?appName=DCM';

    const loginPayload = {
      "grant_type": "password",
      "scope": "security",
      "username": "xxxxxxxx@yyyy.com",
      "password": "zzzzzzzz",
      "app_name": "DCM",
      "userInformation": "false",
      "include": "userinfo,profile,applications,roles,customers,oldVersion",
      "consent": {
        "consent": {
          "stamp": "====================================================",
          "necessary": true,
          "preferences": true,
          "statistics": true,
          "marketing": true,
          "method": "explicit"
        },
        "consentUTC": "2024-07-16T09:27:06.866Z"
      }
    };

    const loginHeaders = {
      'accept': 'text/plain, */*',
      'accept-language': 'en_US',
      'app-code': 'DCMWebTool_App',
      'content-type': 'application/json',
      'origin': 'https://qa-loc-eu.xxxxxxxx.com',
      'priority': 'u=1, i',
      'referer': 'https://qa-loc-eu.xxxxxxxx.com/',
      'request-id': '=============================================',
      'sec-ch-ua': '"Not/A)Brand";v="8", "Chromium";v="126", "Google Chrome";v="126"',
      'sec-ch-ua-mobile': '?0',
      'sec-ch-ua-platform': '"macOS"',
      'sec-fetch-dest': 'empty',
      'sec-fetch-mode': 'cors',
      'sec-fetch-site': 'same-site',
      'sec-gpc': '1',
      'traceparent': '00-==============================================',
      'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
      'x-ibm-client-id': '===========-===-====-====-=========',
      'Cookie': 'incap_ses_1686_2976081=9XF5U0qJ90CFIJbFE+BlF9zHl2YAAAAAdzex9O+8rJtdmlNDwuI94A==; incap_ses_876_2976081=SOJNYYEtaEhvJ/2fYC0oDN3Hl2YAAAAAF5KbcZpsae2LaSAM0hS+Zg==; visid_incap_2976081=HQk7IlmeTLahRLGqaA80at3Hl2YAAAAAQUIPAAAAAACVyL89sjtONM5uMUarZdX9'
    };

    // Step 1: Login and get the token
    cy.request({
      method: 'POST',
      url: loginUrl,
      headers: loginHeaders,
      body: loginPayload
    }).then((loginResponse) => {
      expect(loginResponse.status).to.eq(200);
      const token = loginResponse.body.access_token;

      // Step 2: Use the token to get user info
      const userInfoHeaders = {
        'accept': 'application/json',
        'accept-language': 'en-US',
        'app-code': 'DCMWebTool_App',
        'authorization': `Bearer ${token}`,
        'content-type': 'application/json',
        'cookie': '==============================================',
        'jwt': '----------------------------------',
        'origin': 'https://qa-loc-eu.xxxxxxxx.com',
        'priority': 'u=1, i',
        'referer': 'https://qa-loc-eu.xxxxxxxx.com/',
        'request-id': '|======================================6',
        'sec-ch-ua': '"Not/A)Brand";v="8", "Chromium";v="126", "Google Chrome";v="126"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"macOS"',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'same-site',
        'sec-gpc': '1',
        'traceparent': '00-==============================================',
        'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
        'x-ibm-client-id': '===========-===-====-====-========='
      };

      cy.request({
        method: 'GET',
        url: userInfoUrl,
        headers: userInfoHeaders
      }).then((userInfoResponse) => {
        expect(userInfoResponse.status).to.eq(200);
        console.log(userInfoResponse.body);
      });
    });
  });
});
