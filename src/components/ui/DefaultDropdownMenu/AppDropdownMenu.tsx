import { Menu } from '@mantine/core';
import { buildDropdownStyles, isDivider, type DropdownMenuProps } from './__dropdown-menu.config';

export const AppDropdownMenu = ({ trigger, items, styleConfig, position = 'bottom-start' }: DropdownMenuProps) => {
  const styles = buildDropdownStyles(styleConfig);

  return (
    <Menu position={position} withinPortal>
      <Menu.Target>
        <span style={{ display: 'inline-flex', cursor: 'pointer' }}>
          {trigger}
        </span>
      </Menu.Target>

      <Menu.Dropdown style={styles.dropdown}>
        {items.map((entry, index) => {
          if (isDivider(entry)) {
            return <Menu.Divider key={`divider-${index}`} />;
          }

          return (
            <Menu.Item
              key={`${entry.label}-${index}`}
              leftSection={entry.icon}
              disabled={entry.disabled}
              onClick={entry.onClick}
              style={{
                ...styles.item,
                ...(entry.variant === 'danger' ? styles.dangerItem : {}),
              }}
            >
              {entry.label}
            </Menu.Item>
          );
        })}
      </Menu.Dropdown>
    </Menu>
  );
};