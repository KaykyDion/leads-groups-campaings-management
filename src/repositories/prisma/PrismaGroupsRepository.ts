import { Group } from "@prisma/client";
import { CreateGroupAttributes, GroupsRepository } from "../GroupsRepository";
import { prisma } from "../../database";

export class PrismaGroupsRepository implements GroupsRepository {
  async find(): Promise<Group[]> {
    return prisma.group.findMany();
  }

  async findById(id: number): Promise<Group | null> {
    return prisma.group.findUnique({ where: { id }, include: { leads: true } });
  }

  async create(attributes: CreateGroupAttributes): Promise<Group> {
    return prisma.group.create({ data: attributes });
  }

  async updateById(
    id: number,
    attributes: Partial<CreateGroupAttributes>
  ): Promise<Group | null> {
    return prisma.group.update({ where: { id }, data: attributes });
  }

  async deleteById(id: number): Promise<Group | null> {
    return prisma.group.delete({ where: { id } });
  }

  async addLead(groupId: number, leadId: number): Promise<Group> {
    return prisma.group.update({
      where: { id: groupId },
      data: { leads: { connect: { id: leadId } } },
      include: { leads: true },
    });
  }

  async removeLead(groupId: number, leadId: number): Promise<Group> {
    return await prisma.group.update({
      where: { id: groupId },
      data: { leads: { disconnect: { id: leadId } } },
      include: { leads: true },
    });
  }
}
