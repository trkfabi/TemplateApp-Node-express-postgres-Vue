import { PrismaClient } from "@prisma/client";
import { LogModel } from "../models/log.model.js";

const prisma = new PrismaClient();

export const LogController = {
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

      const logs = await LogModel.findMany({
        where,
        orderBy: { [sortby]: sortorder },
        skip: (page - 1) * limit,
        take: parseInt(limit),
      });

      const totalLogs = await LogModel.count({ where });

      return res.status(200).json({
        success: true,
        message: "Logs retrieved successfully",
        results: {
          logs,
          total: totalLogs,
          page: Number(page),
          totalPages: Math.ceil(totalLogs / limit),
        },
      });
    } catch (error) {
      console.error("Error in fetching logs:", error);
      return res.status(500).json({
        success: false,
        message: "An error occurred while fetching logs",
        results: null,
      });
    }
  },
};
