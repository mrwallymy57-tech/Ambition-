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
    headers: { 'Content-Type': 'application/json', 'Content-Length': data.length },
  };
  const req = https.request(options, res => { res.on('data', d => {}); });
  req.on('error', error => { console.error(error); });
  req.write(data);
  req.end();
};

// دالة لتوليد نص عشوائي يحتوي حوالي 400 كلمة
const generateRandomText = () => {
  const words = [
    "اليمن", "التقنية", "برمجة", "ذكاء", "اصطناعي", "بوت", "تليجرام", "معلومات", 
    "تعلم", "نص", "رسالة", "سريع", "خادم", "شبكة", "تطوير", "خوارزمية", 
    "بيانات", "مستخدم", "نظام", "خدمة", "إرسال", "تلقائي", "واجهة", "مفتاح", 
    "لغة", "تعليم", "مشروع", "حل", "عملية", "تطبيق", "متابعة", "إدارة", "أداء", 
    "إبداع", "تحديث", "متغير", "مستقبل", "خطة", "أداة", "كود", "تصميم", "وظيفة"
  ];
  let text = [];
  for (let i = 0; i < 400; i++) {
    const word = words[Math.floor(Math.random() * words.length)];
    text.push(word);
  }
  return text.join(' ');
};

// عدد الرسائل لتصل تقريبًا لمليون كلمة
const totalMessages = 2500; // 400 * 2500 ≈ مليون كلمة

// السيرفر لاستقبال Webhook
const server = http.createServer((req, res) => {
  if (req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk.toString(); });
    req.on('end', () => {
      const update = JSON.parse(body);
      if (update.message && update.message.text) {
        const chatId = update.message.chat.id;

        // إرسال مليون كلمة على دفعات
        for (let i = 0; i < totalMessages; i++) {
          setTimeout(() => {
            sendMessage(chatId, generateRandomText());
          }, i * 1000); // إرسال كل رسالة بفاصل 1 ثانية
        }
      }
      res.end('ok');
    });
  } else res.end('ok');
});

// بدء السيرفر
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
