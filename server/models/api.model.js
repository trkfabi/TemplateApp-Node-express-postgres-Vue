import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const ApiModel = {
  async findUniqueKey({ key }) {
    return await prisma.apikey.findUnique({ where: { key } });
  },
};
