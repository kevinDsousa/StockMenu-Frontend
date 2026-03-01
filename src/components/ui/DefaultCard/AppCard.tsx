import { Card as MantineCard, type CardProps } from '@mantine/core';
import { buildCardStyles, type AppCardProps } from './__card.config';

type Props = AppCardProps & Omit<CardProps, 'styles'>;

export const AppCard = ({ status = 'default', styleConfig, children, ...props }: Props) => {
  return (
    <MantineCard
      withBorder
      shadow="sm"
      radius="md"
      styles={buildCardStyles(status, styleConfig)}
      {...props}
    >
      {children}
    </MantineCard>
  );
};