export type ResourceStatus = "claimed" | "available" | "reserved";

export interface ResourceItem {
  id: string;
  name: string;
  description?: string;
  owner?: string;
  status: ResourceStatus;
  updatedAt: string;
}

export const defaultItems: ResourceItem[] = [
  {
    id: "workspace-01",
    name: "露营炉具套装",
    description: "含炉具、燃料、折叠锅具",
    owner: "阿强",
    status: "claimed",
    updatedAt: new Date("2024-06-01T09:00:00Z").toISOString()
  },
  {
    id: "workspace-02",
    name: "折叠桌椅（2 套）",
    description: "适用于外展活动",
    status: "available",
    updatedAt: new Date("2024-06-02T12:30:00Z").toISOString()
  },
  {
    id: "workspace-03",
    name: "帐篷（4 人）",
    description: "雨棚+防潮垫齐全",
    status: "reserved",
    owner: "小林",
    updatedAt: new Date("2024-06-03T07:15:00Z").toISOString()
  },
  {
    id: "workspace-04",
    name: "投影仪",
    description: "带 HDMI 与 Type-C 转接头",
    status: "available",
    updatedAt: new Date("2024-06-04T14:40:00Z").toISOString()
  },
  {
    id: "workspace-05",
    name: "活动音响",
    description: "含无线麦克风两支",
    status: "claimed",
    owner: "阿美",
    updatedAt: new Date("2024-06-05T10:05:00Z").toISOString()
  }
];
