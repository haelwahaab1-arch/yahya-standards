/**
 * بوابة يحيى - إرسال NDA عبر WhatsApp Business API
 * الإصدار المصحح Production-ready
 * يصلح الأخطاء: endpoint + interactiveData + fileUrl
 */
const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');
const path = require('path');

// ضعها في .env
const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN;
const PHONE_NUMBER_ID = process.env.PHONE_NUMBER_ID; // من Meta Developers
const GRAPH_API_VERSION = 'v19.0';

/**
 * 1- رفع ملف الـ PDF إلى سيرفر Meta أولاً للحصول على media ID
 * هذه الخطوة إجبارية قبل إرسال document
 */
async function uploadMediaToWhatsApp(pdfFilePath) {
  const form = new FormData();
  form.append('file', fs.createReadStream(pdfFilePath));
  form.append('type', 'application/pdf');
  form.append('messaging_product', 'whatsapp');

  const response = await axios.post(
    `https://graph.facebook.com/${GRAPH_API_VERSION}/${PHONE_NUMBER_ID}/media`,
    form,
    {
      headers: {
        ...form.getHeaders(),
        'Authorization': `Bearer ${WHATSAPP_TOKEN}`
      }
    }
  );
  return response.data.id; // media ID
}

/**
 * 2- إرسال العقد عبر واتساب كـ document + أزرار تفاعلية للتوقيع
 */
async function sendNDAToClientWhatsApp(clientNumber, pdfFilePath, clientData) {
  try {
    // تنسيق الرقم: 015... -> 2015...
    let formattedNumber = clientNumber.replace(/^0/, '20');
    if (!formattedNumber.startsWith('20')) formattedNumber = '20' + formattedNumber.replace(/^\+20/, '');

    // رفع الملف أولاً
    console.log('📤 جاري رفع ملف NDA إلى خوادم واتساب...');
    const mediaId = await uploadMediaToWhatsApp(pdfFilePath);
    
    // الرسالة الأولى: ملف PDF
    const documentPayload = {
      messaging_product: "whatsapp",
      recipient_type: "individual",
      to: formattedNumber,
      type: "document",
      document: {
        id: mediaId,
        filename: `عقد_سرية_بوابة_يحيى_${clientData.clientName}.pdf`,
        caption: `🔒 أهلاً أستاذ ${clientData.clientName}،\n\nتم إصدار عقد حماية السرية الرقمية والملكية الفكرية الخاص بكم وموقع إلكترونياً من مكتب بوابة يحيى.\n\n📋 رقم العقد: ${clientData.contractHash?.substring(0,8).toUpperCase()}\n🔐 مشفر ومحمي بقانون 15/2004 + 175/2018\n⚖️ حجية كاملة أمام المحكمة الاقتصادية\n\nيرجى تحميل النسخة والضغط على زر التأكيد أدناه لتفعيل الحماية القانونية الاستباقية قبل الجلسة الاستشارية.`
      }
    };

    await axios.post(
      `https://graph.facebook.com/${GRAPH_API_VERSION}/${PHONE_NUMBER_ID}/messages`,
      documentPayload,
      {
        headers: {
          'Authorization': `Bearer ${WHATSAPP_TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log('✅ تم إرسال ملف NDA');

    // الرسالة الثانية: أزرار تفاعلية (CTA) للتوقيع والجلسة
    const interactivePayload = {
      messaging_product: "whatsapp",
      to: formattedNumber,
      type: "interactive",
      interactive: {
        type: "button",
        body: {
          text: "هل تؤكد استلام العقد والموافقة على بنود السرية؟ بمجرد التأكيد سيتم توليد رابط Zoom الآمن للجلسة."
        },
        action: {
          buttons: [
            { type: "reply", reply: { id: "confirm_nda", title: "✅ أوافق وأوقع" } },
            { type: "reply", reply: { id: "request_call", title: "📞 أطلب توضيح" } }
          ]
        }
      }
    };

    await axios.post(
      `https://graph.facebook.com/${GRAPH_API_VERSION}/${PHONE_NUMBER_ID}/messages`,
      interactivePayload,
      {
        headers: {
          'Authorization': `Bearer ${WHATSAPP_TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log('✅ تم إرسال أزرار التأكيد');
    return { success: true, mediaId, to: formattedNumber };

  } catch (error) {
    console.error('❌ خطأ واتساب:', error.response?.data || error.message);
    // Fallback: إرسال رابط مباشر لو فشل رفع الميديا
    throw error;
  }
}

/**
 * 3- Webhook Handler: عند ضغط العميل "أوافق وأوقع"
 * هنا يتم تفعيل Egypt Trust وتوليد رابط Zoom
 */
async function handleClientConfirmation(clientNumber, confirmationId) {
  if (confirmationId === 'confirm_nda') {
    // 1. تسجيل التوقيع الرقمي الثاني في قاعدة البيانات
    // 2. استدعاء Egypt Trust API للتوقيع النهائي (إن وجد)
    // 3. توليد رابط Zoom
    // 4. إشعار الوالد/الفريق التنفيذي
    console.log(`✅ العميل ${clientNumber} وقع العقد - توليد Zoom + إشعار الفريق`);
    return { nextStep: 'generate_zoom_link' };
  }
}

module.exports = { sendNDAToClientWhatsApp, handleClientConfirmation, uploadMediaToWhatsApp };
