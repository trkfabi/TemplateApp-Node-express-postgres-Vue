import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const ConfigModel = {
  async count({ where }) {
    return await prisma.config.count({ where });
  },
  async findMany({ where, orderBy, skip, take }) {
    return await prisma.config.findMany({
      where,
      orderBy,
      skip,
      take,
    });
  },
  async findUniqueKey({ key }) {
    return await prisma.config.findUnique({
      where: { key },
    });
  },
  async create({ key, value }) {
    return await prisma.config.create({
      data: {
        key,
        value,
      },
    });
  },
  async update({ key, value }) {
    return await prisma.user.updateMany({ where: { key }, data: { value } });
  },
  async delete({ key }) {
    return await prisma.user.deleteMany({ where: { key } });
  },
};
