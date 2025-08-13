import { IconDimensions } from '@libs/components/widgets/Icon/Icon.constants';
import { IconSizes } from "@libs/components/widgets/Icon/Icon.constants";
import { SidebarOptions } from "@/types/sidebar/Row.d";
import { ReactNode } from "react";

export interface SidebarOptionType {
  label: string;
  badge?: number;
  newMention?: number;
  iconName?: string;
  iconSize?: IconSizes;
  iconBgColor?: string;
  viewOptions?: SidebarOptions;
  iconDimensions?: IconDimensions;
  hr?: boolean;
}

export interface SolutionTemplateType {
  name: string;
  slug: string;
  logo_color: string;
  logo_icon: string;
  description?: {
    data?: Record<string, unknown>;
    html?: string;
    preview?: string;
  },
  permissions?: object;
  hidden?: boolean;
  created: string;
  created_by?: string | null;
  updated: string;
  updated_by: string | null;
  has_demo_data?: boolean;
  status?: string;
  automation_count?: number;
  records_count?: number;
  members_count?: number;
  sharing_hash?: string;
  sharing_password?: string | null;
  sharing_enabled?: boolean;
  sharing_allow_copy?: boolean;
  applications_count: number;
  application_ids: string[];
  id: string;
  last_access: string | null;
  delete_date: string | null;
  deleted_by: string | null;
  template: string | null;
}

export interface ISidebarItemProps {
  id?: number | string;
  label: string;
  badge?: string | number | ReactNode;
  icon?: any;
  bgColor?: string;
  active?: boolean;
  isTyping?: boolean;
  hasNewMessages?: boolean;
  onClick?: () => void;
  onRemove?: () => void;
  subSidebar?: string,
  component?: string,
  badgeProvider?: () => number;
}