# 📌 Customer Support Platform（客服支援平台）

## 🧾 專案簡介
本專案為一套以 **HTML / JavaScript + Firebase** 建構的客服支援平台，模擬企業內部跨部門處理客訴案件的流程。
使用者可以建立案件、指派部門，並透過各部門回覆進行協作，完整呈現客服案件從建立到處理的流程。

---
## 🔗 Demo

👉 線上展示：  
https://nickhuang1121.github.io/Customer-Support-Platform/

👉 或點擊進入：  
[🚀 範例 DEMO](https://nickhuang1121.github.io/Customer-Support-Platform/)

---

## 🎯 專案目標
- 模擬真實企業客服流程（跨部門協作）
- 建立具備 CRUD（新增 / 讀取 / 更新 / 刪除）的 Web 應用
- 實作 Firebase Authentication（登入驗證）
- 使用 Firestore 建立即時資料更新機制
- 展示前端工程師如何整合 BaaS 完成完整系統

---

## 🧪 如何體驗功能

1. 直接瀏覽案件列表（免登入）
2. 點擊案件查看處理流程
3. 點擊登入（Google）
4. 新增案件或留言

---

## 🖥️ 功能特色

### 📌 案件管理（Case Management）
- 新增案件（標題、內容、負責部門）
- 自動產生案件編號
- 案件列表快速瀏覽
- 顯示案件摘要與詳細內容

### 🔄 回覆系統（Messaging）
- 各部門可針對案件留言
- 顯示處理紀錄與時間

### 🏢 多部門協作
支援多部門參與案件處理：
- 客服部
- 資訊部
- 行銷部
- 商品部
- 生產部
- 品管部
- 研發部

---

## 🔐 登入與權限機制

- 使用 **Google 登入（Firebase Authentication）**
- 未登入者：
  - 可瀏覽案件（展示用途）
- 已登入者：
  - 可新增案件與留言

---

## ⚠️ 展示模式說明（重要）

本專案為作品集展示用途，採用以下策略：

- ✅ 案件與回覆內容為「示意假資料」
- ✅ 開放公開讀取，讓觀看者無需登入即可理解系統流程
- ✅ 寫入（新增 / 修改 / 刪除）需登入Google後才能操作
- ✅ 僅允許使用者操作自己建立的資料

👉 此設計在「展示體驗」與「基本安全控制」之間取得平衡

---

## 🧱 技術架構

### Frontend
- HTML / CSS / Vanilla JavaScript
- 模組化程式設計

### Backend（BaaS）
- Firebase
  - Authentication（Google Login）
  - Firestore（NoSQL Database）
  - onSnapshot（即時資料同步）

}
