# بوابة يحيى - منظومة NDA الأوتوماتيكية - دليل النشر Live

## 1- المتطلبات على سيرفرك (Ubuntu)
```bash
sudo apt update
sudo apt install nodejs npm nginx certbot python3-certbot-nginx
node -v # يجب أن يكون 18+
```

## 2- رفع المشروع
```bash
scp -r yahya-deploy/* user@YOUR_SERVER_IP:/home/user/yahya/
ssh user@YOUR_SERVER_IP
cd /home/user/yahya
npm install
```

## 3- إعداد .env
```bash
cp .env.example .env
nano .env
# ضع WHATSAPP_TOKEN الحقيقي من Meta Developers
# ضع PHONE_NUMBER_ID
# غيّر VERIFY_TOKEN لشيء معقد
```

## 4- الحصول على WHATSAPP_TOKEN و PHONE_NUMBER_ID
1. ادخل https://developers.facebook.com
2. My Apps > Create App > Business > WhatsApp
3. من WhatsApp > API Setup:
   - انسخ Temporary Token (24 ساعة) للتجربة أو Permanent Token من System Users
   - انسخ Phone number ID
4. من Webhook > Edit > ضع:
   - Callback URL: https://yourdomain.com/webhook
   - Verify Token: نفس اللي في .env
   - Subscribe to: messages
5. اضغط Verify and Save

## 5- تشغيل بـ PM2
```bash
sudo npm install -g pm2
pm2 start server.js --name yahya-nda
pm2 startup
pm2 save
pm2 logs yahya-nda
```

## 6- Nginx Reverse Proxy + SSL
```nginx
server {
  server_name yourdomain.com;
  location / {
    proxy_pass http://localhost:3000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
  }
  location /webhook {
    proxy_pass http://localhost:3000/webhook;
  }
}
```
ثم:
```bash
sudo certbot --nginx -d yourdomain.com
```

## 7- اختبار Live
```bash
curl -X POST https://yourdomain.com/api/generate-nda   -H "Content-Type: application/json"   -d '{
    "clientName": "أحمد المبتكر",
    "clientNumber": "01555086702",
    "clientRole": "individual",
    "projectIdea": "تطبيق ذكاء اصطناعي للعدالة"
  }'
```

سيصلك واتساب فوراً على رقمك 01555086702 بالعقد PDF + أزرار التوقيع.

## 8- تفعيل Egypt Trust (اختياري للمرحلة 2)
ضع شهادة Egypt Trust في ./certs/egypt-trust.p12
وعدل generateNDA.js لاستدعاء API الخاصة بهم للتوقيع النهائي.

---
وزنوا بالقسطاس المستقيم - بوابة يحيى
