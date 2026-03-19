# Todo App

一个 Next.js 全栈待办事项应用，包含用户注册/登录功能。

## 技术栈

- **框架**: Next.js 14 (App Router)
- **数据库**: PostgreSQL (Neon.tech 云端托管)
- **ORM**: Prisma v7
- **认证**: 自定义 JWT + bcryptjs
- **样式**: Tailwind CSS
- **部署**: Vercel

---

## 本地开发步骤

### 1. 获取代码

```bash
git clone https://github.com/你的用户名/my-todo-app.git
cd my-todo-app
npm install
```

### 2. 配置数据库（Neon）

1. 打开 [https://neon.tech](https://neon.tech)，注册免费账号
2. 点击 **Create a project** 创建新项目
3. 进入项目后，找到 **Connection string**，复制那串 `postgresql://...` 开头的地址

### 3. 配置环境变量

复制 `.env.example` 为 `.env`：

```bash
cp .env.example .env
```

然后打开 `.env` 文件，填入你的值：

```
DATABASE_URL="粘贴你从 Neon 复制的连接字符串"
JWT_SECRET="随便输入一个长字符串，比如 my-super-secret-key-abc123xyz456"
```

### 4. 同步数据库表结构

```bash
npx prisma db push
```

这会在你的 Neon 数据库里自动创建 `User` 和 `Todo` 两张表。

### 5. 启动开发服务器

```bash
npm run dev
```

打开 [http://localhost:3000](http://localhost:3000) 即可看到应用。

---

## 换台电脑继续开发

由于代码在 GitHub 上，数据库在 Neon 云端，换电脑只需：

```bash
# 1. 克隆代码
git clone https://github.com/你的用户名/my-todo-app.git
cd my-todo-app

# 2. 安装依赖
npm install

# 3. 创建 .env 文件（填入同样的数据库连接字符串）
cp .env.example .env
# 然后编辑 .env 填入你的值

# 4. 生成 Prisma 客户端
npx prisma generate

# 5. 启动
npm run dev
```

**注意**：`.env` 文件不会提交到 Git（已在 `.gitignore` 中排除），每台电脑都需要手动创建。

---

## 部署到 Vercel

### 1. 推送代码到 GitHub

```bash
# 在 GitHub 上创建一个新的空仓库（不要勾选 README）
# 然后在本地执行：
git remote add origin https://github.com/你的用户名/my-todo-app.git
git push -u origin master
```

### 2. 在 Vercel 部署

1. 登录 [https://vercel.com](https://vercel.com)
2. 点击 **Add New → Project**
3. 选择你的 GitHub 仓库 `my-todo-app`
4. 在 **Environment Variables** 部分添加两个变量：
   - `DATABASE_URL` = 你的 Neon 连接字符串
   - `JWT_SECRET` = 你的 JWT 密钥
5. 点击 **Deploy**，等待完成

部署成功后，Vercel 会给你一个公网地址，例如 `https://my-todo-app.vercel.app`。

### 3. 自动部署

之后每次你推送代码到 GitHub：

```bash
git add .
git commit -m "你的更改描述"
git push
```

Vercel 会自动检测到新的提交并重新部署，无需手动操作。

---

## 项目结构

```
my-todo-app/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   ├── login/route.ts     # 登录 API
│   │   │   └── register/route.ts  # 注册 API
│   │   └── todos/
│   │       ├── route.ts           # 获取/创建 Todo
│   │       └── [id]/route.ts      # 切换完成/删除 Todo
│   ├── login/page.tsx             # 登录页面
│   ├── register/page.tsx          # 注册页面
│   ├── todos/page.tsx             # Todo 主页
│   └── page.tsx                   # 首页（跳转到登录）
├── lib/
│   ├── prisma.ts                  # 数据库客户端
│   └── auth.ts                    # JWT 工具函数
├── prisma/
│   └── schema.prisma              # 数据库模型定义
├── .env.example                   # 环境变量示例
└── README.md
```
