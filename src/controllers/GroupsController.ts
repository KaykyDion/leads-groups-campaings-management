import { Handler } from "express";
import {
  CreateGroupRequestSchema,
  UpdateGroupRequestSchema,
} from "./schemas/GroupsRequestSchema";
import { GroupsService } from "../services/GroupsService";

export class GroupsController {
  constructor(private readonly groupsService: GroupsService) {}

  index: Handler = async (req, res, next) => {
    try {
      const groups = await this.groupsService.getAllGroups();
      res.json(groups);
    } catch (error) {
      next(error);
    }
  };

  create: Handler = async (req, res, next) => {
    try {
      const body = CreateGroupRequestSchema.parse(req.body);
      const newGroup = await this.groupsService.createGroup(body);
      res.status(201).json(newGroup);
    } catch (error) {
      next(error);
    }
  };

  show: Handler = async (req, res, next) => {
    try {
      const id = +req.params.id;
      const group = await this.groupsService.getGroupById(id);
      res.json(group);
    } catch (error) {
      next(error);
    }
  };

  update: Handler = async (req, res, next) => {
    try {
      const id = +req.params.id;
      const body = UpdateGroupRequestSchema.parse(req.body);
      const updatedGroup = await this.groupsService.updateGroup(id, body);
      res.json(updatedGroup);
    } catch (error) {
      next(error);
    }
  };

  delete: Handler = async (req, res, next) => {
    try {
      const id = +req.params.id;
      const deletedGroup = await this.groupsService.deleteGroup(id);
      res.json({ deletedGroup });
    } catch (error) {
      next(error);
    }
  };
}
