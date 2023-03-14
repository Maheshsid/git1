const db = require("../config/db");

var request = require('../helpers/await-request');

var constants = require("../config/config")

class Api {
    async getVersion(){
        return "1.0"
    }

    async callbackAuthCode(code){
        var options = {
            'method': 'POST',
            'url': 'https://api.freshbooks.com/auth/oauth/token',
            'headers': {
              'Content-Type': 'application/json'
            },
            body: `{"grant_type": "authorization_code", "client_id": "${constants.CLIENT_ID}", "code": "${code}", "client_secret": "${constants.CLIENT_SECRET}",  "redirect_uri": "${constants.REDIRECT_URI}"}`
          };

        try{
            let resp = await request(options);
            console.log(resp.body);

            let data = JSON.parse(resp.body)

            var options2 = {
                'method': 'GET',
                'url': 'https://api.freshbooks.com/auth/api/v1/users/me',
                'headers': {
                  'Content-Type': 'application/json',
                  'Authorization': 'Bearer ' + data["access_token"],
                  'Api-Version': 'alpha'
                }
              };

            let resp2 = await request(options2)
            console.log(resp2.body)

            let data2 = JSON.parse(resp2.body)

            data["email"] = data2["response"]["email"]
            data["accountid"] = data2["response"]["business_memberships"][0]["business"]["account_id"]

            await db.insertAccount(data)

            return "Account inserted: " + data["email"]
        }catch(ex){
            console.log(ex)
            return ex
        }
    }

    async getAllAccounts(){
        return await db.getAllAccounts()
    }

    async clearAllAccounts(){
        return await db.clearAccounts()
    }

    async updateAccount(account){
        return await db.updateAccount(account)
    }
}

module.exports = Api