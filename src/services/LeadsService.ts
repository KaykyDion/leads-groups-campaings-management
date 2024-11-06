import { HttpError } from "../errors/HttpError";
import {
  CreateLeadAttributes,
  LeadCampaignStatus,
  LeadsRepository,
  LeadStatus,
  LeadWhereParams,
} from "../repositories/LeadsRepository";

interface GetLeadsWithPaginationParams {
  page?: number;
  pageSize?: number;
  name?: string;
  status?: LeadStatus;
  sortBy?: "name" | "status" | "createdAt";
  order?: "asc" | "desc";
  include?: {
    groups?: boolean;
    campaigns?: boolean;
  };
  groupId?: number;
  campaignId?: number;
  campaignStatus?: LeadCampaignStatus;
}

export class LeadsService {
  constructor(private readonly leadsRepository: LeadsRepository) {}

  async getAllLeadsPaginated(params: GetLeadsWithPaginationParams) {
    const {
      page = 1,
      pageSize = 10,
      name,
      status,
      sortBy,
      order,
      include,
      groupId,
      campaignId,
      campaignStatus,
    } = params;

    const limit = pageSize;
    const offset = (page - 1) * limit;

    const where: LeadWhereParams = {};

    if (name) where.name = { like: name, mode: "insensitive" };
    if (status) where.status = status;
    if (groupId) where.groupId = groupId;
    if (campaignId) where.campaignId = campaignId;
    if (campaignStatus) where.campaignStatus = campaignStatus;

    const leads = await this.leadsRepository.find({
      where,
      sortBy,
      order,
      limit,
      offset,
      include,
    });
    const total = await this.leadsRepository.count(where);

    return {
      leads,
      meta: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    };
  }

  async createLead(params: CreateLeadAttributes) {
    if (!params.status) params.status = "New";
    const newLead = await this.leadsRepository.create(params);
    return newLead;
  }

  async getLeadById(id: number) {
    const lead = await this.leadsRepository.findById(id);
    if (!lead) throw new HttpError(404, "Lead não encontrado!");
    return lead;
  }

  async updateLead(leadId: number, params: Partial<CreateLeadAttributes>) {
    const leadToUpdate = await this.leadsRepository.findById(+leadId);
    if (!leadToUpdate) throw new HttpError(404, "Lead não encontrado!");

    if (
      leadToUpdate.status === "New" &&
      params.status !== undefined &&
      params.status !== "Contacted"
    ) {
      throw new HttpError(
        400,
        "um novo lead deve ser contatado antes de ter seu status atualizado para outros valores"
      );
    }

    if (params.status && params.status === "Archived") {
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
    const updatedLead = await this.leadsRepository.updateById(+leadId, params);

    return updatedLead;
  }

  async deleteLead(leadId: number) {
    const leadToDelete = await this.leadsRepository.findById(+leadId);
    if (!leadToDelete) throw new HttpError(404, "Lead não encontrado!");

    const deletedLead = await this.leadsRepository.deleteById(+leadId);
    return deletedLead;
  }
}
