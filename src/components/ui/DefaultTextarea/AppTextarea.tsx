import { Textarea as MantineTextarea, type TextareaProps } from '@mantine/core';
import {
  buildTextareaStyles,
  type AppTextareaProps,
} from './__textarea.config';

type Props = AppTextareaProps & TextareaProps;

export const AppTextarea = ({
  status = 'default',
  styleConfig,
  ...props
}: Props) => {
  return (
    <MantineTextarea
      radius="md"
      styles={buildTextareaStyles(status, styleConfig)}
      {...props}
    />
  );
};
