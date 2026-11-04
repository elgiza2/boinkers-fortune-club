# Boinkers Fortune Club

عايزين نعمل Telegram Mini App للعبة باقتصاد اجتماعي متكامل وتصميم كارتوني احترافي عالي الجودة مطابق تماماً لروح الصور المرفقة (مثل لعبة Boinkers): خطوط عريضة داكنة (thick bold cartoon outlines)، أزرار بارزة ثلاثية الأبعاد (chunky bevel buttons)، ألوان فاقعة وحيوية، وأنيميشن سلس للبكرات والجوائز.

الهيكل الأساسي واقتصاد اللعبة:
1. عملات Solo:
   - عملة التقدم طويلة المدى تُعدن تلقائياً بمرور الوقت من تطوير الشخصيات.
   - كلما تطورت الشخصية يرتفع معدل إنتاج Solo بالساعة.
   - عداد إنتاج حي مع زر Claim لتحصيل الأرباح.
2. Spins:
   - طاقة تدوير عجلة الـ Slot مع مؤشر شحن زمني تلقائي (مثلاً تجدد كل فترة).
   - تُكتسب أيضاً من المهام، الإحالات، الروليت، والأحداث.
3. العملات المعدنية (Coins):
   - مخصصة حصرياً لتطوير وترقية الشخصيات (Head, Body, Gear) لزيادة القوة ومعدل تعدين Solo.
4. Roulette:
   - نظام عجلة حظ مستقل عن الـ Slot مخصص للجوائز النادرة والكبرى، يُفتح بتذاكر خاصة وله زر وصول بارز.

الشاشات والتنقل (3 صفحات سفلية رئيسية Bottom Navigation):
1. الرئيسية (Home / Slot):
   - شريط علوي بارز يعرض الأرصدة: Level، رصيد Coins، رصيد Solo، وشريط طاقة الـ Spins.
   - ماكينة الـ Slot في المنتصف (3 بكرات متحركة مع تأثير دوران واقعي واهتزاز عند التوقف).
   - زر SPIN كارتوني ضخم مع دعم مضاعف الرهان (x1 / x3 / x5) وخيار Hold for Autospin.
   - شريط دائري متحرك للأحداث الحالية ومؤقتات العد التنازلي.
   - بطاقة/زر Flash Offer مع مؤقت سريع.
   - نافذة منبثقة لعجلة الروليت (Wheel of Fortune).
2. التطوير (Upgrade / Characters):
   - عرض الشخصية الكارتونية في بيئة مميزة مع شريط تقدم المستوى (مثلاً 0/9 ترقيات).
   - 3 خانات ترقية واضحة: Head, Body, Gear بأسعار Coins متصاعدة.
   - قسم تعدين Solo المباشر مع معدل التعدين/ساعة وزر التحصيل.
3. المزيد / الحساب (Earn & Hub):
   - صفحة المهام (Complete & Earn) مع التحقق وزر Go/Verify ومكافآت Spins/Coins.
   - صفحة دعوة الأصدقاء (Referrals) مع رابط الإحالة، زر النسخ، ومسار مكافآت الإحالات.
   - لوحة المتصدرين (Leaderboard) للأحداث والمنافسة.
   - متجر شراء الباقات والعروض.
4. نظام مسار جوائز الأحداث (Event Milestone Track):
   - مسار جوائز متدرج يفتح بالتوكنز المجمعة من الـ Slot مع جوائز مجانية ومحطات مميزة.

التصميم يجب أن يكون جاهزاً كـ Telegram WebApp متجاوب ومثالي للهواتف الذكية مع تفاعلات بصرية ممتعة وصوتية اختيارية.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/e232e152-e284-4751-874c-2bb6d3118a39).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
