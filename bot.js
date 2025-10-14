const https = require('https');
const http = require('http');

// ⚠️ ضع توكن بوتك الحقيقي هنا (احصل عليه من @BotFather)
const TOKEN = '8495141045:AAH53qINpdbCTTkhOKEu1OP7Eao7AlApsEU'; // ← غيّر هذا إلى توكنك!

// تأكد من أن التوكن غير فارغ
if (TOKEN === 'YOUR_BOT_TOKEN_HERE' || !TOKEN.includes(':')) {
    console.error('❌ خطأ: يرجى وضع توكن بوتك الحقيقي بدلاً من "YOUR_BOT_TOKEN_HERE"');
    process.exit(1);
}

const PORT = process.env.PORT || 3000;
const TELEGRAM_API = `https://api.telegram.org/bot${TOKEN}`; // ✅ بدون مسافة

function sendMessage(chat_id, text) {
    const data = JSON.stringify({ chat_id, text });
    const req = https.request(`${TELEGRAM_API}/sendMessage`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(data)
        }
    });
    req.on('error', (e) => console.error('فشل الإرسال:', e.message));
    req.write(data);
    req.end();
}

function handleUpdate(update) {
    if (!update.message?.text) return;
    const { id: chatId } = update.message.chat;
    const text = update.message.text.trim();
    sendMessage(chatId, `لقد أرسلت: "${text}"\n🤖 رد تلقائي من بوتي!`);
}

const server = http.createServer((req, res) => {
    if (req.method === 'POST') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', () => {
            try {
                handleUpdate(JSON.parse(body));
                res.writeHead(200);
                res.end('OK');
            } catch (e) {
                res.writeHead(400);
                res.end('Bad Request');
            }
        });
    } else {
        res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end(`✅ البوت يعمل!\nالمنفذ: ${PORT}\n\n⚠️ تأكد من استضافته خارج نيبال لأن api.telegram.org محظور هناك.`);
    }
});

server.listen(PORT, () => {
    console.log(`🚀 البوت يعمل على المنفذ ${PORT}`);
    console.log(`🔗 بعد النشر، نفّذ هذا الأمر لضبط Webhook:`);
    console.log(`curl "https://api.telegram.org/bot${TOKEN}/setWebhook?url=https://your-deploy-url.com"`);
});
