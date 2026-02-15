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

> ถ้าแก้โค้ดแล้วเหมือนยังเป็นของเดิม ให้ใช้:
>
> ```bash
> docker compose down
> docker compose build --no-cache
> docker compose up -d --force-recreate
> ```

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

## Docker Files

- `Dockerfile`: multi-stage build (Node build -> Nginx runtime)
- `nginx/default.conf`: config สำหรับ serve static และ fallback route
- `docker-compose.yml`: map พอร์ต `3001:80`
- `.dockerignore`: ลดขนาด build context
