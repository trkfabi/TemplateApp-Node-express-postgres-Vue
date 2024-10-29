import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const ApiModel = {
  async findUniqueKey({ key }) {
    return await prisma.apiKey.findUnique({ where: { key } });
  },
  async count({ where }) {
    return await prisma.apiKey.count({ where });
  },
  async findMany({ where, orderBy, skip, take }) {
    return await prisma.apiKey.findMany({
      where,
      orderBy,
      skip,
      take,
    });
  },
  async create({
    originDomains = ["*"],
    description = "",
    usageLimit = null,
    isActive = true,
  }) {
    return await prisma.apiKey.create({
      data: {
        originDomains,
        description,
        usageLimit,
        isActive,
      },
    });
  },
};
