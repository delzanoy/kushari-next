const fetch = require('node-fetch');
fetch('https://cmcserver-gifu.onrender.com/wallets').then(r => r.json()).then(data => {
  console.log(JSON.stringify(data[0].proposals[0], null, 2));
}).catch(console.error);
