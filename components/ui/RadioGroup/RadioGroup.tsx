import React from 'react';
import { View } from 'react-native';

import { RadioGroupContext } from './Context';
import { RadioGroupIndicator } from './RadioGroupIndicator';
import { RadioGroupItem } from './RadioGroupItem';
import { RadioGroupItemText } from './RadioGroupItemText';
import { radioGroupStyle } from './styles';

type RadioGroupOption = {
  value: string;
  label: React.ReactNode;
  className?: string;
};

type RadioGroupProps<Items extends readonly RadioGroupOption[]> = Omit<
  React.ComponentPropsWithoutRef<typeof View>,
  'children'
> & {
  items: Items;
  itemClassName?: string;
  value?: Items[number]['value'];
  defaultValue?: Items[number]['value'];
  onValueChange?: (value: Items[number]['value']) => void;
  orientation?: 'horizontal' | 'vertical';
  disabled?: boolean;
};

const RadioGroupImplementation = React.forwardRef<
  React.ComponentRef<typeof View>,
  RadioGroupProps<readonly RadioGroupOption[]>
>(
  (
    {
      value,
      defaultValue,
      onValueChange,
      orientation = 'horizontal',
      disabled = false,
      className,
      items,
      itemClassName,
      ...props
    },
    ref,
  ) => {
    const [uncontrolledValue, setUncontrolledValue] = React.useState<string | null>(
      defaultValue ?? null,
    );
    const selectedValue = value !== undefined ? value : uncontrolledValue;
    const [triggerLayouts, setTriggerLayouts] = React.useState<
      Map<string, { x: number; y: number; width: number; height: number }>
    >(new Map());

    const setSelectedValue = React.useCallback(
      (nextValue: string) => {
        if (value === undefined) setUncontrolledValue(nextValue);
        if (nextValue !== selectedValue) onValueChange?.(nextValue);
      },
      [value, selectedValue, onValueChange],
    );

    const context = React.useMemo(
      () => ({
        selectedValue,
        setSelectedValue,
        orientation,
        disabled,
        triggerLayouts,
        registerTrigger: (
          triggerValue: string,
          layout: { x: number; y: number; width: number; height: number },
        ) => {
          setTriggerLayouts((previous) => {
            const next = new Map(previous);
            next.set(triggerValue, layout);
            return next;
          });
        },
      }),
      [selectedValue, setSelectedValue, orientation, disabled, triggerLayouts],
    );

    return (
      <RadioGroupContext.Provider value={context}>
        <View
          ref={ref}
          accessibilityRole="radiogroup"
          className={radioGroupStyle({ orientation, class: className })}
          {...props}
        >
          {items.map((item) => (
            <RadioGroupItem
              key={item.value}
              value={item.value}
              className={[itemClassName, item.className].filter(Boolean).join(' ')}
            >
              <RadioGroupItemText>{item.label}</RadioGroupItemText>
            </RadioGroupItem>
          ))}
          <RadioGroupIndicator />
        </View>
      </RadioGroupContext.Provider>
    );
  },
);

type RadioGroupComponent = <const Items extends readonly RadioGroupOption[]>(
  props: RadioGroupProps<Items> & React.RefAttributes<React.ComponentRef<typeof View>>,
) => React.ReactElement;

const RadioGroup = RadioGroupImplementation as RadioGroupComponent & { displayName?: string };
RadioGroup.displayName = 'RadioGroup';
export { RadioGroup };
