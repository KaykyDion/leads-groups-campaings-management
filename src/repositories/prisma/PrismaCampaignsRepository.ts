import { Campaign } from "@prisma/client";
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
}
