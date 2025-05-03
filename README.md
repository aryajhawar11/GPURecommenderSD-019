# ⚡ GPU Recommender App (SD-019)

### Demo video -  https://drive.google.com/file/d/1FXZgy8qfNELBu4IeKlt5rVPmw9t7YBPK/view?usp=sharing
A full-stack frontend React application that fetches **real-time GPU pricing and specs** from [AceCloud Hosting](https://customer.acecloudhosting.com) and recommends GPUs based on your **workload type**, **model size**, **dataset size**, **budget**, and **region**.

---

## 🌍 Live Pricing API

The app uses this real-time API:
```
https://customer.acecloudhosting.com/api/v1/pricing?is_gpu=true&resource=instances
```

---

## 🧩 Tech Stack

- **React (Vite)**
- **Tailwind CSS**
- **Axios**
- **React Toastify**
- **Lucide React** (icons)

---

## 📁 Folder Structure

```
frontend/
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── FeaturesSection.jsx
│   │   ├── FilterForm.jsx
│   │   ├── GpuCard.jsx
│   │   ├── Header.jsx
│   │   ├── HeroSection.jsx
│   │   └── Navbar.jsx
│   ├── data/
│   ├── pages/
│   │   ├── GpuOptimizerApp.jsx
│   │   └── LandingPage.jsx
│   ├── services/
│   │   └── recommendation.js
│   ├── App.jsx
│   ├── App.css
│   ├── index.css
│   └── main.jsx
├── .gitignore
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

---

## 🚀 Setup & Run the App

### 1. Clone the Repository

```bash
git clone https://github.com/aryajhawar11/GPURecommenderSD-019.git
cd GPURecommenderSD-019/frontend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Start the Development Server

```bash
npm run dev
```

Now open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🧰 Key Dependencies

These will auto-install after `npm install`:

```json
"axios": "^1.x",
"lucide-react": "^0.330.x",
"react": "^18.x",
"react-dom": "^18.x",
"react-toastify": "^9.x",
"tailwindcss": "^3.x",
"vite": "^5.x"
```

---

## 🧠 Features

- 🔍 **Real-time GPU Search** based on multiple criteria
- 🧠 **AI-based Recommendations** with explanations
- 🌓 **Dark/Light Mode Toggle**
- 🔔 **Toast Notifications** for Spot Request
- 🧾 Filter by Spot or On-Demand pricing
- ✅ Explanation and requirements for each recommendation

---

## 💡 How to Use

1. Navigate to the homepage and fill in your:
   - **Workload Type**
   - **Model Size**
   - **Dataset Size**
   - **Budget** and **Budget Type**
   - **Region**
   - **Spot Instance Preference**

2. Click **“Generate Recommendations”**.

3. You'll get a list of matching GPU instances ranked with:
   - 💵 Hourly/Monthly/Yearly pricing
   - 📌 Region, OS, and Specs
   - ✅ Detailed **explanation** of why the GPU is recommended
   - 📩 Spot request with toast confirmation

---

## 🧑‍💻 Author

Made with 💻 by **Arya Jhawar**  
🔗 GitHub: [@aryajhawar11](https://github.com/aryajhawar11)

---

## 📄 License

This project is licensed under the **MIT License**.
