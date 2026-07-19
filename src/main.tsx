import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom"; // 1. BrowserRouter 임포트
import "./index.css";
import App from "./App.tsx";
import './components/i18n.ts';


createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      {/* 2. App 전체를 감싸줌 */}
      <App />
    </BrowserRouter>
  </StrictMode>,
);
