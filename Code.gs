/**
 * تبدیل اعداد فارسی به انگلیسی
 * @param {string} str - رشته‌ای که شامل اعداد فارسی است
 * @returns {string} - رشته با اعداد انگلیسی
 */
function convertPersianToEnglish(str) {
  return str.replace(/[۰-۹]/g, function(d) {
    return "0123456789".charAt("۰۱۲۳۴۵۶۷۸۹".indexOf(d));
  });
}

/**
 * ارسال ایمیل یادآوری در پایان هر ماه شمسی
 */
function sendReminderEmailMonthly() {
  // تعریف نام ماه‌های شمسی
  const persianMonths = [
    "فروردین", "اردیبهشت", "خرداد", "تیر", "مرداد", "شهریور",
    "مهر", "آبان", "آذر", "دی", "بهمن", "اسفند"
  ];
  
  const recipient = "your-email@gmail.com"; // گیرنده ایمیل
  const today = new Date();
  const iranTime = today.toLocaleString('fa-IR', { timeZone: 'Asia/Tehran' });
  
  // تبدیل تاریخ میلادی به شمسی
  const shamsiDate = new Intl.DateTimeFormat('fa-IR-u-ca-persian', { day: 'numeric', month: 'numeric', year: 'numeric' }).format(today);
  const fixedDate = convertPersianToEnglish(shamsiDate);
  
  // استخراج سال، ماه و روز شمسی
  const parts = fixedDate.split('/');
  const shYear = parseInt(parts[0], 10);
  const shMonth = parseInt(parts[1], 10);
  const shDay = parseInt(parts[2], 10);
  
  const monthName = persianMonths[shMonth - 1];
  const subject = `${monthName} تموم شد، این نکته‌های مهم یادت نره...`;
  
  // تعداد روزهای هر ماه شمسی
  const daysInShamsiMonth = [31, 31, 31, 31, 31, 31, 30, 30, 30, 30, 30, 29];
  
  // بررسی کبیسه بودن سال برای اسفند ماه
  if (shMonth === 12 && ((shYear % 33) % 4 === 1)) { 
    daysInShamsiMonth[11] = 30;
  }
  
  const htmlBody = `<div style="font-family: Tahoma, sans-serif; direction: rtl; text-align: right;">
                      <h2>یادآوری ماهانه</h2>
                      <p>این یک یادآوری ماهانه است. می‌تونی متن ایمیل رو با تگ‌های HTML زیباتر کنی.</p>
                    </div>`;
  
  try {
    const draft = GmailApp.createDraft(recipient, subject, "", { htmlBody: htmlBody });
    
    if (shDay === daysInShamsiMonth[shMonth - 1]) {
      draft.send();
    }
    
    Logger.log("ایمیل با موفقیت ارسال شد.");
  } catch (err) {
    Logger.log("خطا در ارسال ایمیل: " + err);
  }
}
