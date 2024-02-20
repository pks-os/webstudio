export type Category = "sectionTemplates" | "apps";

export type MarketplaceStore = {
  id: string;
  category: Category;
  label: string;
  url: string;
  authToken: string;
  projectId: string;
  ui?:
    | {
        component: "panel";
      }
    | {
        component: "dialog";
        width?: number;
        height?: number;
      };
};
