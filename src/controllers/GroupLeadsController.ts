import { Handler } from "express";
import { HttpError } from "../errors/HttpError";
import { GetGroupLeadsRequestSchema } from "./schemas/GroupsRequestSchema";
import { GroupsRepository } from "../repositories/GroupsRepository";
import {
  LeadsRepository,
  LeadWhereParams,
} from "../repositories/LeadsRepository";

export class GroupLeadsController {
  constructor(
    private readonly groupsRepository: GroupsRepository,
    private readonly leadsRepository: LeadsRepository
  ) {}

  getLeads: Handler = async (req, res, next) => {
    try {
      const groupId = +req.params.groupId;
      const groupExists = await this.groupsRepository.findById(groupId);
      if (!groupExists) throw new HttpError(404, "grupo não encontrado!");

      const query = GetGroupLeadsRequestSchema.parse(req.query);
      const {
        page = "1",
        pageSize = "10",
        name,
        sortBy = "name",
        order = "asc",
      } = query;

      const limit = Number(pageSize);
      const offset = (Number(page) - 1) * limit;

      const where: LeadWhereParams = { groupId };

      if (name) where.name = { like: name, mode: "insensitive" };

      const leads = await this.leadsRepository.find({
        where,
        sortBy,
        order,
        limit,
        offset,
        include: { groups: true },
      });

      const total = await this.leadsRepository.count(where);

      res.json({
        leads,
        meta: {
          total,
          pageSize: limit,
          page: +page,
          totalPages: Math.ceil(total / limit),
        },
      });
    } catch (error) {
      next(error);
    }
  };

  addLead: Handler = async (req, res, next) => {
    try {
      const groupId = +req.params.groupId;
      const groupExists = await this.groupsRepository.findById(groupId);
      if (!groupExists) throw new HttpError(404, "grupo não encontrado!");

      const leadId = +req.body.leadId;
      const leadExists = await this.leadsRepository.findById(leadId);
      if (!leadExists) throw new HttpError(404, "lead não encontrado!");

      const leadAlreadyInGroup = await this.leadsRepository.findLeadInGroup(
        groupId,
        leadId
      );
      if (leadAlreadyInGroup)
        throw new HttpError(409, "Este lead já se encontra no grupo!");

      const updatedGroup = await this.groupsRepository.addLead(groupId, leadId);

      res.status(201).json(updatedGroup);
    } catch (error) {
      next(error);
    }
  };

  removeLead: Handler = async (req, res, next) => {
    try {
      const groupId = +req.params.groupId;
      const groupExists = await this.groupsRepository.findById(groupId);
      if (!groupExists) throw new HttpError(404, "grupo não encontrado!");

      const leadId = +req.params.leadId;
      const leadInGroup = await this.leadsRepository.findLeadInGroup(
        groupId,
        leadId
      );
      if (!leadInGroup)
        throw new HttpError(404, "Este lead não se encontra no grupo!");

      const updatedGroup = await this.groupsRepository.removeLead(
        groupId,
        leadId
      );

      res.json(updatedGroup);
    } catch (error) {
      next(error);
    }
  };
}
