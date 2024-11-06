import { Handler } from "express";
import {
  AddLeadRequestSchema,
  GetCampaignLeadsRequestSchema,
  UpdateLeadStatusRequestSchema,
} from "./schemas/CampaignsRequestSchema";
import { LeadsService } from "../services/LeadsService";
import { CampaignsService } from "../services/CampaignsService";

export class CampaignLeadsController {
  constructor(
    private readonly leadsService: LeadsService,
    private readonly campaignsService: CampaignsService
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

      const leads = await this.leadsService.getAllLeadsPaginated({
        campaignId,
        name,
        order,
        sortBy,
        include: { campaigns: true },
        page: +page,
        pageSize: +pageSize,
        campaignStatus: status,
      });

      res.json(leads);
    } catch (error) {
      next(error);
    }
  };

  addLead: Handler = async (req, res, next) => {
    try {
      const { leadId, status } = AddLeadRequestSchema.parse(req.body);
      const campaignId = +req.params.campaignId;
      const leadCampaign = await this.campaignsService.addLeadToCampaign(
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
      const updatedLeadCampaign = await this.campaignsService.updateLeadStatus(
        +campaignId,
        +leadId,
        status
      );
      res.json(updatedLeadCampaign);
    } catch (error) {
      next(error);
    }
  };

  removeLead: Handler = async (req, res, next) => {
    try {
      const campaignId = +req.params.campaignId;
      const leadId = +req.params.leadId;
      const removedLead = await this.campaignsService.removeLeadFromCampaign(
        campaignId,
        leadId
      );
      res.json({ removedLead });
    } catch (error) {
      next(error);
    }
  };
}
