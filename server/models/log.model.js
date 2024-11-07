import { LogType, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const LogModel = {
  async count({ where }) {
    return await prisma.log.count({ where });
  },
  async create({
    type = LogType.INFO,
    source = "",
    action = "",
    details = [],
  }) {
    return await prisma.log.create({
      data: {
        type,
        source,
        action,
        details,
      },
    });
  },
  async findMany({ where, orderBy, skip, take }) {
    return await prisma.log.findMany({
      where,
      orderBy,
      skip,
      take,
    });
  },
};
