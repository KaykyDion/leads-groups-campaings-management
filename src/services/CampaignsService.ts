import { HttpError } from "../errors/HttpError";
import {
  CampaignsRepository,
  CreateCampaignAttributes,
} from "../repositories/CampaignsRepository";
import { LeadCampaignStatus } from "../repositories/LeadsRepository";

export class CampaignsService {
  constructor(private readonly campaignsRepository: CampaignsRepository) {}

  async getAllCampaigns() {
    return await this.campaignsRepository.find();
  }

  async createCampaign(params: CreateCampaignAttributes) {
    return await this.campaignsRepository.create(params);
  }

  async getCampaignById(id: number) {
    const campaign = await this.campaignsRepository.findById(id);
    if (!campaign) throw new HttpError(404, "campanha não encontrada!");
    return campaign;
  }

  async updateCampaign(id: number, params: Partial<CreateCampaignAttributes>) {
    const campaignToUpdate = await this.campaignsRepository.findById(id);
    if (!campaignToUpdate) throw new HttpError(404, "campanha não encontrada!");
    return await this.campaignsRepository.updateById(id, params);
  }

  async deleteCampaign(id: number) {
    const campaignToDelete = await this.campaignsRepository.findById(id);
    if (!campaignToDelete) throw new HttpError(404, "campanha não encontrada!");
    return await this.campaignsRepository.deleteById(id);
  }

  async addLeadToCampaign(
    campaignId: number,
    leadId: number,
    status?: LeadCampaignStatus
  ) {
    return await this.campaignsRepository.addLead(campaignId, leadId, status);
  }

  async updateLeadStatus(
    campaignId: number,
    leadId: number,
    status: LeadCampaignStatus
  ) {
    return await this.campaignsRepository.updateLeadStatus(
      status,
      +campaignId,
      +leadId
    );
  }

  async removeLeadFromCampaign(campaignId: number, leadId: number) {
    return await this.campaignsRepository.removeLead(campaignId, leadId);
  }
}
