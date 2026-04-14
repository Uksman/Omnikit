# 📱 Omnikit - The Ultimate Utility Suite

Omnikit is a high-performance, premium utility application built with **React Native** and **Expo**. It centralizes over 12+ essential tools—from financial calculators to security utilities—into a single, beautifully designed interface with full light/dark mode support and real-time activity tracking.

## ✨ Features

### 🛠️ Core Toolkit
- **Conversion Suite**: Length, Temperature, Weight, and Real-time Currency conversions.
- **Finance & Math**: Loan/Mortgage, Compound Interest, Discount, and Tip calculators.
- **Security & Data**: Secure Password Generator, Base64 Encoder/Decoder, QR Generator, and QR Scanner.
- **Health & Lifestyle**: BMI Calculator, Daily Water Tracker, and High-precision Stopwatch.
- **Productivity**: Task/Checklist Manager — create, complete, edit, and delete tasks with priority levels (High / Medium / Low), fully persisted offline via AsyncStorage.

### 🎨 Premium Experience
- **Dynamic Theming**: Automatically syncs with system appearance or allows manual override (Indigo-primary palette).
- **Activity History**: Locally persists your calculation results for quick reference.
- **Rich Interaction**: Smooth micro-animations, glassmorphism-inspired UI, and intuitive bottom-sheet editors.
- **Offline-First**: All tools work without an internet connection. Tasks and history are stored locally using Zustand + AsyncStorage.

---

## 🚀 Getting Started

### Prerequisites
- Node.js (LTS)
- Expo CLI (`npm install -g expo-cli`)

### Installation
1. **Clone the repository**:
   ```bash
   git clone <repo-url>
   cd Omnikit
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npx expo start
   ```

---

## 🛠️ Tech Stack
- **Framework**: [Expo](https://expo.dev/) (SDK 54)
- **UI Architecture**: [Expo Router](https://docs.expo.dev/router/introduction/) (Link-based navigation)
- **Styling**: Vanilla React Native StyleSheet
- **Icons**: [Lucide React Native](https://lucide.dev/)
- **Storage**: [AsyncStorage](https://react-native-async-storage.github.io/async-storage/) + [Zustand Persistence](https://docs.pmnd.rs/zustand/integrations/persisting-store-data)

---

## 📂 Project Structure
```text
Omnikit/
├── app/               # File-based routing (screens)
├── components/        # Reusable UI components
├── constants/         # Theming, Tool & Promo configurations
├── hooks/             # Custom React hooks (Currency, Clipboard)
├── store/             # Zustand state stores
├── utils/             # Core logic & formatters
└── assets/            # Static images & fonts
```

---
