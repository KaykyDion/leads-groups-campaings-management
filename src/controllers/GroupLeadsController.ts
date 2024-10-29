import { Handler } from "express";
import { prisma } from "../database";
import { HttpError } from "../errors/HttpError";
import { GetGroupLeadsRequestSchema } from "./schemas/GroupsRequestSchema";

export class GroupLeadsController {
  getLeads: Handler = async (req, res, next) => {
    try {
      const groupId = +req.params.groupId;
      const groupExists = await prisma.group.findUnique({
        where: { id: groupId },
      });
      if (!groupExists) throw new HttpError(404, "grupo não encontrado!");

      const query = GetGroupLeadsRequestSchema.parse(req.query);
      const {
        page = "1",
        pageSize = "10",
        name,
        sortBy = "name",
        order = "asc",
      } = query;

      const pageSizeNumber = +pageSize;
      const pageNumber = +page;

      const group = await prisma.group.findUnique({
        where: { id: groupId },
        select: {
          leads: {
            take: pageSizeNumber,
            skip: pageSizeNumber * (pageNumber - 1),
            orderBy: { [sortBy]: order },
            include: {
              groups: true,
            },
            where: {
              name: { contains: name, mode: "insensitive" },
            },
          },
        },
      });

      const total = await prisma.lead.count({
        where: {
          groups: {
            some: {
              id: groupId,
            },
          },
        },
      });

      res.json({
        group,
        meta: {
          total,
          pageSize: pageSizeNumber,
          page: pageNumber,
          totalPages: Math.ceil(total / pageSizeNumber),
        },
      });
    } catch (error) {
      next(error);
    }
  };

  addLead: Handler = async (req, res, next) => {
    try {
      const groupId = +req.params.groupId;
      const groupExists = await prisma.group.findUnique({
        where: { id: groupId },
      });
      if (!groupExists) throw new HttpError(404, "grupo não encontrado!");

      const leadId = +req.body.leadId;
      const leadExists = await prisma.lead.findUnique({
        where: { id: leadId },
      });
      if (!leadExists) throw new HttpError(404, "lead não encontrado!");

      const leadAlreadyInGroup = await prisma.group.findUnique({
        where: {
          id: groupId,
          leads: {
            some: {
              id: leadId,
            },
          },
        },
      });
      if (leadAlreadyInGroup)
        throw new HttpError(409, "Este lead já se encontra no grupo!");

      const addedLead = await prisma.group.update({
        where: { id: groupId },
        data: {
          leads: { connect: { id: leadId } },
        },
        select: {
          leads: { where: { id: leadId } },
        },
      });

      res.status(201).json({ addedLead });
    } catch (error) {
      next(error);
    }
  };

  removeLead: Handler = async (req, res, next) => {
    try {
      const groupId = +req.params.groupId;
      const groupExists = await prisma.group.findUnique({
        where: { id: groupId },
      });
      if (!groupExists) throw new HttpError(404, "grupo não encontrado!");

      const leadId = +req.params.leadId;
      const leadInGroup = await prisma.group.findUnique({
        where: {
          id: groupId,
          leads: { some: { id: leadId } },
        },
      });
      if (!leadInGroup)
        throw new HttpError(404, "Este lead não se encontra no grupo!");

      const updatedGroup = await prisma.group.update({
        where: { id: groupId },
        data: {
          leads: { disconnect: { id: leadId } },
        },
      });

      res.json({ message: "lead removido com sucesso!" });
    } catch (error) {
      next(error);
    }
  };
}
