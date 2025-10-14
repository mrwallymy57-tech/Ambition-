// bot.js - بوت تلغرام بسيط للرد التلقائي
const https = require('https');
const http = require('http');

const TOKEN = '8495141045:AAH53qINpdbCTTkhOKEu1OP7Eao7AlApsEU'; // توكن البوت
const PORT = process.env.PORT || 3000;
const TELEGRAM_API = `https://api.telegram.org/bot${TOKEN}`;

// دالة لإرسال الرسائل
function sendMessage(chat_id, text) {
    const data = JSON.stringify({ chat_id, text });
    const req = https.request(`${TELEGRAM_API}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Content-Length': data.length }
    });
    req.write(data);
    req.end();
}

// التعامل مع أي رسالة واردة
function handleUpdate(update) {
    if (!update.message) return;
    const chatId = update.message.chat.id;
    const text = update.message.text || '';
    let reply = `لقد أرسلت: ${text}`; // الرد التلقائي البسيط
    sendMessage(chatId, reply);
}

// سيرفر بسيط لاستقبال التحديثات
http.createServer((req, res) => {
    if (req.method === 'POST') {
        let body = '';
        req.on('data', chunk => body += chunk.toString());
        req.on('end', () => {
            handleUpdate(JSON.parse(body));
            res.writeHead(200);
            res.end('ok');
        });
    } else {
        res.writeHead(200);
        res.end('البوت يعمل الآن!');
    }
}).listen(PORT, () => {
    console.log(`Bot running on port ${PORT}`);
    console.log(`اضبط الويب هوك على: ${TELEGRAM_API}/setWebhook?url=https://YOUR_RENDER_URL/${TOKEN}`);
});
