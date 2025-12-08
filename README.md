# QR Code Generator

A modern, feature-rich QR code generator built with Next.js 15, featuring real-time preview, extensive customization options, and multi-language support (English & Arabic).

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38B2AC)](https://tailwindcss.com/)

![QR Code Generator - Home](test-screenshots/home-initial.png)

## Features

- **12 QR Code Types**: URL, Plain Text, Email, Phone, SMS, WhatsApp, WiFi, vCard (Contact), Calendar Event, Location, Cryptocurrency, and App Store Links
- **Real-time Preview**: See your QR code as you type
- **Extensive Customization**: Colors, gradients, patterns, corner styles, sizes, error correction levels, and logos
- **Multiple Export Formats**: PNG, SVG, PDF, JPEG, WebP
- **QR Code Scanner**: Scan QR codes using camera or image upload
- **Batch Generation**: Generate multiple QR codes at once from CSV or manual input
- **Templates**: Pre-made QR code styles for quick start
- **Multi-language Support**: English and Arabic (RTL supported)
- **Dark/Light Theme**: System-aware theme with manual toggle
- **History**: Track and restore previously generated QR codes
- **Responsive Design**: Works on desktop, tablet, and mobile
- **PWA Ready**: Installable as a Progressive Web App

## Screenshots

### QR Code Generation
![URL QR Code](test-screenshots/home-url-qr.png)

### WiFi QR Code
![WiFi Form](test-screenshots/home-wifi-form.png)

### vCard (Contact) QR Code
![vCard Form](test-screenshots/home-vcard-form.png)

### Export Options
![Export Options](test-screenshots/home-export-options.png)

### Dark Theme
![Dark Theme](test-screenshots/theme-dark.png)

### QR Code Scanner
![Scanner](test-screenshots/scanner-page.png)

### Batch Generation
![Batch Generator](test-screenshots/batch-page.png)

### Templates
![Templates](test-screenshots/templates-gallery.png)

### Mobile View
![Mobile](test-screenshots/mobile-home.png)

## Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) with App Router
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/)
- **State Management**: [Zustand](https://zustand-demo.pmnd.rs/)
- **Form Handling**: [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/)
- **Internationalization**: [next-intl](https://next-intl-docs.vercel.app/)
- **QR Generation**: [qrcode](https://www.npmjs.com/package/qrcode)
- **Testing**: [Jest](https://jestjs.io/) + [React Testing Library](https://testing-library.com/) + [Playwright](https://playwright.dev/)

## Getting Started

### Prerequisites

- Node.js 18.17 or later
- npm, yarn, pnpm, or bun

### Installation

1. Clone the repository:
```bash
git clone https://github.com/mahmoodhamdi/QR-Code-Generator.git
cd QR-Code-Generator
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Scripts

```bash
# Development
npm run dev          # Start development server

# Build
npm run build        # Build for production
npm run start        # Start production server

# Testing
npm test             # Run unit tests
npm run test:watch   # Run tests in watch mode
npm run test:e2e     # Run E2E tests with Playwright

# Code Quality
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript type checking
```

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── page.tsx           # Home page (QR Generator)
│   ├── scan/              # QR Scanner page
│   ├── batch/             # Batch generation page
│   └── templates/         # Templates page
├── components/
│   ├── layout/            # Header, Footer, Theme Toggle, Language Switcher
│   ├── qr/                # QR-related components
│   │   ├── forms/         # Form components for each QR type
│   │   ├── QRGenerator.tsx
│   │   ├── QRPreview.tsx
│   │   ├── QRCustomizer.tsx
│   │   ├── QRExporter.tsx
│   │   └── QRHistory.tsx
│   └── ui/                # shadcn/ui components
├── hooks/                 # Custom React hooks
├── lib/                   # Utility functions
│   ├── encoder.ts         # QR string encoding
│   ├── generator.ts       # QR code generation
│   └── validations.ts     # Input validation
├── stores/                # Zustand stores
├── types/                 # TypeScript type definitions
└── i18n/                  # Internationalization config
messages/
├── en.json               # English translations
└── ar.json               # Arabic translations
```

## Testing

### Unit & Integration Tests

```bash
npm test
```

212 tests covering:
- Utility functions (encoder, generator, validations)
- React hooks
- Zustand stores
- Form components
- QR components

### E2E Tests

```bash
npm run test:e2e
```

33 Playwright tests covering:
- Page navigation
- QR code generation flow
- Form interactions
- Theme switching
- Responsive design
- Accessibility

## Internationalization

The app supports:
- **English** (default)
- **Arabic** (with RTL support)

Language can be switched using the language toggle in the header. The preference is saved in a cookie.

## Customization Options

| Option | Description |
|--------|-------------|
| **Foreground Color** | QR code pattern color |
| **Background Color** | QR code background |
| **Gradient** | None, Linear, or Radial gradient |
| **Pattern Style** | Squares, Dots, or Rounded |
| **Corner Style** | Square, Rounded, or Extra Rounded |
| **Size** | Small (128px) to Print Ready (1024px) |
| **Error Correction** | Low (7%), Medium (15%), Quartile (25%), High (30%) |
| **Logo** | Upload custom logo with adjustable size |
| **Frame Text** | Add custom text below QR code |

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Author

**Mahmood Hamdi**
- GitHub: [@mahmoodhamdi](https://github.com/mahmoodhamdi)
- Email: hmdy7486@gmail.com

## Acknowledgments

- [Next.js](https://nextjs.org/) for the amazing React framework
- [shadcn/ui](https://ui.shadcn.com/) for the beautiful UI components
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
- [Vercel](https://vercel.com/) for hosting and deployment
