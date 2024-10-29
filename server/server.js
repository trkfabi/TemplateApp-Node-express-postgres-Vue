import express from "express";
import cors from "cors";
import "./env-loader.js";

import userRouter from "./routes/user.route.js";
import paymentRouter from "./routes/payment.route.js";
import apiRouter from "./routes/api.route.js";

const PORT = process.env.PORT || 3000;
const ENV = process.env.NODE_ENV || "development";

const app = express();

//let apiClient = '';
//Middleware para log de peticiones
// app.use((req, res, next) => {
//   console.log(`${req.method} ${req.url}`);

//   next();
// });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("trust proxy", true); // esto sirve para que devuelva https aunque sea con ngrok

const allowedOrigins = [
  "https://srv619903.hstgr.cloud",
  "http://localhost:4000", // Permitir localhost para desarrollo
  "http://localhost:3000",
  "http://localhost:3001",
];
app.use(
  cors({
    origin: (origin, callback) => {
      // Si no hay origen (como en herramientas como Postman), permitir la solicitud
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
    exposedHeaders: ["x-auth-token", "x-refresh-token"],
  })
);

const apiPathPreffix = process.env.API_PREFFIX || "/api/v1";

// definir aqui las rutas y controllers
app.use(
  [`${apiPathPreffix}/user`, `/staging${apiPathPreffix}/user`],
  userRouter
);
app.use(
  [`${apiPathPreffix}/apikey`, `/staging${apiPathPreffix}/apikey`],
  apiRouter
);
app.use(
  [`${apiPathPreffix}/payment`, `/staging${apiPathPreffix}/payment`],
  paymentRouter
);

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running in ${ENV || "development"} mode on port ${PORT}`);
});
