import { Handler } from "express";

import { prisma } from "../database";
import {
  CreateCampaignRequestSchema,
  UpdateCampaignRequestSchema,
} from "./schemas/CampaignsRequestSchema";
import { HttpError } from "../errors/HttpError";

export class CampaignsController {
  index: Handler = async (req, res, next) => {
    try {
      const campaigns = await prisma.campaign.findMany();
      res.json(campaigns);
    } catch (error) {
      next(error);
    }
  };

  create: Handler = async (req, res, next) => {
    try {
      const { name, description, startDate, endDate } =
        CreateCampaignRequestSchema.parse(req.body);
      const newCampaign = await prisma.campaign.create({
        data: {
          name,
          description,
          startDate: new Date(startDate),
          endDate: endDate ? new Date(endDate) : null,
        },
      });
      res.status(201).json(newCampaign);
    } catch (error) {
      next(error);
    }
  };

  show: Handler = async (req, res, next) => {
    try {
      const id = +req.params.id;
      const campaign = await prisma.campaign.findUnique({
        where: { id },
        include: {
          leads: { include: { lead: true } },
        },
      });
      if (!campaign) throw new HttpError(404, "campanha não encontrada!");
      res.json(campaign);
    } catch (error) {
      next(error);
    }
  };

  update: Handler = async (req, res, next) => {
    try {
      const id = +req.params.id;
      const campaign = await prisma.campaign.findUnique({ where: { id } });
      if (!campaign) throw new HttpError(404, "campanha não encontrada!");

      const { name, description, startDate, endDate } =
        UpdateCampaignRequestSchema.parse(req.body);
      const updatedCampaign = await prisma.campaign.update({
        where: { id },
        data: {
          name,
          description,
          startDate: startDate ? new Date(startDate) : undefined,
          endDate: endDate ? new Date(endDate) : undefined,
        },
      });
      res.json(updatedCampaign);
    } catch (error) {
      next(error);
    }
  };

  delete: Handler = async (req, res, next) => {
    try {
      const id = +req.params.id;
      const campaign = await prisma.campaign.findUnique({ where: { id } });
      if (!campaign) throw new HttpError(404, "campanha não encontrada!");
      const deletedCampaign = await prisma.campaign.delete({ where: { id } });
      res.json({ deletedCampaign });
    } catch (error) {
      next(error);
    }
  };
}
