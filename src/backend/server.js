const fs = require('fs');
const https = require('https');
const app = require('./app');
const PORT = process.env.PORT;

const key = fs.readFileSync('./certs/192.168.1.103-key.pem');
const cert = fs.readFileSync('./certs/192.168.1.103.pem');

https.createServer({ key, cert }, app).listen(PORT, '0.0.0.0', () => {
  console.log(`HTTPS server running on https://192.168.1.103:${PORT}`);
  console.log(
    `Swagger docs available at https://192.168.1.103:${PORT}/api-docs`
  );
});
