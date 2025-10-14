const express = require('express');
const https = require('https');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

const PORT = process.env.PORT || 3000;
const TOKEN = '7983988659:AAHkUSkpyisj2KXtfZdax1hCJB9lWwS7CHI';

// دالة لإرسال رسالة
const sendMessage = (chat_id, text) => {
  const data = JSON.stringify({ chat_id, text });
  const options = {
    hostname: 'api.telegram.org',
    path: `/bot${TOKEN}/sendMessage`,
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Content-Length': data.length
    },
  };
  const req = https.request(options, res => { res.on('data', () => {}); });
  req.on('error', error => console.error(error));
  req.write(data);
  req.end();
};

// دالة لتوليد رد تلقائي
const generateReply = (text) => {
  // مثال: إعادة نفس الرسالة مع كلمة مرحبًا
  return `مرحبًا! لقد أرسلت: "${text}"`;
};

// مسار Webhook
app.post('/', (req, res) => {
  const update = req.body;
  if (update.message && update.message.text) {
    const chatId = update.message.chat.id;
    const userText = update.message.text;

    // إرسال الرد التلقائي
    sendMessage(chatId, generateReply(userText));
  }
  res.send('ok');
});

// بدء السيرفر
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
