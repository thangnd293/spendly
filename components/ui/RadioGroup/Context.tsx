import React from "react";

type RadioGroupContextValue = {
  selectedValue: string | null;
  setSelectedValue: (value: string) => void;
  orientation: "horizontal" | "vertical";
  disabled: boolean;
  triggerLayouts: Map<
    string,
    { x: number; y: number; width: number; height: number }
  >;
  registerTrigger: (
    value: string,
    layout: { x: number; y: number; width: number; height: number },
  ) => void;
};

type RadioGroupItemContextValue = {
  selected: boolean;
  disabled: boolean;
  hovered: boolean;
};

export const RadioGroupContext =
  React.createContext<RadioGroupContextValue | null>(null);
export const RadioGroupItemContext =
  React.createContext<RadioGroupItemContextValue | null>(null);

export function useRadioGroupContext(componentName: string) {
  const context = React.useContext(RadioGroupContext);
  if (!context) {
    throw new Error(`${componentName} must be used inside RadioGroup`);
  }
  return context;
}

export function useRadioGroupItemContext(componentName: string) {
  const context = React.useContext(RadioGroupItemContext);
  if (!context) {
    throw new Error(`${componentName} must be used inside RadioGroupItem`);
  }
  return context;
}
