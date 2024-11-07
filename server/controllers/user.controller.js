import { LogType, PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";
import { JwtHelper } from "../helpers/jwt.helper.js";
import { UserModel } from "../models/user.model.js";
import { UserSessionModel } from "../models/userSession.model.js";
import { LogModel } from "../models/log.model.js";

const prisma = new PrismaClient();

export const UserController = {
  // Registro de nuevo usuario
  async register(req, res) {
    const { email, password } = req.body;

    try {
      // Verificar si el usuario ya existe
      const existingUser = await UserModel.findUniqueEmail({ email });
      if (existingUser) {
        return res.status(401).json({
          success: false,
          message: "User already exists",
          results: null,
        });
      }

      // Hashear la contraseña
      const hashedPassword = await bcrypt.hash(password, 10);

      // Crear el nuevo usuario
      const user = await UserModel.create({
        email,
        hashedPassword,
        role: Role.USER,
      });
      const { accessToken } = JwtHelper.generateJwtAuthToken({
        email,
        role: user.profile.role,
      });
      const { refreshToken, expirationDate } =
        JwtHelper.generateJwtRefreshToken({
          email,
          role: user.profile.role,
        });

      // Guardar Refresh Token en UserSession
      await UserSessionModel.create({
        userId: user.id,
        accessToken,
        refreshToken,
        expiresAt: new Date(expirationDate * 1000),
      });

      // log this action
      LogModel.create({
        type: LogType.DEBUG,
        source: "user.controller.register",
        action: "create user",
        details: {
          data: user,
        },
      });

      // Devolver tokens en la respuesta
      return res
        .status(201)
        .set("x-auth-token", accessToken)
        .set("x-refresh-token", refreshToken)
        .json({
          success: true,
          message: "User registered successfully",
          results: { user },
        });
    } catch (error) {
      console.error("Error in register:", error);
      return res.status(500).json({
        success: false,
        message: "An error occurred during registration",
        results: null,
      });
    }
  },

  async login(req, res) {
    const { email, password } = req.body;

    try {
      const user = await UserModel.findUniqueEmail({
        email,
        includeProfile: true,
      });
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
          results: null,
        });
      }

      const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          message: "Invalid password",
          results: null,
        });
      }

      const { accessToken } = JwtHelper.generateJwtAuthToken({
        email,
        role: user.profile.role,
      });
      const { refreshToken, expirationDate } =
        JwtHelper.generateJwtRefreshToken({
          email,
          role: user.profile.role,
        });

      await UserSessionModel.create({
        userId: user.id,
        accessToken,
        refreshToken,
        expiresAt: new Date(expirationDate * 1000),
      });

      return res
        .status(200)
        .set("x-auth-token", accessToken)
        .set("x-refresh-token", refreshToken)
        .json({
          success: true,
          message: "Login successful",
          results: { user },
        });
    } catch (error) {
      console.error("Error in login:", error);
      return res.status(500).json({
        success: false,
        message: "An error occurred during login",
        results: null,
      });
    }
  },
  async logout(req, res) {
    const refreshToken = req.headers["set-refresh-token"];

    if (!refreshToken) {
      return res.status(400).json({
        success: false,
        message: "Refresh token not provided",
      });
    }

    try {
      // Verificar si la sesión con el refreshToken existe
      const session = await UserSessionModel.findUnique({ refreshToken });

      if (!session) {
        return res.status(404).json({
          success: false,
          message: "Session not found",
        });
      }

      // Eliminar la sesión de la base de datos
      await UserSessionModel.delete({
        where: { refreshToken },
      });

      return res.status(200).json({
        success: true,
        message: "User logged out successfully",
        results: null,
      });
    } catch (error) {
      console.error("Error during logout:", error);
      return res.status(500).json({
        success: false,
        message: "An error occurred during logout",
        results: null,
      });
    }
  },
  async refreshToken(req, res) {
    const { refreshToken } = req.body;

    try {
      const session = await UserSession.findUnique({
        where: { refreshToken },
      });
      if (
        !session ||
        session.expiresAt < new Date() ||
        !JwtHelper.verifyJwtRefreshToken(refreshToken)
      ) {
        return res.status(400).json({
          success: false,
          message: "Invalid or expired refresh token",
          results: null,
        });
      }

      const newAccessToken = JwtHelper.generateJwtAuthToken({
        email: session.user.email,
        role: session.user.profile.role,
      });

      return res
        .status(200)
        .set("x-auth-token", newAccessToken)
        .set("x-refresh-token", refreshToken)
        .json({
          success: true,
          message: "Access token refreshed successfully",
          results: [],
        });
    } catch (error) {
      console.error("Error in refresh token:", error);
      return res.status(500).json({
        success: false,
        message: "An error occurred while refreshing token",
        results: null,
      });
    }
  },
  async getUserById(req, res) {
    const { userId } = req.params;

    try {
      const user = await UserModel.findUniqueId({
        id: Number(userId),
        includeProfile: true, // Incluir el perfil relacionado
      });

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
          results: null,
        });
      }

      return res.status(200).json({
        success: true,
        message: "",
        results: user,
      });
    } catch (error) {
      console.error("Error fetching user:", error);
      return res
        .status(500)
        .json({ error: "An error occurred while fetching the user" });
    }
  },
  async getUserMe(req, res) {
    const { email } = req;

    try {
      const user = await UserModel.findUniqueEmail({
        email,
        includeProfile: true, // Incluir el perfil relacionado
      });
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
          results: null,
        });
      }

      return res.status(200).json({
        success: true,
        message: "",
        results: user,
      });
    } catch (error) {
      console.error("Error fetching user:", error);
      return res
        .status(500)
        .json({ error: "An error occurred while fetching the user" });
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

      // filter seria algo asi:
      //   const filters = [
      //     { key: 'firstName', operator: 'like', value: 'Jo' },
      //     { key: 'lastName', operator: 'like', value: 'Smi' },
      //   ];

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

      const users = await UserModel.findMany({
        where,
        orderBy: { [sortby]: sortorder },
        skip: (page - 1) * limit,
        take: parseInt(limit),
        include: { profile: true },
      });

      const totalUsers = await UserModel.count({ where });

      return res.status(200).json({
        success: true,
        message: "Users retrieved successfully",
        results: {
          users,
          total: totalUsers,
          page: Number(page),
          totalPages: Math.ceil(totalUsers / limit),
        },
      });
    } catch (error) {
      console.error("Error in fetching users:", error);
      return res.status(500).json({
        success: false,
        message: "An error occurred while fetching users",
        results: null,
      });
    }
  },
};
