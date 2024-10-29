import { JwtHelper } from "../helpers/jwt.helper.js";
import { UserSessionModel } from "../models/userSession.model.js";

export const verifyToken = async (req, res, next) => {
  let token = req.headers.authorization;
  let refresh_token = req.headers["set-refresh-token"];

  if (!token) {
    return res.status(401).json({
      success: false,
      message:
        "Token not provided. Please use `Authorization: Bearer XXXXX` header",
    });
  }

  // Check if session exists for this accessToken
  const session = await UserSessionModel.findUnique({
    where: { accessToken: token },
  });

  if (!session) {
    return res.status(401).json({
      success: false,
      message: "Session not found. Please log in again.",
    });
  }

  token = token.split(" ")[1]; // separar Bearer y Token

  try {
    const { email, apiKey, role } = JwtHelper.verifyJwtAuthToken(token);

    // Actualizar lastAccessAt a la fecha y hora actual
    await UserSessionModel.update({
      id: session.id,
      data: { lastAccessedAt: new Date() },
    });

    // inyecto los datos del payload
    req.email = email;
    req.apiKey = apiKey;
    req.role = role;

    next();
  } catch (error) {
    console.error(error);
    if (error.name === "TokenExpiredError") {
      if (!refresh_token) {
        return res.status(400).json({
          success: false,
          message:
            "Authentication token expired. Use `set-refresh-token` header to send refresh token.",
        });
      }
      //   // tengo refresh token, lo valido
      try {
        const { email, apiKey, role } =
          JwtHelper.verifyJwtRefreshToken(refresh_token);

        const { accessToken } = JwtHelper.generateJwtAuthToken({
          email,
          role,
          apiKey,
        });
        req.headers["x-auth-token"] = accessToken;
        req.email = email;
        req.apiKey = apiKey;
        req.role = role;

        next();
      } catch (refresh_error) {
        // if refresh token was not expired, then it is not valid
        return res.status(400).json({
          success: false,
          message: "Refresh token expired or not valid",
        });
      }
    } else {
      console.log("Token invalido:", error.message);
      return res.status(400).json({
        success: false,
        message: "Token not valid",
      });
    }
  }
};

export const verifyAdmin = (req, res, next) => {
  if (req.role.toUpperCase() !== "ADMIN") {
    return res.status(403).json({
      success: false,
      message: "Unauthorized user",
    });
  }

  next();
};

export const verifySuperAdmin = (req, res, next) => {
  if (req.role.toUpperCase() !== "SUPERADMIN") {
    return res.status(403).json({
      success: false,
      message: "Unauthorized user",
    });
  }

  next();
};

export const verifyApi = (req, res, next) => {
  if (!req.apiKey || (req.apiKey && req.apiKey.length <= 0)) {
    return res.status(403).json({
      success: false,
      message: "Unauthorized api",
    });
  }

  next();
};
