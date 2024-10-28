import { Handler } from "express";
import { Prisma } from "@prisma/client";
import {
  AddLeadRequestSchema,
  GetCampaignLeadsRequestSchema,
  UpdateLeadStatusRequestSchema,
} from "./schemas/CampaignsRequestSchema";
import { prisma } from "../database";

export class CampaignLeadsController {
  getLeads: Handler = async (req, res, next) => {
    try {
      const campaignId = +req.params.campaignId;
      const query = GetCampaignLeadsRequestSchema.parse(req.query);
      const {
        page = "1",
        pageSize = "10",
        name,
        status,
        sortBy = "name",
        order = "asc",
      } = query;

      const pageNumber = +page;
      const pageSizeNumber = +pageSize;

      const where: Prisma.LeadWhereInput = {
        campaigns: {
          some: { campaignId },
        },
      };

      if (name) where.name = { contains: name, mode: "insensitive" };
      if (status) where.campaigns = { some: { status } };

      const leads = await prisma.lead.findMany({
        where,
        orderBy: { [sortBy]: order },
        skip: (pageNumber - 1) * pageSizeNumber,
        take: pageSizeNumber,
        include: {
          campaigns: {
            select: {
              campaignId: true,
              leadId: true,
              status: true,
            },
          },
        },
      });

      const total = await prisma.lead.count({ where });

      res.json({
        leads,
        meta: {
          page: pageNumber,
          pageSize: pageSizeNumber,
          total,
          totalPages: Math.ceil(total / pageSizeNumber),
        },
      });
    } catch (error) {
      next(error);
    }
  };

  addLead: Handler = async (req, res, next) => {
    try {
      const body = AddLeadRequestSchema.parse(req.body);
      await prisma.leadCampaign.create({
        data: {
          campaignId: +req.params.campaignId,
          leadId: body.leadId,
          status: body.status,
        },
      });
      res.status(201).end();
    } catch (error) {
      next(error);
    }
  };

  updateLeadStatus: Handler = async (req, res, next) => {
    try {
      const body = UpdateLeadStatusRequestSchema.parse(req.body);
      const updatedLeadCampaign = await prisma.leadCampaign.update({
        data: body,
        where: {
          leadId_campaignId: {
            campaignId: +req.params.campaignId,
            leadId: +req.params.leadId,
          },
        },
      });
      res.json(updatedLeadCampaign);
    } catch (error) {
      next(error);
    }
  };

  removeLead: Handler = async (req, res, next) => {
    try {
      const removedLead = await prisma.leadCampaign.delete({
        where: {
          leadId_campaignId: {
            campaignId: +req.params.campaignId,
            leadId: +req.params.leadId,
          },
        },
      });
      res.json({ removedLead });
    } catch (error) {
      next(error);
    }
  };
}
