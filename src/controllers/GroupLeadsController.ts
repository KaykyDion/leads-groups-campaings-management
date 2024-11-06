import { Handler } from "express";
import { GetGroupLeadsRequestSchema } from "./schemas/GroupsRequestSchema";
import { GroupsService } from "../services/GroupsService";
import { LeadsService } from "../services/LeadsService";

export class GroupLeadsController {
  constructor(
    private readonly groupsService: GroupsService,
    private readonly leadsService: LeadsService
  ) {}

  getLeads: Handler = async (req, res, next) => {
    try {
      const groupId = +req.params.groupId;
      await this.groupsService.getGroupById(groupId);
      const query = GetGroupLeadsRequestSchema.parse(req.query);
      const { page = "1", pageSize = "10" } = query;

      const leads = await this.leadsService.getAllLeadsPaginated({
        ...query,
        page: +page,
        pageSize: +pageSize,
        include: { groups: true },
        groupId,
      });

      res.json(leads);
    } catch (error) {
      next(error);
    }
  };

  addLead: Handler = async (req, res, next) => {
    try {
      const groupId = +req.params.groupId;
      const leadId = +req.body.leadId;
      const updatedGroup = await this.groupsService.addLeadToGroup(
        groupId,
        leadId
      );
      res.status(201).json(updatedGroup);
    } catch (error) {
      next(error);
    }
  };

  removeLead: Handler = async (req, res, next) => {
    try {
      const groupId = +req.params.groupId;
      const leadId = +req.params.leadId;
      const updatedGroup = await this.groupsService.removeLeadFromGroup(
        groupId,
        leadId
      );
      res.json(updatedGroup);
    } catch (error) {
      next(error);
    }
  };
}
