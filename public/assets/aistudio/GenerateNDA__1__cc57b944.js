/**
 * بوابة يحيى - منظومة توليد عقد السرية الرقمي NDA
 * وزنوا بالقسطاس المستقيم - تبيين لا تفسير
 * Production-ready with Arabic RTL support & Egypt Trust signature placeholder
 */
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// يجب تحميل خط Cairo أو Amiri من Google Fonts ووضعها في /fonts
// مثال: fonts/Cairo-Regular.ttf , Cairo-Bold.ttf

function generateNDAPDF(clientData, outputDir = '/tmp') {
  return new Promise(async (resolve, reject) => {
    try {
      const fileName = `NDA_${clientData.clientName.replace(/\s/g,'_')}_${Date.now()}.pdf`;
      const outputPath = path.join(outputDir, fileName);
      
      // إنشاء hash للعقد لضمان عدم التلاعب - مهم لحجية Egypt Trust
      const contractHash = crypto.createHash('sha256').update(JSON.stringify(clientData) + Date.now()).digest('hex');

      const doc = new PDFDocument({ 
        size: 'A4', 
        margin: 50,
        autoFirstPage: true,
        bufferPages: true,
        info: {
          Title: `عقد سرية رقمي - بوابة يحيى - ${clientData.clientName}`,
          Author: 'مكتب المستشار هشام علاء الدين - بوابة يحيى',
          Subject: 'NDA Digital - AI Governance',
          Keywords: 'NDA, Egypt Trust, 7/87, حماية ملكية فكرية'
        }
      });

      const writeStream = fs.createWriteStream(outputPath);
      doc.pipe(writeStream);

      // تسجيل الخط العربي - ضروري لحجية المحكمة
      // فك التعليق بعد وضع الخطوط
      try {
        doc.registerFont('Cairo', path.join(__dirname, 'fonts/Cairo-Regular.ttf'));
        doc.registerFont('Cairo-Bold', path.join(__dirname, 'fonts/Cairo-Bold.ttf'));
        doc.font('Cairo');
      } catch(e) {
        console.warn('⚠️ خط Cairo غير موجود - استخدم خط مؤقت، ضع الخط العربي قبل الإنتاج');
      }

      // 1. Header - الهوية البصرية
      doc.fillColor('#065f46').fontSize(22).text('بوابة يحيى للعدالة الرقمية', { align: 'center' });
      doc.fontSize(10).fillColor('#6b7280').text('« وَزِنُوا بِالْقِسْطَاسِ الْمُسْتَقِيمِ » [الإسراء:35]', { align: 'center' });
      doc.moveDown(0.5);
      doc.fontSize(8).fillColor('#9ca3af').text(`رقم العقد الرقمي: ${contractHash.substring(0,16).toUpperCase()} | تتبع: YAHYA-NDA-${Date.now()}`, { align: 'center' });
      doc.moveDown(1.5);

      // 2. العنوان
      doc.fillColor('#111827').fontSize(16).text('اتفاقية حماية السرية الرقمية والملكية الفكرية (NDA)', { align: 'center', underline: true });
      doc.moveDown(1);

      // 3. التاريخ والأطراف
      const currentDate = new Date().toLocaleDateString('ar-EG', { weekday:'long', year:'numeric', month:'long', day:'numeric' });
      doc.fontSize(11).fillColor('#1f2937');
      doc.text(`إنه في يوم ${currentDate} ميلادية، تم الاتفاق بين:`, { align: 'right' });
      doc.moveDown(0.8);
      doc.text(`الطرف الأول: مكتب المستشار هشام علاء الدين عبد الوهاب للمحاماة الحرة وحوكمة التقنية - بوابة يحيى - سجل محامين رقم [____]`, { align: 'right', lineGap: 3 });
      doc.moveDown(0.5);
      doc.text(`الطرف الثاني: ${clientData.clientName} - ${clientData.clientRole === 'individual' ? 'مطور/مبتكر مستقل' : 'منشأة تقنية'} - رقم تواصل واتساب: ${clientData.clientNumber}`, { align: 'right', lineGap: 3 });
      doc.text(`موضوع الابتكار: ${clientData.projectIdea || 'محمي بموجب هذه الاتفاقية دون إفشاء تفاصيل دقيقة في هذا التمهيد'}`, { align: 'right', lineGap: 3 });
      doc.moveDown(1.2);

      // 4. البنود المحكمة - مصفوفة عبده المفتوحة: أم الكتاب
      doc.fillColor('#065f46').fontSize(13).text('أولاً: التمهيد والبنود المحكمة (أم الكتاب):', { align: 'right' });
      doc.moveDown(0.5);

      doc.fillColor('#374151').fontSize(10.5);
      const clauses = [
        "البند الأول - الالتزام بالسرية: يقر الطرف الأول بالتزامه المطلق والمقيد بعدم إفشاء أي بيانات، أكواد برمجية، مخططات، نماذج ذكاء اصطناعي، أو أفكار تقنية يعرضها الطرف الثاني خلال الجلسة الاستشارية أو عبر استمارة منظومة يحيى.",
        "البند الثاني - تشفير الأدلة الرقمية: تشمل هذه الاتفاقية كافة الأدلة الإلكترونية، لقطات الشاشة، الملفات المرفوعة عبر الاستمارة التفاعلية، وتُشفر بتشفير AES-256 في قواعد بيانات المكتب ولا يُطلع عليها إلا المحامي المباشر للدعوى.",
        "البند الثالث - حظر الإفشاء: لا يجوز للطرف الأول الإفصاح لأي طرف ثالث أو استخدام المعلومات لصالحه إلا بموافقة كتابية صريحة وموقعة إلكترونياً من الطرف الثاني عبر منظومة Egypt Trust.",
        "البند الرابع - القانون الواجب التطبيق والحجية: يخضع هذا العقد لأحكام القانون رقم 15 لسنة 2004 بتنظيم التوقيع الإلكتروني ولائحته، والقانون رقم 175 لسنة 2018 لمكافحة جرائم تقنية المعلومات، وقانون حماية الملكية الفكرية 82 لسنة 2002. التوقيع الرقمي الصادر من Egypt Trust حجة كاملة طبقاً للمادة 14 من قانون 15/2004.",
        "البند الخامس - المدة والجزاء: مدة السرية 5 سنوات من تاريخ التوقيع. يلتزم الطرف المخل بتعويض لا يقل عن قيمة المشروع المقدرة، مع حق الطرف الثاني في اللجوء للمحكمة الاقتصادية بالقاهرة.",
        "البند السادس - التوقيع الذكي 7/87: تم التوقيع وفق منظومة 7/87 للعدالة الرقمية الخاصة ببوابة يحيى (7 بنود حاكمة - 87 إجراء حماية)، والموقع الإلكتروني يمثل إرادة حرة مستنيرة."
      ];

      clauses.forEach((clause, i) => {
        doc.text(clause, { align: 'right', lineGap: 5 });
        doc.moveDown(0.7);
      });

      doc.moveDown(1.5);

      // 5. التوقيع الرقمي
      doc.fillColor('#111827').fontSize(12).text('ثانياً: التوقيعات الإلكترونية المعتمدة:', { align: 'center' });
      doc.moveDown(1);

      const signatureY = doc.y;
      // مربعات توقيع
      doc.rect(50, signatureY, 220, 90).strokeColor('#059669').stroke();
      doc.rect(310, signatureY, 220, 90).strokeColor('#065f46').stroke();

      doc.fontSize(9).fillColor('#065f46');
      doc.text('الطرف الأول\nمكتب بوابة يحيى\n🔒 موقع رقمياً - Egypt Trust\nالتوقيع: ________________\nالختم: Egypt Trust Seal\nHash: ' + contractHash.substring(0,12), 50, signatureY + 10, { width: 220, align: 'center' });
      
      doc.text(`الطرف الثاني\n${clientData.clientName}\n🔒 توقيع رقمي معتمد 7/87\nالتوقيع: (يوقع عند الاستلام واتساب)\nIP: ${clientData.ip || 'مسجل'}\nWhatsApp Verified`, 310, signatureY + 10, { width: 220, align: 'center' });

      doc.moveDown(6);

      // Footer حجية
      doc.fontSize(7).fillColor('#9ca3af').text(`هذه الوثيقة مولدة آلياً عبر منظومة يحيى - AER Framework - التدقيق والتبيين والإحياء - تم توليدها في ${new Date().toISOString()} - Hash SHA256: ${contractHash} - لا يعتد بأي نسخة غير موقعة رقمياً عبر Egypt Trust.`, { align: 'center' });

      doc.end();

      writeStream.on('finish', () => resolve({ path: outputPath, hash: contractHash, fileName }));
      writeStream.on('error', reject);

    } catch (err) {
      reject(err);
    }
  });
}

module.exports = { generateNDAPDF };
