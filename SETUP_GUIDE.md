# 🚀 SAT Prep App — Алхам Алхмаар Суулгах Заавар

Энэ заавар нь таныг **компьютер дээрээ хөгжүүлэлтийн орчин бэлдэх** болон **интернэтэд deploy хийх** хүртэлх бүх алхмыг агуулна. Кодын мэдлэг шаардлагагүй — command-уудыг copy-paste хийхэд л хангалттай.

---

## 📋 Бэлтгэл — Суулгах зүйлс

### 1. Node.js суулгах
Node.js бол JavaScript-ийг компьютер дээр ажиллуулах програм.

1. https://nodejs.org руу орно
2. **"LTS"** гэсэн ногоон товч дээр дарж татна (22.x эсвэл түүнээс дээш)
3. Татсан файлыг нээж суулгана (Next → Next → Install)
4. Суулгасан эсэхийг шалгах — Terminal/CMD нээж бичнэ:

```bash
node --version
npm --version
```
Хэрэв хувилбарын дугаар гарч ирвэл амжилттай суулгагдсан.

### 2. Git суулгах
Git бол кодыг хадгалж, deploy хийхэд ашиглах програм.

1. https://git-scm.com руу орно
2. "Download" дарж татаад суулгана
3. Шалгах:

```bash
git --version
```

### 3. VS Code суулгах (код харах, засахад)
1. https://code.visualstudio.com руу орно
2. Татаж суулгана

---

## 🗄️ MongoDB Atlas — Үнэгүй Database

### 1. Бүртгүүлэх
1. https://www.mongodb.com/cloud/atlas руу орно
2. "Try Free" дарж Google эсвэл имэйлээр бүртгүүлнэ
3. **Free tier (M0)** сонгоно — энэ нь үнэгүй, 512MB хүртэл

### 2. Cluster үүсгэх
1. "Build a Database" дарна
2. **M0 FREE** сонгоно
3. Provider: **AWS**, Region: **Singapore** (хамгийн ойр) сонгоно
4. Cluster name: `sat-prep` гэж нэрлэнэ
5. "Create Deployment" дарна

### 3. Хэрэглэгч нэмэх
1. Username: `satadmin`
2. Password: хүчтэй нууц үг оруулна (санаж авна!)
3. "Create User" дарна

### 4. IP хаяг зөвшөөрөх
1. "Network Access" → "Add IP Address"
2. "Allow Access from Anywhere" дарна (0.0.0.0/0)
3. "Confirm" дарна

### 5. Холболтын мөр авах
1. "Database" → "Connect" дарна
2. "Connect your application" сонгоно
3. Гарч ирсэн мөрийг хуулна. Иймэрхүү харагдана:
```
mongodb+srv://satadmin:НУУЦ_ҮГ@sat-prep.xxxxx.mongodb.net/satprep?retryWrites=true&w=majority
```
4. `НУУЦ_ҮГ` гэсэн хэсгийг өөрийн жинхэнэ нууц үгээр солино

---

## 💻 Backend-ийг компьютер дээрээ ажиллуулах

### 1. Файлуудыг бэлдэх
Татсан `sat-prep-backend` хавтсыг компьютер дээрээ задална.

### 2. Terminal нээх
- **Windows**: VS Code нээгээд `Ctrl + ~` дарна, эсвэл Start → "cmd"
- **Mac**: Spotlight → "Terminal"

Хавтас руу очно:
```bash
cd sat-prep-backend
```

### 3. .env файл үүсгэх
`.env.example` файлыг `.env` болгож хуулна:

```bash
cp .env.example .env
```

Дараа нь `.env` файлыг VS Code-оор нээж засварлана:
```
MONGODB_URI=mongodb+srv://satadmin:ТАНЫ_НУУЦ_ҮГ@sat-prep.xxxxx.mongodb.net/satprep?retryWrites=true&w=majority
JWT_SECRET=маш_урт_нууц_тэмдэгт_мөр_оруулна_энд_12345abcdef
PORT=5000
FRONTEND_URL=http://localhost:3000
```

### 4. Package-ууд суулгах
```bash
npm install
```
Энэ нь шаардлагатай бүх library-уудыг автоматаар татна. 1-2 минут хүлээнэ.

### 5. Анхны өгөгдөл оруулах
```bash
npm run seed
```
Энэ нь жишээ асуултууд, flashcard, мэдээнүүдийг database-д оруулна.

### 6. Сервер эхлүүлэх
```bash
npm run dev
```
Дэлгэцэнд ингэж гарч ирвэл амжилттай:
```
✅ MongoDB-тэй холбогдлоо!
🚀 SAT Prep сервер 5000 порт дээр ажиллаж байна
```

### 7. Шалгах
Browser нээж дараах хаягийг оруулна:
```
http://localhost:5000/api/health
```
`{"status":"ok","message":"SAT Prep API ажиллаж байна! 🚀"}` гэж гарч ирвэл бүгд зөв!

---

## 🌐 Интернэтэд Deploy хийх (Үнэгүй)

### Backend-ийг Render.com-д deploy хийх

#### 1. GitHub-д код оруулах
```bash
cd sat-prep-backend
git init
git add .
git commit -m "SAT Prep Backend"
```

https://github.com руу орж шинэ account үүсгэнэ (хэрэв байхгүй бол).
"New repository" дарж `sat-prep-backend` гэж нэрлэнэ.

```bash
git remote add origin https://github.com/ТАНЫ_НЭВТРЭХ_НЭР/sat-prep-backend.git
git branch -M main
git push -u origin main
```

