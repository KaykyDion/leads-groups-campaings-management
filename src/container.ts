import { CampaignLeadsController } from "./controllers/CampaignLeadsController";
import { CampaignsController } from "./controllers/CampaingnsController";
import { GroupLeadsController } from "./controllers/GroupLeadsController";
import { GroupsController } from "./controllers/GroupsController";
import { LeadsController } from "./controllers/LeadsController";

import { PrismaCampaignRepository } from "./repositories/prisma/PrismaCampaignsRepository";
import { PrismaGroupsRepository } from "./repositories/prisma/PrismaGroupsRepository";
import { PrismaLeadsRepository } from "./repositories/prisma/PrismaLeadsRepository";
import { CampaignsService } from "./services/CampaignsService";
import { GroupsService } from "./services/GroupsService";
import { LeadsService } from "./services/LeadsService";

export const leadsRepository = new PrismaLeadsRepository();
export const groupsRepository = new PrismaGroupsRepository();
export const campaignsRepository = new PrismaCampaignRepository();

export const leadsService = new LeadsService(leadsRepository);
export const groupsService = new GroupsService(
  groupsRepository,
  leadsRepository
);
export const campaignsService = new CampaignsService(campaignsRepository);

export const leadsController = new LeadsController(leadsService);

export const groupsController = new GroupsController(groupsService);
export const groupLeadsController = new GroupLeadsController(
  groupsService,
  leadsService
);

export const campaignsController = new CampaignsController(campaignsService);
export const campaignLeadsController = new CampaignLeadsController(
  leadsService,
  campaignsService
);
