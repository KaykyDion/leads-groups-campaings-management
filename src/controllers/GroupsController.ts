import { Handler } from "express";
import {
  CreateGroupRequestSchema,
  UpdateGroupRequestSchema,
} from "./schemas/GroupsRequestSchema";
import { HttpError } from "../errors/HttpError";
import { GroupsRepository } from "../repositories/GroupsRepository";

export class GroupsController {
  constructor(private readonly groupsRepository: GroupsRepository) {}

  index: Handler = async (req, res, next) => {
    try {
      const groups = await this.groupsRepository.find();
      res.json(groups);
    } catch (error) {
      next(error);
    }
  };

  create: Handler = async (req, res, next) => {
    try {
      const body = CreateGroupRequestSchema.parse(req.body);
      const newGroup = await this.groupsRepository.create(body);
      res.status(201).json(newGroup);
    } catch (error) {
      next(error);
    }
  };

  show: Handler = async (req, res, next) => {
    try {
      const group = await this.groupsRepository.findById(+req.params.id);
      if (!group) throw new HttpError(404, "grupo não encontrado!");
      res.json(group);
    } catch (error) {
      next(error);
    }
  };

  update: Handler = async (req, res, next) => {
    try {
      const id = +req.params.id;
      const body = UpdateGroupRequestSchema.parse(req.body);
      const updatedGroup = await this.groupsRepository.updateById(id, body);
      if (!updatedGroup) throw new HttpError(404, "grupo não encontrado!");
      res.json(updatedGroup);
    } catch (error) {
      next(error);
    }
  };

  delete: Handler = async (req, res, next) => {
    try {
      const id = +req.params.id;
      const deletedGroup = await this.groupsRepository.deleteById(id);
      if (!deletedGroup) throw new HttpError(404, "grupo não encontrado!");
      res.json({ deletedGroup });
    } catch (error) {
      next(error);
    }
  };
}
