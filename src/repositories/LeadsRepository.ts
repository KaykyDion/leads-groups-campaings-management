import { Lead } from "@prisma/client";

export type LeadStatus =
  | "New"
  | "Contacted"
  | "Qualified"
  | "Converted"
  | "Unresponsive"
  | "Disqualified"
  | "Archived";

export type LeadCampaignStatus =
  | "New"
  | "Engaged"
  | "FollowUp_Scheled"
  | "Contacted"
  | "Qualified"
  | "Converted"
  | "Unresponsive"
  | "Disqualified"
  | "Re_Engaged"
  | "Opted_Out";

export interface LeadWhereParams {
  name?: {
    like?: string;
    equals?: string;
    mode?: "default" | "insensitive";
  };
  status?: LeadStatus;
  groupId?: number;
  campaignId?: number;
  campaignStatus?: LeadCampaignStatus;
}

export interface FindLeadsParams {
  where?: LeadWhereParams;
  sortBy?: "name" | "status" | "createdAt";
  order?: "asc" | "desc";
  limit?: number;
  offset?: number;
  include?: {
    groups?: boolean;
    campaigns?: boolean;
  };
}

export interface CreateLeadAttributes {
  name: string;
  email: string;
  phone: string;
  status?: LeadStatus;
}

export interface LeadsRepository {
  find: (params: FindLeadsParams) => Promise<Lead[]>;
  findById: (id: number) => Promise<Lead | null>;
  count: (where: LeadWhereParams) => Promise<number>;
  create: (attributes: CreateLeadAttributes) => Promise<Lead>;
  updateById: (
    id: number,
    attributes: Partial<CreateLeadAttributes>
  ) => Promise<Lead | null>;
  deleteById: (id: number) => Promise<Lead | null>;
  findLeadInGroup: (groupId: number, leadId: number) => Promise<Lead | null>;
}
