// bot.js - بوت رد تلقائي حقيقي (Node.js)
const https = require('https');

// --- إعدادات البوت ---
const TOKEN = '8495141045:AAH53qINpdbCTTkhOKEu1OP7Eao7AlApsEU'; // التوكن الجديد
const PORT = process.env.PORT || 3000;
const TELEGRAM_API = `https://api.telegram.org/bot${TOKEN}`;

// --- دالة لإرسال الرسائل ---
function sendMessage(chat_id, text) {
    const data = JSON.stringify({ chat_id, text });
    const url = `${TELEGRAM_API}/sendMessage`;
    const req = https.request(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': data.length
        }
    });
    req.write(data);
    req.end();
}

// --- دالة لتلقي التحديثات من Telegram webhook ---
function handleUpdate(update) {
    if (!update.message) return;
    const chatId = update.message.chat.id;
    const text = update.message.text;

    // --- الرد التلقائي ---
    let reply = "مرحبا! هذا رد تلقائي: " + text;
    
    // أمثلة على الردود الذكية
    if (text.toLowerCase().includes("مرحبا")) {
        reply = "أهلاً وسهلاً! كيف حالك اليوم؟";
    } else if (text.toLowerCase().includes("كيف حالك")) {
        reply = "أنا بخير، شكراً لسؤالك 😊";
    }

    sendMessage(chatId, reply);
}

// --- سيرفر بسيط لاستقبال Webhook ---
const { createServer } = require('http');
createServer((req, res) => {
    if (req.method === 'POST') {
        let body = '';
        req.on('data', chunk => body += chunk.toString());
        req.on('end', () => {
            const update = JSON.parse(body);
            handleUpdate(update);
            res.writeHead(200);
            res.end('ok');
        });
    } else {
        res.writeHead(200);
        res.end('Bot is running');
    }
}).listen(PORT, () => {
    console.log(`Bot is running on port ${PORT}`);
    console.log(`Set your webhook with:`);
    console.log(`${TELEGRAM_API}/setWebhook?url=https://YOUR_DOMAIN_OR_RENDER_URL/${TOKEN}`);
});
