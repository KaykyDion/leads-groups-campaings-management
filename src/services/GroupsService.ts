import { HttpError } from "../errors/HttpError";
import {
  CreateGroupAttributes,
  GroupsRepository,
} from "../repositories/GroupsRepository";
import { LeadsRepository } from "../repositories/LeadsRepository";

export class GroupsService {
  constructor(
    private readonly groupsRepository: GroupsRepository,
    private readonly leadsRepository: LeadsRepository
  ) {}
  async getAllGroups() {
    const groups = await this.groupsRepository.find();
    return groups;
  }

  async createGroup(params: CreateGroupAttributes) {
    const newGroup = await this.groupsRepository.create(params);
    return newGroup;
  }

  async getGroupById(id: number) {
    const group = await this.groupsRepository.findById(id);
    if (!group) throw new HttpError(404, "grupo não encontrado!");
    return group;
  }

  async updateGroup(id: number, params: Partial<CreateGroupAttributes>) {
    const updatedGroup = await this.groupsRepository.updateById(id, params);
    if (!updatedGroup) throw new HttpError(404, "grupo não encontrado!");
    return updatedGroup;
  }

  async deleteGroup(id: number) {
    const deletedGroup = await this.groupsRepository.deleteById(id);
    if (!deletedGroup) throw new HttpError(404, "grupo não encontrado!");
    return deletedGroup;
  }

  async addLeadToGroup(groupId: number, leadId: number) {
    const groupExists = await this.groupsRepository.findById(groupId);
    if (!groupExists) throw new HttpError(404, "grupo não encontrado!");

    const leadExists = await this.leadsRepository.findById(leadId);
    if (!leadExists) throw new HttpError(404, "lead não encontrado!");

    const leadAlreadyInGroup = await this.leadsRepository.findLeadInGroup(
      groupId,
      leadId
    );
    if (leadAlreadyInGroup)
      throw new HttpError(409, "Este lead já se encontra no grupo!");

    return await this.groupsRepository.addLead(groupId, leadId);
  }

  async removeLeadFromGroup(groupId: number, leadId: number) {
    const groupExists = await this.groupsRepository.findById(groupId);
    if (!groupExists) throw new HttpError(404, "grupo não encontrado!");

    const leadInGroup = await this.leadsRepository.findLeadInGroup(
      groupId,
      leadId
    );
    if (!leadInGroup)
      throw new HttpError(404, "Este lead não se encontra no grupo!");

    return await this.groupsRepository.removeLead(groupId, leadId);
  }
}
