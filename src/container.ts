import { CampaignLeadsController } from "./controllers/CampaignLeadsController";
import { CampaignsController } from "./controllers/CampaingnsController";
import { GroupLeadsController } from "./controllers/GroupLeadsController";
import { GroupsController } from "./controllers/GroupsController";
import { LeadsController } from "./controllers/LeadsController";
import { PrismaCampaignRepository } from "./repositories/prisma/PrismaCampaignsRepository";
import { PrismaGroupsRepository } from "./repositories/prisma/PrismaGroupsRepository";
import { PrismaLeadsRepository } from "./repositories/prisma/PrismaLeadsRepository";

export const leadsRepository = new PrismaLeadsRepository();
export const groupsRepository = new PrismaGroupsRepository();
export const campaignsRepository = new PrismaCampaignRepository();

export const leadsController = new LeadsController(leadsRepository);
export const groupsController = new GroupsController(groupsRepository);

export const campaignsController = new CampaignsController(campaignsRepository);
export const campaignLeadsController = new CampaignLeadsController(
  leadsRepository,
  campaignsRepository
);
export const groupLeadsController = new GroupLeadsController(
  groupsRepository,
  leadsRepository
);
