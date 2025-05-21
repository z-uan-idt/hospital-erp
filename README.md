# 🏥 Hospital ERP System

<div align="center">

![Nuxt 3](https://img.shields.io/badge/Nuxt-3-00DC82?style=for-the-badge&logo=nuxt.js&logoColor=white)
![Vuetify 3](https://img.shields.io/badge/Vuetify-3-1867C0?style=for-the-badge&logo=vuetify&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Vue.js](https://img.shields.io/badge/Vue.js-35495E?style=for-the-badge&logo=vue.js&logoColor=4FC08D)

A modern Hospital ERP system built with Nuxt 3 and Vuetify 3, designed to streamline hospital management processes.

</div>

## ✨ Features

- 🚀 Built with [Nuxt 3](https://nuxt.com/) - the intuitive Vue framework
- 🎨 Beautiful UI with [Vuetify 3](https://vuetifyjs.com/)
- 📱 PWA Support with `@vite-pwa/nuxt`
- 🔍 SEO optimized
- 📦 State management with [Pinia](https://pinia.vuejs.org/)
- 🎯 TypeScript support
- 📝 ESLint + Prettier for code formatting
- 🎨 SCSS/SASS support
- 🖼️ Image optimization with `@nuxt/image`
- 🔄 API integration ready with Axios
- 📅 Date handling with `date-fns`
- 🎭 Icons support with `@nuxt/icon`

## 🚀 Quick Start

### Prerequisites

- Node.js >= v16.0.0
- One of the following package managers:
  - npm >= v8.0.0
  - yarn >= v1.22.0
  - pnpm >= v8.0.0
- Git >= v2.0.0
- Memory >= 4GB RAM
- Storage >= 1GB free space

### Package Version Validation

To ensure your environment meets the requirements, you can run these commands:

```bash
# Check Node.js version
node --version

# Check npm version
npm --version

# Check yarn version (if using yarn)
yarn --version

# Check pnpm version (if using pnpm)
pnpm --version

# Validate package.json dependencies
npm install -g npm-check-updates
ncu

# Check for outdated packages
npm outdated

# Check for vulnerabilities
npm audit
```

If you encounter any version mismatches, please update your packages accordingly:

```bash
# Update npm itself
npm install -g npm@latest

# Update all dependencies to their latest versions
npm update

# Update a specific package
npm install package-name@latest
```

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd hospital-erp
```

2. Install dependencies
```bash
# Using npm
npm install

# Using yarn
yarn install

# Using pnpm
pnpm install
```

3. Start development server
```bash
# Using npm
npm run dev

# Using yarn
yarn dev

# Using pnpm
pnpm dev
```

The application will be available at `http://localhost:3000`

## 🛠️ Development Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Clean development server
npm run dev:clean

# Generate static site
npm run generate

# Lint code
npm run lint

# Fix lint issues
npm run lint:fix

# Format code
npm run format

# Run stylelint
npm run stylelint

# Fix stylelint issues
npm run stylelint:fix
```

## 🏗️ Project Structure

```
hospital-erp/
├── src/               # Source files
├── public/            # Static files
├── .nuxt/            # Nuxt build directory
├── dist/             # Production build
├── .output/          # Nuxt output
├── nuxt.config.ts    # Nuxt configuration
├── tsconfig.json     # TypeScript configuration
└── package.json      # Project dependencies
```

## 🔧 Configuration Files

- `.eslintrc.json` - ESLint configuration
- `.prettierrc.json` - Prettier configuration
- `.stylelintrc.json` - Stylelint configuration
- `nuxt.config.ts` - Nuxt configuration
- `tsconfig.json` - TypeScript configuration

## 📦 Key Dependencies

### Core
- `nuxt` - v3.17.3
- `vue` - v3.5.13
- `vuetify-nuxt-module` - v0.18.6
- `pinia` - v3.0.2

### Development
- `typescript` - v5.8.3
- `eslint` - v8.55.0
- `prettier` - v3.1.1
- `sass` - v1.89.0

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request
