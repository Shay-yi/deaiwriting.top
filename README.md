# 学术文章优化助手

一个用于优化学术文章的Web应用程序，帮助将AI生成的文本优化为更加自然、流畅的人类写作风格。

## 功能特点

- 支持中英文文本优化
- 保持原文意思、结构和论证逻辑
- 仅调整不自然的表达方式
- 移除冗余的标点符号
- 美观的用户界面
- 实时优化进度显示

## 技术栈

- 前端：React + TypeScript + Tailwind CSS
- 后端：Node.js + Express
- API：豆包大模型API

## 安装说明

### 克隆仓库

```bash
git clone https://github.com/yourusername/academic-text-optimizer.git
cd academic-text-optimizer
```

### 安装依赖

```bash
# 安装前端依赖
npm install

# 安装后端依赖
cd server
npm install
cd ..
```

### 配置API密钥

在`server/index.js`文件中，将`ARK_API_KEY`替换为您自己的豆包API密钥：

```javascript
const ARK_API_KEY = '您的API密钥';
```

## 使用方法

### 开发环境

1. 启动后端服务器：

```bash
cd server
node index.js
```

2. 在另一个终端中启动前端开发服务器：

```bash
npm run dev
```

3. 打开浏览器访问 http://localhost:5173

### 生产环境

1. 构建前端：

```bash
npm run build
```

2. 将`dist`目录部署到您的Web服务器

3. 确保后端服务器正在运行

## 许可证

本项目仅供学习研究使用。

## 联系方式

有任何问题或建议，请联系：yishi_shay@yeah.net 