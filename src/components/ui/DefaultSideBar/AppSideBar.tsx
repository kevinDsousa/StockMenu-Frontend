import { Drawer } from '@mantine/core';
import type { SideBarProps } from './__sidebar.config';

export const AppSideBar = ({ children, isOpen, onClose, side = 'right', width = '300px', title, backgroundColor }: SideBarProps) => {
  return (
    <Drawer
      opened={isOpen}
      onClose={onClose}
      position={side}
      size={width}
      withCloseButton
      title={title}
      styles={{
        inner: {
          backgroundColor: backgroundColor,
        },
      }}
    >
      {children}
    </Drawer>
  );
};