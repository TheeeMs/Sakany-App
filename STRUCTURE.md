# 📁 Sakany App - Folder Structure

## 📋 Overview

مشروع **Sakany** هو تطبيق React Native مبني على **Expo** مع **React Navigation**.

---

## 🗂️ Project Structure

```
sakany-app/
├── App.tsx                    # 🚀 Entry Point
├── app.json                   # ⚙️ Expo Config
├── package.json               # 📦 Dependencies
├── tsconfig.json              # 🔷 TypeScript Config
│
├── 📂 src/                    # 💻 Source Code
│   ├── 📂 screens/            # 📱 الشاشات
│   ├── 📂 navigation/         # 🧭 التنقل
│   ├── 📂 components/         # 🧩 العناصر المشتركة
│   ├── 📂 services/           # 🌐 الـ API
│   └── 📂 store/              # 🗄️ إدارة الحالة
│
└── 📂 assets/                 # 🖼️ الصور والأيقونات
```

---

## 📂 Folders Details

### 📱 `src/screens/`

كل **Feature** في folder منفصل:

```
screens/
├── 📂 home/
│   └── HomeScreen.tsx
├── 📂 about/
│   └── AboutScreen.tsx
└── index.ts                   # تصدير كل الشاشات
```

---

### 🧭 `src/navigation/`

```
navigation/
├── AppNavigator.tsx           # الـ Stack Navigator
└── index.ts
```

---

### 🧩 `src/components/`

```
components/
├── Button.tsx
├── Card.tsx
└── index.ts
```

---

### 🌐 `src/services/`

```
services/
├── api.ts                     # API Client
└── index.ts
```

---

### 🗄️ `src/store/`

```
store/
├── authStore.ts               # Zustand Store
└── index.ts
```

---

## ➕ How to Add New Feature

### مثال: إضافة QR Reader

#### 1️⃣ أنشئ Folder جديد

```
src/screens/qr-reader/
```

#### 2️⃣ أنشئ الشاشة

```tsx
// src/screens/qr-reader/QRReaderScreen.tsx

import { View, Text, StyleSheet } from "react-native";

export default function QRReaderScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>QR Reader 📷</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
});
```

#### 3️⃣ أضفها في `screens/index.ts`

```tsx
// src/screens/index.ts

// Home
export { default as HomeScreen } from "./home/HomeScreen";

// About
export { default as AboutScreen } from "./about/AboutScreen";

// QR Reader ✨ NEW
export { default as QRReaderScreen } from "./qr-reader/QRReaderScreen";
```

#### 4️⃣ أضفها في Navigator

```tsx
// src/navigation/AppNavigator.tsx

import { HomeScreen, AboutScreen, QRReaderScreen } from "../screens";

export type RootStackParamList = {
  Home: undefined;
  About: undefined;
  QRReader: undefined; // ✨ NEW
};

// داخل Stack.Navigator أضف:
<Stack.Screen
  name="QRReader"
  component={QRReaderScreen}
  options={{ title: "QR Reader" }}
/>;
```

#### 5️⃣ انتقل للشاشة من أي مكان

```tsx
navigation.navigate("QRReader");
```

---

## 📝 Quick Reference

| أريد أن...      | الخطوات                                                           |
| --------------- | ----------------------------------------------------------------- |
| أضيف شاشة جديدة | 1. أنشئ folder → 2. أنشئ Screen → 3. Export → 4. أضف في Navigator |
| أضيف component  | 1. أنشئ ملف في components → 2. Export في index.ts                 |
| أضيف API        | 1. أنشئ ملف في services → 2. Export في index.ts                   |
| أضيف Store      | 1. أنشئ ملف في store → 2. Export في index.ts                      |

---

## 🚀 Commands

```bash
# Install
npm install

# Run
npx expo start

# Android
npx expo start --android

# iOS
npx expo start --ios
```

---

## 🛠️ Tech Stack

| Technology       | Purpose              |
| ---------------- | -------------------- |
| React Native     | Mobile Framework     |
| Expo SDK 54      | Development Platform |
| TypeScript       | Type Safety          |
| React Navigation | Navigation           |
| Zustand          | State Management     |
