import { Drawer } from '@mantine/core';
import { buildDrawerStyles, type SideBarProps } from './__sidebar.config';

export const AppSideBar = ({ children, isOpen, onClose, position = 'left', width = 300, title, backgroundColor, withoutOverlay = false,
 zIndex = 200 }: SideBarProps) => {
  return (
    <Drawer
      opened={isOpen}
      onClose={onClose}
      position={position}
      size={width}
      withCloseButton
      title={title}
      withOverlay={!withoutOverlay}
      zIndex={zIndex}
      styles={buildDrawerStyles(position, backgroundColor)}
    >
      {children}
    </Drawer>
  );
};