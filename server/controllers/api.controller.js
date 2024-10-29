import { JwtHelper } from "../helpers/jwt.helper.js";
import { ApiModel } from "../models/api.model.js";

export const ApiController = {
  async authenticate(req, res) {
    try {
      console.log("api.controller - authenticate()");
      const { apiKey } = req.body;

      if (!apiKey) {
        return res.status(500).json({
          success: false,
          message: "Missing required api key",
        });
      }

      const api_key = await ApiModel.findUniqueKey({ key: apiKey });
      if (!api_key) {
        return res.status(404).json({
          success: false,
          message: "Api key not registered",
        });
      }

      // Validar el dominio de origen
      const origin =
        req.headers.origin || req.headers.referer || req.headers.host;
      if (
        !api_key.originDomains.includes("*") &&
        (!origin || !api_key.originDomains.includes(origin))
      ) {
        return res.status(403).json({
          success: false,
          message: "Domain not allowed",
        });
      }

      // Validar estado de la API (e.g., activa o inactiva)
      if (!api_key.isActive) {
        return res.status(403).json({
          success: false,
          message: "API key is inactive",
        });
      }

      const { accessToken } = JwtHelper.generateJwtAuthToken({
        apiKey: api_key.key,
      });
      const { refreshToken } = JwtHelper.generateJwtRefreshToken({
        apiKey: api_key.key,
      });

      return res
        .status(200)
        .set("x-auth-token", accessToken)
        .set("x-refresh-token", refreshToken)
        .json({
          success: true,
          message: "",
        });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: "Server error",
      });
    }
  },
};
