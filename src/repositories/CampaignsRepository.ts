import { Campaign } from "@prisma/client";

export interface CreateCampaignAttributes {
  name: string;
  description: string;
  startDate: Date;
  endDate?: Date;
}

export interface CampaignsRepository {
  find: () => Promise<Campaign[]>;
  findById: (id: number) => Promise<Campaign | null>;
  create: (attributes: CreateCampaignAttributes) => Promise<Campaign>;
  updateById: (
    id: number,
    attributes: Partial<CreateCampaignAttributes>
  ) => Promise<Campaign | null>;
  deleteById: (id: number) => Promise<Campaign | null>;
}
