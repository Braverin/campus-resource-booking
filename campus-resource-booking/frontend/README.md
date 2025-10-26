
# Campus Booking Frontend (React + Vite + Tailwind)

## 开发
```bash
npm install
npm run dev
```
开发时在 http://localhost:3000 打开，Vite 会把 `/api/*` 请求代理到 `http://localhost:8080`。

## 构建
```bash
npm run build
```
构建产物在 `dist/`。把 **dist 内所有文件** 复制到后端项目的 `src/main/resources/static/` 下，重启后端，即可通过 `http://localhost:8080` 访问前端。

## 使用
- 顶部右侧输入框填写 `X-User-Id`（种子：学生=1，管理员=3）。
- 资源管理需要管理员。
