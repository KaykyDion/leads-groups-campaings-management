import { Handler } from "express";
import {
  AddLeadRequestSchema,
  GetCampaignLeadsRequestSchema,
  UpdateLeadStatusRequestSchema,
} from "./schemas/CampaignsRequestSchema";
import {
  LeadsRepository,
  LeadWhereParams,
} from "../repositories/LeadsRepository";
import { CampaignsRepository } from "../repositories/CampaignsRepository";

export class CampaignLeadsController {
  constructor(
    private readonly leadsRepository: LeadsRepository,
    private readonly campaignsRepository: CampaignsRepository
  ) {}

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
      const limit = +pageSize;
      const offset = (pageNumber - 1) * limit;

      const where: LeadWhereParams = { campaignId };

      if (name) where.name = { like: name, mode: "insensitive" };
      if (status) where.campaignStatus = status;

      const leads = await this.leadsRepository.find({
        where,
        order,
        sortBy,
        limit,
        offset,
      });

      const total = await this.leadsRepository.count(where);

      res.json({
        leads,
        meta: {
          page: pageNumber,
          pageSize: limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      });
    } catch (error) {
      next(error);
    }
  };

  addLead: Handler = async (req, res, next) => {
    try {
      const { leadId, status } = AddLeadRequestSchema.parse(req.body);
      const campaignId = +req.params.campaignId;

      const leadCampaign = await this.campaignsRepository.addLead(
        campaignId,
        leadId,
        status
      );
      res.status(201).json({ message: "lead added succefully:", leadCampaign });
    } catch (error) {
      next(error);
    }
  };

  updateLeadStatus: Handler = async (req, res, next) => {
    try {
      const { status } = UpdateLeadStatusRequestSchema.parse(req.body);
      const { campaignId, leadId } = req.params;
      const updatedLeadCampaign =
        await this.campaignsRepository.updateLeadStatus(
          status,
          +campaignId,
          +leadId
        );
      res.json(updatedLeadCampaign);
    } catch (error) {
      next(error);
    }
  };

  removeLead: Handler = async (req, res, next) => {
    try {
      const { campaignId, leadId } = req.params;
      const removedLead = await this.campaignsRepository.removeLead(
        +campaignId,
        +leadId
      );
      res.json({ removedLead });
    } catch (error) {
      next(error);
    }
  };
}
