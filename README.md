# 🧊 CUBEBOT

بوت ديسكورد متكامل مبني بـ **Node.js** و **discord.js v14** مع قاعدة بيانات **MongoDB** ولوحة تحكم ويب (Dashboard)، جاهز للنشر مباشرة على **Railway**.

## ✨ المميزات

- 🎫 **نظام التذاكر (Tickets)** — لوحة فتح تذكرة بزر، استلام، إغلاق، وسجل إغلاق التذاكر.
- 🛡️ **الإشراف (Moderation)** — ban / unban / kick / mute / unmute / warn / warnings / clear.
- ✨ **نظام XP والمستويات** — يكتسب الأعضاء XP عند الدردشة، مع ترتيب (`/rank`, `/xp-leaderboard`).
- 🪙 **نظام اقتصاد (Economy)** — رصيد، مكافأة يومية، عمل (work)، تحويل أموال، ولوحة أغنى الأعضاء.
- 👋 **رسائل ترحيب ووداع** — قابلة للتخصيص بالكامل مع متغيرات ديناميكية.
- 🤖 **الردود التلقائية (Auto Responses)** — ردود مخصصة على كلمات أو جمل معينة.
- ⚡ **Slash Commands + Buttons + Modals** بالكامل (لا يوجد أوامر بادئة قديمة).
- 🌐 **Dashboard ويب** — تسجيل دخول عبر Discord OAuth2 لإدارة إعدادات كل سيرفر من المتصفح.

## 📁 هيكلة المشروع

```
cubebot/
├── index.js                 # نقطة تشغيل البوت
├── deploy-commands.js        # رفع الأوامر (Slash Commands)
├── config/config.js          # الإعدادات العامة
├── database/connect.js       # الاتصال بـ MongoDB
├── models/                   # نماذج قاعدة البيانات (User, GuildConfig, Ticket)
├── handlers/                 # محمّلات الأوامر والأحداث ومنطق التذاكر
├── events/                   # أحداث ديسكورد (ready, interactionCreate, messageCreate...)
├── commands/                 # كل أوامر السلاش مقسمة حسب الفئة
└── dashboard/                # لوحة التحكم (Express + EJS)
```

## 🚀 التشغيل محليًا

### 1. المتطلبات
- Node.js إصدار 18 أو أعلى
- حساب MongoDB (يفضل [MongoDB Atlas](https://www.mongodb.com/atlas) المجاني)
- تطبيق بوت من [Discord Developer Portal](https://discord.com/developers/applications)

### 2. التثبيت
```bash
npm install
```

### 3. الإعدادات
انسخ ملف `.env.example` إلى `.env` واملأ القيم:
```bash
cp .env.example .env
```

| المتغير | الوصف |
|---|---|
| `DISCORD_TOKEN` | توكن البوت من Developer Portal |
| `CLIENT_ID` | معرّف التطبيق (Application ID) |
| `CLIENT_SECRET` | السر الخاص بالتطبيق (للوحة التحكم) |
| `GUILD_ID` | معرّف سيرفر الاختبار (لتسجيل أوامر فورية) |
| `MONGO_URI` | رابط الاتصال بقاعدة بيانات MongoDB |
| `SESSION_SECRET` | نص عشوائي طويل لتأمين جلسات لوحة التحكم |
| `DASHBOARD_CALLBACK_URL` | رابط الرجوع بعد تسجيل الدخول (OAuth2 Redirect) |
| `OWNER_IDS` | آيديهات مالكي البوت (اختياري) |

### 4. تفعيل الصلاحيات المطلوبة في Developer Portal
فعّل هذه الـ Intents من تبويب **Bot**:
- `SERVER MEMBERS INTENT`
- `MESSAGE CONTENT INTENT`

### 5. رفع الأوامر (Slash Commands)
```bash
npm run deploy          # رفع فوري على سيرفر GUILD_ID (للتجربة)
node deploy-commands.js --global   # رفع عالمي على كل السيرفرات (قد يستغرق ساعة للظهور)
```

### 6. تشغيل البوت
```bash
npm start
```

### 7. تشغيل لوحة التحكم (اختياري، منفصل)
```bash
npm run dashboard
```
افتح المتصفح على: `http://localhost:3000`

> لتشغيل البوت واللوحة معًا في نفس العملية (مفيد على Railway بخطة واحدة)، ضع `START_DASHBOARD_WITH_BOT=true` في `.env`.

## ☁️ النشر على Railway

1. ارفع هذا المشروع إلى مستودع GitHub.
2. من [Railway](https://railway.app) أنشئ مشروعًا جديدًا واختر "Deploy from GitHub repo".
3. أضف كل المتغيرات الموجودة في `.env.example` من تبويب **Variables**.
4. تأكد أن رابط `DASHBOARD_CALLBACK_URL` يطابق رابط النطاق الذي يعطيك إياه Railway (مثال: `https://cubebot.up.railway.app/auth/discord/callback`) وأضفه أيضًا في **OAuth2 → Redirects** داخل Developer Portal.
5. Railway سيقوم تلقائيًا بتشغيل `node index.js` بناءً على `railway.json`. لتشغيل اللوحة كخدمة ويب منفصلة أنشئ خدمة ثانية بنفس الريبو وغيّر أمر التشغيل إلى `node dashboard/server.js`.
6. بعد أول نشر، شغّل أمر رفع الأوامر مرة واحدة (يمكنك تشغيله محليًا وهو متصل بنفس `MONGO_URI` و`CLIENT_ID`).

## 🧩 أهم الأوامر

| الأمر | الوصف |
|---|---|
| `/help` | عرض كل الأوامر |
| `/ticket-setup` | نشر لوحة فتح التذاكر |
| `/ticket-config` | إعداد رتب الدعم وقناة السجل |
| `/ban` `/kick` `/mute` `/warn` | أوامر الإشراف |
| `/balance` `/daily` `/work` `/pay` | أوامر الاقتصاد |
| `/rank` `/xp-leaderboard` | أوامر XP |
| `/setwelcome` | إعداد رسائل الترحيب |
| `/autoresponse add/remove/list` | إدارة الردود التلقائية |

## 🛠️ ملاحظات تقنية

- كل بيانات الأعضاء (اقتصاد، XP، إنذارات) محفوظة لكل سيرفر بشكل منفصل.
- نظام التذاكر ينشئ تصنيف (Category) تلقائيًا باسم `Tickets` عند أول استخدام.
- لوحة التحكم تعرض فقط السيرفرات التي يملك فيها المستخدم صلاحية "Manage Server".
- البوت يستخدم Slash Commands و Buttons و Modals حصريًا (لا بريفكس قديم).

---
صُنع بـ ❤️ باستخدام discord.js v14
