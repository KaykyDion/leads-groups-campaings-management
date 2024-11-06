import { Campaign, LeadCampaign, LeadCampaignStatus } from "@prisma/client";
import {
  CampaignsRepository,
  CreateCampaignAttributes,
} from "../CampaignsRepository";
import { prisma } from "../../database";

export class PrismaCampaignRepository implements CampaignsRepository {
  async find(): Promise<Campaign[]> {
    return prisma.campaign.findMany();
  }

  async findById(id: number): Promise<Campaign | null> {
    return prisma.campaign.findUnique({
      where: { id },
      include: { leads: { include: { lead: true } } },
    });
  }

  async create(attributes: CreateCampaignAttributes): Promise<Campaign> {
    return prisma.campaign.create({ data: attributes });
  }

  async updateById(
    id: number,
    attributes: Partial<CreateCampaignAttributes>
  ): Promise<Campaign | null> {
    return prisma.campaign.update({ where: { id }, data: attributes });
  }

  async deleteById(id: number): Promise<Campaign | null> {
    return prisma.campaign.delete({ where: { id } });
  }

  async addLead(
    campaignId: number,
    leadId: number,
    status?: LeadCampaignStatus
  ): Promise<LeadCampaign> {
    return prisma.leadCampaign.create({
      data: { campaignId, leadId, status },
    });
  }

  updateLeadStatus(
    status: LeadCampaignStatus,
    campaignId: number,
    leadId: number
  ): Promise<LeadCampaign> {
    return prisma.leadCampaign.update({
      data: { status },
      where: { leadId_campaignId: { leadId, campaignId } },
    });
  }

  removeLead(campaignId: number, leadId: number): Promise<LeadCampaign> {
    return prisma.leadCampaign.delete({
      where: { leadId_campaignId: { campaignId, leadId } },
      include: { lead: true },
    });
  }
}
