import React, { FC, useState, useEffect } from "react";
import Theme from "@vars/Theme";
import SidebarSection from "@components/WorkSpaceLayout/PrimaryColumn/Sections";
import { ISidebarItemProps } from "@/types/sidebar";
import { SidebarRowIconStyled } from "@components/WorkSpaceLayout/PrimaryColumn/Components/Row/style";
import { FontAwesome } from "@libs/components/typography/FontAwesome/FontAwesome";
import { IconName } from "@fortawesome/fontawesome-svg-core";
import { workspaceLayoutService } from '@/services/layout/WorkspaceLayoutService';
import { useAllMessagesWorkspaceCount } from "@/hooks/useAllMessagesWorkspaceCount";

const BaseColor = Theme["semantic-colors"].base;

const clickHandler = (item: ISidebarItemProps) => {
  workspaceLayoutService.openWorkspaceColumn('secondary', {
    id: item.id.toString(),
    component: {
      type: item.component,
      props: {
        id: item.id.toString(),
      }
    }
  });
}

// OOP class for sidebar item
class SidebarMenuItem {
  public id: string;
  public label: string;
  public logo_color: string;
  public logo_icon: IconName;
  public component: string;
  public badgeProvider: () => number;
  public onClick: () => void;
  constructor({
    id,
    label,
    logo_color,
    logo_icon,
    component,
    badgeProvider,
    onClick
  }: {
    id: string;
    label: string;
    logo_color: string;
    logo_icon: IconName;
    component: string;
    badgeProvider: () => number;
    onClick: () => void;
  }) {
    this.id = id;
    this.label = label;
    this.logo_color = logo_color;
    this.logo_icon = logo_icon;
    this.component = component;
    this.badgeProvider = badgeProvider;
    this.onClick = onClick;
  }
}

// Example values for badge (can be state/store)
// These are static here, but can be dynamic
const membersCount = 0;
const unreadCount = 0;
const mentionsCount = 0;
const myTasksCount = 0;
const savedCount = 0;

const sidebarMenuItems = [
  new SidebarMenuItem({
    id: 'sidebar-messages-item-all',
    label: 'All messages',
    logo_color: BaseColor["b-dark-blue"],
    logo_icon: 'at',
    component: 'messages',
    badgeProvider: useAllMessagesWorkspaceCount,
    onClick: () => clickHandler({
      id: 'sidebar-messages-item-all',
      label: 'All messages',
      component: 'messages',
    }),
  }),
  new SidebarMenuItem({
    id: 'sidebar-messages-item-members',
    label: 'Members',
    logo_color: BaseColor["b-dark-blue"],
    logo_icon: 'at',
    component: 'members',
    badgeProvider: () => membersCount,
    onClick: () => clickHandler({
      id: 'sidebar-messages-item-members',
      label: 'Members',
      component: 'members',
    }),
  }),
  new SidebarMenuItem({
    id: 'sidebar-messages-item-unread',
    label: 'Unread',
    logo_color: BaseColor["b-dark-blue"],
    logo_icon: 'at',
    component: 'messages_unread',
    badgeProvider: () => unreadCount,
    onClick: () => clickHandler({
      id: 'sidebar-messages-item-unread',
      label: 'Unread',
      component: 'messages_unread',
    }),
  }),
  new SidebarMenuItem({
    id: 'sidebar-messages-item-mentions',
    label: 'Mentions',
    logo_color: BaseColor["b-dark-blue"],
    logo_icon: 'at',
    component: 'messages_mentions',
    badgeProvider: () => mentionsCount,
    onClick: () => clickHandler({
      id: 'sidebar-messages-item-mentions',
      label: 'Mentions',
      component: 'messages_mentions',
    }),
  }),
  new SidebarMenuItem({
    id: 'sidebar-messages-item-my-tasks',
    label: 'My Tasks',
    logo_color: BaseColor["b-dark-blue"],
    logo_icon: 'check',
    component: 'messages_tasks',
    badgeProvider: () => myTasksCount,
    onClick: () => clickHandler({
      id: 'sidebar-messages-item-my-tasks',
      label: 'My Tasks',
      component: 'messages_tasks',
    }),
  }),
  new SidebarMenuItem({
    id: 'sidebar-messages-item-saved',
    label: 'Saved',
    logo_color: BaseColor["b-dark-blue"],
    logo_icon: 'bookmark',
    component: 'messages_saved',
    badgeProvider: () => savedCount,
    onClick: () => clickHandler({
      id: 'sidebar-messages-item-saved',
      label: 'Saved',
      component: 'messages_saved',
    }),
  }),
];

export const CURRENT_SECTION_NAME = 'messages';

const Messages: FC = () => {
  /**
   * Prepare the items for the sidebar section
   */
  const items: ISidebarItemProps[] = sidebarMenuItems.map(item => ({
    id: item.id,
    label: item.label,
    bgColor: item.logo_color,
    component: item.component,
    badgeProvider: item.badgeProvider,
    logo_icon: item.logo_icon,
    icon: () => (
      <SidebarRowIconStyled
        viewOptions="solution"
        iconBgColor={item.logo_color}
      >
        <FontAwesome 
          type="fas"
          icon={item.logo_icon as IconName}
          color="#fff"
        />
      </SidebarRowIconStyled>
    ),
    onClick: item.onClick,
  }));


  return (
    <SidebarSection 
      items={items}
    />
  );
};

export default Messages;
