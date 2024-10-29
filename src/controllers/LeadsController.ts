import { Handler } from "express";
import { prisma } from "../database";
import {
  CreateLeadRequestSchema,
  GetLeadsRequestSchema,
  UpdateLeadRequestSchema,
} from "./schemas/LeadsRequestSchema";
import { HttpError } from "../errors/HttpError";
import { Prisma } from "@prisma/client";

export class LeadsController {
  index: Handler = async (req, res, next) => {
    try {
      const query = GetLeadsRequestSchema.parse(req.query);
      const {
        page = "1",
        pageSize = "10",
        name,
        status,
        sortBy = "name",
        order = "asc",
      } = query;

      const pageNumber = Number(page);
      const pageSizeNumber = Number(pageSize);

      const where: Prisma.LeadWhereInput = {};

      if (name) where.name = { contains: name, mode: "insensitive" };
      if (status) where.status = status;

      const leads = await prisma.lead.findMany({
        where,
        skip: (pageNumber - 1) * pageSizeNumber,
        take: pageSizeNumber,
        orderBy: { [sortBy]: order },
      });

      const total = await prisma.lead.count({ where });

      res.json({
        data: leads,
        meta: {
          page: pageNumber,
          pageSize: pageSizeNumber,
          total,
          totalPages: Math.ceil(total / pageNumber),
        },
      });
    } catch (error) {
      next(error);
    }
  };

  create: Handler = async (req, res, next) => {
    try {
      const body = CreateLeadRequestSchema.parse(req.body);
      const newLead = await prisma.lead.create({
        data: body,
      });
      res.status(201).json(newLead);
    } catch (error) {
      next(error);
    }
  };

  show: Handler = async (req, res, next) => {
    try {
      const lead = await prisma.lead.findUnique({
        where: { id: +req.params.id },
        include: { groups: true, campaigns: true },
      });

      if (!lead) throw new HttpError(404, "Lead não encontrado!");

      res.json(lead);
    } catch (error) {
      next(error);
    }
  };

  update: Handler = async (req, res, next) => {
    try {
      const { id } = req.params;
      const body = UpdateLeadRequestSchema.parse(req.body);

      const leadToUpdate = await prisma.lead.findUnique({ where: { id: +id } });
      if (!leadToUpdate) throw new HttpError(404, "Lead não encontrado!");

      if (
        leadToUpdate.status === "New" &&
        body.status !== undefined &&
        body.status !== "Contacted"
      ) {
        throw new HttpError(
          400,
          "um novo lead deve ser contatado antes de ter seu status atualizado para outros valores"
        );
      }

      if (body.status && body.status === "Archived") {
        const now = new Date();
        const diffTime = Math.abs(
          now.getTime() - leadToUpdate.updatedAt.getTime()
        );
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        if (diffDays < 180)
          throw new HttpError(
            400,
            "um lead só pode ser arquivado após seis meses de inatividade"
          );
      }

      const updatedLead = await prisma.lead.update({
        data: { ...body },
        where: { id: +id },
      });
      res.json({ message: "Lead atualizado com sucesso", updatedLead });
    } catch (error) {
      next(error);
    }
  };

  delete: Handler = async (req, res, next) => {
    try {
      const { id } = req.params;
      const leadToDelete = await prisma.lead.findUnique({ where: { id: +id } });
      if (!leadToDelete) throw new HttpError(404, "Lead não encontrado!");

      const deletedLead = await prisma.lead.delete({ where: { id: +id } });
      res.json({ message: `Lead deletado com sucesso!`, deletedLead });
    } catch (error) {
      next(error);
    }
  };
}
