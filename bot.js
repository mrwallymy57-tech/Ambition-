const http = require('http');
const https = require('https');

const PORT = process.env.PORT || 3000;
const TOKEN = '7983988659:AAHkUSkpyisj2KXtfZdax1hCJB9lWwS7CHI'; // التوكن الخاص بك

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
  req.on('error', error => { console.error(error); });
  req.write(data);
  req.end();
};

// دالة لتوليد رد تلقائي (يمكنك تعديل النص هنا)
const generateReply = (text) => {
  return `لقد أرسلت: "${text}" 👌`;
};

// السيرفر لاستقبال Webhook من تلغرام
const server = http.createServer((req, res) => {
  if (req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk.toString(); });
    req.on('end', () => {
      try {
        const update = JSON.parse(body);
        if (update.message && update.message.text) {
          const chatId = update.message.chat.id;
          const userText = update.message.text;

          // إرسال الرد التلقائي
          const replyText = generateReply(userText);
          sendMessage(chatId, replyText);
        }
      } catch (e) {
        console.error('Error parsing update:', e);
      }
      res.end('ok');
    });
  } else {
    res.end('ok');
  }
});

// بدء السيرفر
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
