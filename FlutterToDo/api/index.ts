import express from "express";
import { registerRoutes } from "../server/routes";

const app = express();

// Настройка для Vercel
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Регистрация маршрутов
registerRoutes(app);

export default app;