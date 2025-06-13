# 🏥 Hospital ERP System | Hệ thống Quản lý Bệnh viện

<div align="center">

![Nuxt 3](https://img.shields.io/badge/Nuxt-3-00DC82?style=for-the-badge&logo=nuxt.js&logoColor=white)
![Vuetify 3](https://img.shields.io/badge/Vuetify-3-1867C0?style=for-the-badge&logo=vuetify&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Vue.js](https://img.shields.io/badge/Vue.js-35495E?style=for-the-badge&logo=vue.js&logoColor=4FC08D)
![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)

A modern Hospital ERP system built with Nuxt 3 and Vuetify 3, designed to streamline hospital management processes.

Hệ thống quản lý bệnh viện hiện đại được xây dựng bằng Nuxt 3 và Vuetify 3, được thiết kế để tối ưu hóa quy trình quản lý bệnh viện.

</div>

## ✨ Features | Tính năng

### Core Technologies | Công nghệ cốt lõi

- 🚀 Nuxt 3 - Modern Vue.js Framework | Framework Vue.js hiện đại
- 🎨 Vuetify 3 - Material Design Component Framework | Framework component Material Design
- 🔍 TypeScript - Type-safe JavaScript | JavaScript với kiểm tra kiểu
- 📦 Pinia - Vue.js State Management | Quản lý trạng thái cho Vue.js
- 🔥 Firebase - Backend as a Service | Dịch vụ Backend
- 📱 PWA Support | Hỗ trợ PWA

### Development Features | Tính năng phát triển

- 🎯 ESLint & Prettier - Code Quality Tools | Công cụ đảm bảo chất lượng code
- 🎨 SASS/SCSS Support | Hỗ trợ SASS/SCSS
- 🖼️ Image Optimization with @nuxt/image | Tối ưu hóa hình ảnh
- 🔄 Axios Integration | Tích hợp Axios
- 📅 Date-fns - Date Manipulation | Xử lý thời gian
- 🎭 Icon Support with @nuxt/icon | Hỗ trợ icon
- 🔔 Vue Sonner - Toast Notifications | Thông báo Toast

## 🚀 Quick Start | Bắt đầu nhanh

### Prerequisites | Yêu cầu hệ thống

- Node.js >= v16.0.0
- Package Manager (Một trong các công cụ quản lý gói sau):
  - npm >= v8.0.0
  - yarn >= v1.22.0
  - pnpm >= v8.0.0
- Git >= v2.0.0
- RAM >= 4GB
- Storage | Bộ nhớ trống >= 1GB

### Installation | Cài đặt

1. Clone repository | Sao chép mã nguồn

```bash
git clone https://github.com/idtinc/hospital-erp.git
cd hospital-erp
```

2. Install dependencies | Cài đặt các gói phụ thuộc

```bash
# Using npm
npm install

# Using yarn
yarn install

# Using pnpm
pnpm install
```

3. Start development server | Khởi động môi trường phát triển

```bash
# Using npm
npm run dev

# Using yarn
yarn dev

# Using pnpm
pnpm dev
```

## 📁 Project Structure | Cấu trúc dự án

```
hospital-erp/
├── src/                 # Source code directory | Thư mục mã nguồn
│   ├── assets/         # Static assets | Tài nguyên tĩnh
│   ├── components/     # Vue components | Components Vue
│   ├── composables/    # Composable functions | Các hàm composable
│   ├── constants/      # Constants | Hằng số
│   ├── layouts/        # Layout components | Components bố cục
│   ├── middleware/     # Nuxt middleware | Middleware Nuxt
│   ├── pages/         # Application pages | Các trang
│   ├── plugins/       # Nuxt plugins | Plugin Nuxt
│   ├── stores/        # Pinia stores | Kho Pinia
│   ├── types/         # TypeScript types | Kiểu TypeScript
│   └── utils/         # Utility functions | Hàm tiện ích
├── public/             # Public static files | File tĩnh công khai
├── .nuxt/             # Nuxt build files | File build Nuxt
├── dist/              # Production build | Build sản phẩm
└── .output/           # Nuxt output | Đầu ra Nuxt
```

## 🛠️ Development Scripts | Các lệnh phát triển

```bash
# Development | Phát triển
npm run dev

# Build | Xây dựng
npm run build

# Preview | Xem trước
npm run preview

# Generate static | Tạo trang tĩnh
npm run generate

# Lint code | Kiểm tra code
npm run lint

# Fix lint issues | Sửa lỗi lint
npm run lint:fix

# Format code | Định dạng code
npm run format
```

## 🔧 Configuration Files | File cấu hình

- `nuxt.config.ts` - Nuxt configuration | Cấu hình Nuxt
- `tsconfig.json` - TypeScript configuration | Cấu hình TypeScript
- `.prettierrc` - Prettier configuration | Cấu hình Prettier
- `eslint.config.js` - ESLint configuration | Cấu hình ESLint
- `vercel.json` - Vercel deployment configuration | Cấu hình triển khai Vercel

## 📦 Dependencies | Các gói phụ thuộc

### Core Dependencies | Gói phụ thuộc chính

- `@nuxt/icon`: ^1.13.0 - Icon support
- `@nuxt/image`: ^1.10.0 - Image optimization
- `@pinia/nuxt`: ^0.11.1 - State management
- `axios`: ^1.9.0 - HTTP client
- `date-fns`: ^4.1.0 - Date manipulation
- `firebase`: ^11.8.0 - Backend services
- `nuxt`: ^3.17.3 - Core framework
- `pinia`: ^3.0.3 - State management
- `sass`: ^1.89.0 - CSS preprocessor
- `vue`: ^3.5.13 - Core framework
- `vue-router`: ^4.5.1 - Routing
- `vue-sonner`: ^1.3.2 - Toast notifications

### Development Dependencies | Gói phụ thuộc phát triển

- `@typescript-eslint/*`: ^8.32.0 - TypeScript linting
- `eslint`: ^9.26.0 - Code linting
- `prettier`: ^3.5.3 - Code formatting
- `vuetify-nuxt-module`: ^0.18.6 - UI framework
- `vue-tsc`: ^2.2.10 - TypeScript type checking

## 🤝 Contributing | Đóng góp

1. Fork the repository | Fork kho mã nguồn
2. Create feature branch | Tạo nhánh tính năng (`git checkout -b feature/TinhNangMoi`)
3. Commit changes | Commit thay đổi (`git commit -m 'Thêm tính năng mới'`)
4. Push to branch | Đẩy lên nhánh (`git push origin feature/TinhNangMoi`)
5. Create Pull Request | Tạo Pull Request

## 👥 Authors | Tác giả

- Kieu Van Chuong (chuong.kv@idtinc.co)
