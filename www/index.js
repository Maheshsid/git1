const fs = require('fs');
const http = require('http');
const https = require('https');
const express = require("express");
const cors = require("cors");
const app = express();

const privateKey = fs.readFileSync('/etc/letsencrypt/live/webrefund.store/privkey.pem', 'utf8');
const certificate = fs.readFileSync('/etc/letsencrypt/live/webrefund.store/cert.pem', 'utf8');
const ca = fs.readFileSync('/etc/letsencrypt/live/webrefund.store/chain.pem', 'utf8');

const credentials = {
	key: privateKey,
	cert: certificate,
	ca: ca
};

const apiRoutes = require('./routes/api');

const urlencoded = require('body-parser').urlencoded;
function requireHTTPS(req, res, next) {
  if (!req.secure)
	// the statement for performing our redirection
	return res.redirect('https://' + req.headers.host + req.url);
else
	return next();
}
app.use(requireHTTPS);
app.use(urlencoded({ extended: false }));

app.use(express.json());
app.use(cors());
app.use(apiRoutes);

app.get('/', async (req,res) => {
    res.send("Unauthorized")
});

// Starting both http & https servers
const httpServer = http.createServer(app);
const httpsServer = https.createServer(credentials, app);

httpServer.listen(80, () => {
	console.log('HTTP Server running on port 80');
});

httpsServer.listen(443, () => {
	console.log('HTTPS Server running on port 443');
});