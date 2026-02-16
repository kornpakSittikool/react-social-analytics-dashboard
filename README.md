# React Social Analytics Dashboard

แดชบอร์ดสำหรับสรุปและวิเคราะห์ข้อมูลโซเชียล สร้างด้วย Next.js และ React

## Tech Stack

- Next.js 16.1.6 (App Router)
- React 19.2.3
- TypeScript 5
- Tailwind CSS 4
- ESLint 9
- Nginx (serve static build)
- Docker Compose

## Project Structure

- `client/`: Next.js app (UI + unit tests)
- `e2e/`: Playwright end-to-end tests
- `.github/workflows/playwright.yml`: GitHub Actions workflow สำหรับ e2e

## Prerequisites

- Node.js 20+ (กรณีรันแบบไม่ใช้ Docker)
- Docker Desktop (กรณีรันด้วย Docker Compose)

## Run With Docker Compose (Recommended)

โปรเจกต์นี้ build ฝั่ง `client` เป็น static export แล้วให้ `nginx` serve ผ่าน container

1. Build image ก่อน

```bash
docker compose build
```

2. Start container

```bash
docker compose up -d
```

3. เปิดใช้งานที่

```text
http://localhost:3001
```

4. Stop container

```bash
docker compose down
```

ถ้าแก้โค้ดแล้วเหมือนยังเป็นของเดิม ให้ใช้:

```bash
docker compose down
docker compose build --no-cache
docker compose up -d --force-recreate
```

## Run Without Docker

1. เข้าโฟลเดอร์แอป

```bash
cd client
```

2. ติดตั้ง dependencies

```bash
npm install
```

3. โหมดพัฒนา (Development)

```bash
npm run dev
```

เปิดที่ `http://localhost:3000`

4. โหมด Production (รันด้วย Next server)

```bash
npm run build
npm run start
```

## Testing

1. Unit test (client)

```bash
cd client
npm ci
npm test
```

2. E2E test (Playwright)

```bash
cd e2e
npm ci
npm run test:chromium
```

3. เปิด Playwright UI (optional)

```bash
cd e2e
npm run test:ui
```

หมายเหตุ:
- Playwright จะ start dev server ให้เองที่ `http://127.0.0.1:4301` ผ่าน `e2e/playwright.config.ts`
- ถ้าพอร์ต test ถูกใช้งานอยู่ สามารถเคลียร์ได้ด้วย `cd e2e && npm run kill:test-port`
- เคส `JsonCraft` รองรับทั้งกรณี service `http://localhost:4000/` พร้อมใช้งาน และกรณีไม่พร้อมใช้งาน (error flow)

## CI (GitHub Actions)

workflow e2e จะทำงานเมื่อ:
- push เข้า `main`
- เปิด PR เข้า `main`

ไฟล์ workflow ต้องอยู่ที่:
- `/.github/workflows/playwright.yml`

ถ้า push แล้วไม่เห็น workflow ทำงาน ให้เช็ก:
1. path ไฟล์ workflow อยู่ที่ root (`.github/workflows`) จริง
2. Repo Settings > Actions เปิดใช้งาน
3. push/PR ไปที่ branch `main` ตามเงื่อนไข trigger

## Docker Files

- `Dockerfile`: multi-stage build (Node build -> Nginx runtime)
- `nginx/default.conf`: config สำหรับ serve static และ fallback route
- `docker-compose.yml`: map พอร์ต `3001:80`
- `.dockerignore`: ลดขนาด build context
