import { JwtHelper } from "../helpers/jwt.helper.js";
import { ApiModel } from "../models/api.model.js";

export const ApiController = {
  async create(req, res) {
    try {
      const { originDomains, description, usageLimit } = req.body;

      const newApiKey = await ApiModel.create({
        originDomains,
        description,
        usageLimit,
      });

      return res.status(201).json({
        success: true,
        message: "Api Key created",
        results: newApiKey,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: "Server error",
      });
    }
  },
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

  async all(req, res) {
    const {
      page = 1,
      limit = 10,
      sortby = "createdAt",
      sortorder = "asc",
      filter,
    } = req.query;

    try {
      const where = {};
      if (filter) {
        // Convertir el filtro en un formato utilizable para Prisma
        const filters = JSON.parse(filter);

        filters.forEach(({ key, operator, value }) => {
          if (operator === "like") {
            where[key] = { contains: value, mode: "insensitive" }; // Eliminar el '%' para la consulta
          } else if (operator === "=") {
            where[key] = value; // Para el operador '=', se asigna el valor directamente
          }
          // agregar mas filtros aca
        });
      }

      const apikeys = await ApiModel.findMany({
        where,
        orderBy: { [sortby]: sortorder },
        skip: (page - 1) * limit,
        take: parseInt(limit),
      });

      const total = await ApiModel.count({ where });

      res.status(200).json({
        success: true,
        message: "Api keys retrieved successfully",
        results: {
          apikeys,
          total: total,
          page: Number(page),
          totalPages: Math.ceil(total / limit),
        },
      });
    } catch (error) {
      console.error("Error in fetching api keys:", error);
      res.status(500).json({
        success: false,
        message: "An error occurred while fetching api keys",
        results: null,
      });
    }
  },
};
