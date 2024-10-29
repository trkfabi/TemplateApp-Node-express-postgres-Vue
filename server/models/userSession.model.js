import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const UserSessionModel = {
  async findUnique({ refreshToken }) {
    return await prisma.userSession.findFirst({ where: { refreshToken } });
  },
  async create({ userId, accessToken, refreshToken, expiresAt }) {
    return await prisma.userSession.create({
      data: {
        userId,
        token: "", // mejor no guardar el access token, ya que no se usa para nada aqui
        refreshToken, // verifyToken verifica contra este
        expiresAt,
      },
    });
  },
  async update({ id, data }) {
    return await prisma.userSession.update({ where: { id }, data });
  },
  async delete({ refreshToken }) {
    return await prisma.userSession.deleteMany({ where: { refreshToken } });
  },
};