#### 2. Render.com-д бүртгүүлэх
1. https://render.com руу орно
2. GitHub account-аар нэвтэрнэ
3. "New" → "Web Service" дарна
4. GitHub repo-гоо сонгоно (`sat-prep-backend`)

#### 3. Тохиргоо
- **Name**: `sat-prep-api`
- **Region**: Singapore
- **Branch**: `main`
- **Runtime**: `Node`
- **Build Command**: `npm install`
- **Start Command**: `node server.js`
- **Instance Type**: **Free** сонгоно

#### 4. Environment Variables нэмэх
Render дээр "Environment" хэсэгт дараах утгуудыг нэмнэ:

| Key | Value |
|-----|-------|
| `MONGODB_URI` | MongoDB Atlas-ийн холболтын мөр |
| `JWT_SECRET` | Таны нууц түлхүүр |
| `FRONTEND_URL` | Frontend-ийн URL (дараа нь шинэчилнэ) |

5. "Create Web Service" дарна
6. 2-3 минут хүлээхэд deploy хийгдэнэ
7. Render-ийн өгсөн URL-ийг хадгалж авна (жнь: `https://sat-prep-api.onrender.com`)

### Frontend-ийг Vercel-д deploy хийх

#### 1. Frontend кодоо GitHub-д оруулах
```bash
mkdir sat-prep-frontend
cd sat-prep-frontend
npm create vite@latest . -- --template react
```
`src/App.jsx` файлыг таны SAT Prep frontend кодоор солино.

```bash
git init
git add .
git commit -m "SAT Prep Frontend"
git remote add origin https://github.com/ТАНЫ_НЭР/sat-prep-frontend.git
git push -u origin main
```

#### 2. Vercel-д deploy хийх
1. https://vercel.com руу орно
2. GitHub-аар нэвтэрнэ
3. "Add New Project" → repo сонгоно
4. Environment variable нэмнэ:
   - `VITE_API_URL` = `https://sat-prep-api.onrender.com`
5. "Deploy" дарна

Хэдхэн минутын дараа таны вебсайт амьдарна! 🎉

---

## 📱 PWA (Утасны апп шиг ажиллуулах)

Frontend project-д дараах файлуудыг нэмнэ:

### 1. `public/manifest.json`
```json
{
  "name": "SAT Prep Mongolia",
  "short_name": "SATPrep",
  "description": "SAT шалгалтад бэлдэх цогц платформ",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#F7F8FA",
  "theme_color": "#3B6BF5",
  "icons": [
    { "src": "/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/icon-512.png", "sizes": "512x512", "type": "image/png" }
  ]
}
```

### 2. `index.html`-д нэмэх
```html
<link rel="manifest" href="/manifest.json">
<meta name="theme-color" content="#3B6BF5">
<link rel="apple-touch-icon" href="/icon-192.png">
```

### 3. Icon зураг
192x192 ба 512x512 хэмжээтэй PNG icon зураг `public/` хавтаст хийнэ.

Одоо утаснаасаа вебсайтаа нээгээд:
- **Android**: Chrome → ⋮ цэс → "Add to Home screen"
- **iPhone**: Safari → Share → "Add to Home Screen"

Жинхэнэ апп шиг icon-той, бүтэн дэлгэцтэй ажиллана!

---

## 🔧 API Endpoints жагсаалт

| Method | URL | Тайлбар |
|--------|-----|---------|
| POST | `/api/auth/register` | Бүртгүүлэх |
| POST | `/api/auth/login` | Нэвтрэх |
| GET | `/api/auth/me` | Профайл авах |
| PUT | `/api/auth/me` | Профайл шинэчлэх |
| PUT | `/api/auth/password` | Нууц үг солих |
| GET | `/api/questions/topics` | Сэдвүүд авах |
| GET | `/api/questions/topic/:id` | Сэдвийн асуултууд |
| GET | `/api/questions/practice-test/:n` | Practice test |
| POST | `/api/questions/check` | Хариулт шалгах |
| POST | `/api/tests/submit` | Тест хадгалах |
| GET | `/api/tests/history` | Тестийн түүх |
| GET | `/api/tests/best/scores` | Шилдэг оноонууд |
| GET | `/api/progress` | Миний progress |
| GET | `/api/progress/stats` | Dashboard статистик |
| PUT | `/api/progress/lesson` | Хичээл шинэчлэх |
| PUT | `/api/progress/flashcard` | Flashcard шинэчлэх |
| GET | `/api/flashcards/decks` | Flashcard deck-үүд |
| GET | `/api/flashcards/deck/:id` | Нэг deck-ийн картууд |
| GET | `/api/flashcards/random` | Санамсаргүй карт |
| GET | `/api/news` | Бүх мэдээ |
| GET | `/api/news/pinned` | Онцлох мэдээ |
| GET | `/api/news/:id` | Нэг мэдээний дэлгэрэнгүй |

---

## 💰 Зардлын хураангуй

| Зүйл | Зардал |
|-------|--------|
| MongoDB Atlas (512MB) | Үнэгүй |
| Render.com backend | Үнэгүй |
| Vercel frontend | Үнэгүй |
| GitHub | Үнэгүй |
| Domain нэр (.com) | ~$10/жил |
| SSL сертификат | Үнэгүй (автомат) |
| **Нийт** | **~$10/жил** |

---

## ❓ Асуулт байвал

Claude-д дараах зүйлсийг асууж болно:
- "Backend-д шинэ endpoint нэмж өгөөч"
- "Frontend-ийг backend-тэй холбож өгөөч"
- "Шинэ асуулт нэмэх admin хуудас хийж өгөөч"
- "Төлбөрийн систем нэмж өгөөч"

Амжилт хүсье! 🎓
