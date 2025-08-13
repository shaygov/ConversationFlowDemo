import React, { useCallback, useState } from "react";
import SidebarRow from "@components/WorkSpaceLayout/PrimaryColumn/Components/Row";
import Icon from "@libs/components/widgets/Icon/Icon";
import { ISidebarItemProps } from "@/types/sidebar";
import { useWorkspaceLayout } from "@/contexts/WorkspaceLayoutProvider";
import {useActiveSecondaryComponent} from "@/contexts/WorkspaceLayoutProvider";

interface ISectionProps {
  items: ISidebarItemProps[],
  collapsedItems?: number,
}


const NavItemSidebarRow = (props: any) => {
  const { activeMainNavLink } = useActiveSecondaryComponent();

  return  <SidebarRow 
    active = {activeMainNavLink === `${props.item.component}_${props.item.id}`}
    {...props}
  />
}


const NavItem: React.FC<{item: ISidebarItemProps }> = ({ item }) => {
  return (<NavItemSidebarRow item={item} />)
};

/**
 * General SideBar section
 */
const Section: React.FC<ISectionProps> = ({
  items = [],
  collapsedItems,
}) => {


  const [collapsed, setCollapsed] = useState(true);

  const Items = useCallback(() => {
    const COLLAPSED_ITEMS = collapsedItems && collapsed ? collapsedItems : Array.isArray(items) ? items.length : 0;


    return (
      <>
        {
          !Array.isArray(items) ? null : items.slice(0, COLLAPSED_ITEMS).map((item) => (
            <NavItem 
              key={item.id} 
              item={item}
            />
          ))
        }

        { 
          collapsed && Array.isArray(items) && collapsedItems && items.length > COLLAPSED_ITEMS ? (
            <SidebarRow
              item={{
                label: "More",
                icon: () => <Icon name="arrow-down-small" size="M" />,
                onClick: () => setCollapsed(!collapsed),
              }}
            />
          ) : null
        }
      </>
    );
  }, [items, collapsed, collapsedItems]);

  return !items ? null : <Items />;
};

export default Section;
