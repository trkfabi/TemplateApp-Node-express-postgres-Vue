import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const UserModel = {
  async count({ where }) {
    return await prisma.user.count({ where });
  },
  async findMany({ where, orderBy, skip, take, includeProfile }) {
    return await prisma.user.findMany({
      where,
      orderBy,
      skip,
      take,
      include: { profile: includeProfile },
    });
  },
  async findUniqueId({ id, includeProfile = false }) {
    return await prisma.user.findUnique({
      where: { id },
      include: { profile: includeProfile },
    });
  },
  async findUniqueEmail({ email, includeProfile = false }) {
    return await prisma.user.findUnique({
      where: { email },
      include: { profile: includeProfile },
    });
  },
  async create({ email, hashedPassword, role, firstName = "", lastName = "" }) {
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash: hashedPassword,
        profile: {
          create: {
            role,
            firstName,
            lastName,
          },
        },
      },
    });
    return await this.findUniqueId({
      id: user.id,
      includeProfile: true,
    });
  },
  async update({ id, data }) {
    return await prisma.user.update({ where: { id }, data });
  },
  async delete({ id }) {
    return await prisma.user.delete({ where: { id } });
  },
};
