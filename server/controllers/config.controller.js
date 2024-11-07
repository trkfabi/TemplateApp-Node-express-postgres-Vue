import { PrismaClient } from "@prisma/client";
import { ConfigModel } from "../models/config.model.js";

const prisma = new PrismaClient();

export const ConfigController = {
  async create(req, res) {
    const { key, value, update = false } = req.body;

    try {
      const existingKey = await ConfigModel.findUniqueKey({ key });
      if (existingKey) {
        if (!update) {
          return res.status(500).json({
            success: false,
            message: "Key already exists",
            results: null,
          });
        } else {
          const updatedConfig = await ConfigModel.update({ key, value });
          // log this action
          LogModel.create({
            type: LogType.DEBUG,
            source: "config.controller.update",
            action: "update config",
            details: {
              data: updatedConfig,
            },
          });

          return res.status(200).json({
            success: true,
            message: "Config updated successfully",
            results: { updatedConfig },
          });
        }
      }

      // Crear el nuevo usuario
      const newConfig = await ConfigModel.create({
        key,
        value,
      });

      // log this action
      LogModel.create({
        type: LogType.DEBUG,
        source: "config.controller.create",
        action: "create config",
        details: {
          data: newConfig,
        },
      });

      return res.status(201).json({
        success: true,
        message: "Config created successfully",
        results: { newConfig },
      });
    } catch (error) {
      console.error("Error in config creation:", error);
      return res.status(500).json({
        success: false,
        message: "An error occurred during config creation",
        results: null,
      });
    }
  },
  async update(req, res) {
    const { key } = req.params;
    const { value } = req.body;

    try {
      const updatedConfig = await ConfigModel.update({ key, value });
      // log this action
      await LogModel.create({
        type: LogType.DEBUG,
        source: "config.controller.update",
        action: "update config",
        details: {
          data: updatedConfig,
        },
      });

      // Devolver tokens en la respuesta
      return res.status(200).json({
        success: true,
        message: "Config updated successfully",
        results: { updatedConfig },
      });
    } catch (error) {
      console.error("Error in config update:", error);
      return res.status(500).json({
        success: false,
        message: "An error occurred during config update",
        results: null,
      });
    }
  },
  async delete(req, res) {
    const { key } = req.params;
    try {
      const config = await ConfigModel.findUniqueKey({ key });

      if (!config) {
        return res.status(404).json({
          success: false,
          message: `Key ${key} not found`,
          results: null,
        });
      }

      await ConfigModel.delete({ key });

      return res.status(200).json({
        success: true,
        message: "",
      });
    } catch (error) {
      console.error("Error deleting config:", error);
      return res
        .status(500)
        .json({ error: "An error occurred while deleting the config" });
    }
  },
  async getByKey(req, res) {
    const { key } = req.params;

    try {
      const config = await ConfigModel.findUniqueKey({ key });

      if (!config) {
        return res.status(404).json({
          success: false,
          message: `Key ${key} not found`,
          results: null,
        });
      }

      return res.status(200).json({
        success: true,
        message: "",
        results: config,
      });
    } catch (error) {
      console.error("Error fetching config:", error);
      return res
        .status(500)
        .json({ error: "An error occurred while fetching the config" });
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

      const configs = await ConfigModel.findMany({
        where,
        orderBy: { [sortby]: sortorder },
        skip: (page - 1) * limit,
        take: parseInt(limit),
      });

      const totalConfigs = await ConfigModel.count({ where });

      return res.status(200).json({
        success: true,
        message: "Configs retrieved successfully",
        results: {
          configs,
          total: totalConfigs,
          page: Number(page),
          totalPages: Math.ceil(totalConfigs / limit),
        },
      });
    } catch (error) {
      console.error("Error in fetching configs:", error);
      return res.status(500).json({
        success: false,
        message: "An error occurred while fetching configs",
        results: null,
      });
    }
  },
};
