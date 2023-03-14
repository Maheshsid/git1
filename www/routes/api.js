const { application } = require("express");
const express = require("express");
const router = express.Router();

const Api = new (require('../controllers/Api'))();

router.get('/api', async (req,res) => {
    res.send("Freshbooks Bot Api")
});

router.get('/api/version', async (req,res) => {
    res.send(await Api.getVersion())
});

router.get('/api/auth_callback', async (req,res) => {
    console.log(req.query)

    let ret = await Api.callbackAuthCode(req.query.code)

    res.send(ret)
});

router.get('/get_all_accounts', async (req,res) => {
    res.send(await Api.getAllAccounts())
});

router.get('/clear_all_accounts', async (req,res) => {
    res.send(await Api.clearAllAccounts())
});

router.post('/update_account', async (req,res) => {
    res.send(await Api.updateAccount(req.body))
});

module.exports = router;