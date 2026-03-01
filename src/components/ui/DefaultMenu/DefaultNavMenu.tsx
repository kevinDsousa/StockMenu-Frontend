import { NavLink } from '@mantine/core';
import { useState } from 'react';
import { buildNavMenuStyles, type NavMenuItemProps, type NavMenuProps } from './__nav-menu.config';


const NavMenuItemComponent = ({
  item,
  activeLabel,
  depth = 0,
  styles,
}: NavMenuItemProps) => {
  const [opened, setOpened] = useState(false);
  const isActive = item.label === activeLabel;
  const hasChildren = !!item.children?.length;

  const handleClick = () => {
    if (hasChildren) setOpened((prev) => !prev);
    item.onClick?.();
  };

  return (
    <NavLink
      label={item.label}
      leftSection={item.icon}
      active={isActive}
      opened={hasChildren ? opened : undefined}
      onClick={handleClick}
      pl={12 + depth * 16}
      styles={{
        root: {
          ...styles.itemStyle,
          ...(isActive ? styles.activeItemStyle : {}),
          paddingLeft: 12 + depth * 16,
        },
      }}
    >
      {hasChildren &&
        item.children!.map((child) => (
          <NavMenuItemComponent
            key={child.label}
            item={child}
            activeLabel={activeLabel}
            depth={depth + 1}
            styles={styles}
          />
        ))}
    </NavLink>
  );
};

export const AppNavMenu = ({ items, activeLabel, styleConfig }: NavMenuProps) => {
  const styles = buildNavMenuStyles(styleConfig);

  return (
    <nav style={styles.wrapperStyle}>
      {items.map((item) => (
        <NavMenuItemComponent
          key={item.label}
          item={item}
          activeLabel={activeLabel}
          styles={styles}
        />
      ))}
    </nav>
  );
};