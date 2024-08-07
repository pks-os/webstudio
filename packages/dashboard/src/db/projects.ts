import { prisma } from "@webstudio-is/prisma-client";
import type { AppContext } from "@webstudio-is/trpc-interface/index.server";
import { DashboardProjects } from "./schema";

export const findMany = async (userId: string, _context: AppContext) => {
  const data = await prisma.dashboardProject.findMany({
    where: {
      userId,
      isDeleted: false,
    },
    include: {
      previewImageAsset: true,
    },
    orderBy: [
      {
        createdAt: "desc",
      },
      {
        id: "desc",
      },
    ],
  });

  return DashboardProjects.parse(data);
};

export const findManyByIds = async (
  projectIds: string[],
  _context: AppContext
) => {
  if (projectIds.length === 0) {
    return DashboardProjects.parse([]);
  }

  const data = await prisma.dashboardProject.findMany({
    where: {
      id: {
        in: projectIds,
      },
      isDeleted: false,
    },
    include: {
      previewImageAsset: true,
    },
    orderBy: [
      {
        createdAt: "desc",
      },
      {
        id: "desc",
      },
    ],
  });

  return DashboardProjects.parse(data);
};
