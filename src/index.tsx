import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { HashRouter } from 'react-router-dom';

// 添加字體預載入
const link = document.createElement('link');
link.rel = 'stylesheet';
link.href = 'https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@300;400;500;700&display=swap';
document.head.appendChild(link);

// 添加 Android 相容性修復
const fixAndroidCompatibility = () => {
  // 修復某些 Android 設備的 WebView 問題
  if (typeof window !== 'undefined') {
    // 強制重新計算佈局
    window.addEventListener('resize', () => {
      document.body.style.height = `${window.innerHeight}px`;
    });
    
    // 修復觸摸事件問題
    document.addEventListener('touchstart', () => {}, { passive: true });
    document.addEventListener('touchmove', () => {}, { passive: true });
    
    // 修復某些設備的滾動問題
    document.body.style.overflow = 'auto';
    (document.body.style as any)['-webkit-overflow-scrolling'] = 'touch';
    
    // 修復 HashRouter 在某些 Android 設備上的問題
    if (window.location.hash === '') {
      window.location.hash = '#/';
    }
  }
};

// 確保 DOM 完全載入後再初始化 React
const initializeApp = () => {
  try {
    const rootElement = document.getElementById('root');
    if (!rootElement) {
      console.error('Root element not found');
      return;
    }

    // 應用 Android 相容性修復
    fixAndroidCompatibility();

    const root = ReactDOM.createRoot(rootElement);
    
    root.render(
      <HashRouter>
        <App />
      </HashRouter>
    );
    
    // 隱藏載入畫面
    setTimeout(() => {
      const loadingScreen = document.getElementById('loading-screen');
      if (loadingScreen) {
        loadingScreen.style.opacity = '0';
        loadingScreen.style.transition = 'opacity 0.5s ease';
        setTimeout(() => {
          loadingScreen.style.display = 'none';
        }, 500);
      }
    }, 1500); // 延長到 1.5 秒確保完全載入
  } catch (error) {
    console.error('React initialization failed:', error);
    // 如果初始化失敗，至少隱藏載入畫面
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
      loadingScreen.style.display = 'none';
    }
  }
};

// 等待 DOM 載入完成
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeApp);
} else {
  initializeApp();
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
