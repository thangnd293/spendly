import React from 'react';
import { Pressable, PressableProps } from 'react-native';
import { VariantProps } from 'tailwind-variants';

import { Text } from '@/components/ui/Text';

import { buttonStyle, buttonTextStyle } from './styles';

type ButtonProps = Omit<PressableProps, 'children'> &
  VariantProps<typeof buttonStyle> & {
    title: string;
    className?: string;
    icon?: React.ReactNode;
  };

function Button({ title, className, icon, variant, disabled = false, ...props }: ButtonProps) {
  return (
    <Pressable
      {...props}
      disabled={disabled}
      accessibilityRole={props.accessibilityRole ?? 'button'}
      className={buttonStyle({ variant, disabled, class: className })}
    >
      {icon}
      <Text className={buttonTextStyle({ variant })}>{title}</Text>
    </Pressable>
  );
}

export { Button };
