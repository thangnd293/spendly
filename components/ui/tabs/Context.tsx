import React from "react";

type TabsContextValue = {
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
  contentLayouts: Map<
    string,
    { x: number; y: number; width: number; height: number }
  >;
  registerContent: (
    value: string,
    layout: { x: number; y: number; width: number; height: number },
  ) => void;
};

type TriggerContextValue = {
  selected: boolean;
  disabled: boolean;
  hovered: boolean;
};

export const TabsContext = React.createContext<TabsContextValue | null>(null);
export const TriggerContext = React.createContext<TriggerContextValue | null>(
  null,
);

export function useTabsContext(componentName: string) {
  const context = React.useContext(TabsContext);
  if (!context) {
    throw new Error(`${componentName} must be used inside Tabs`);
  }
  return context;
}

export function useTriggerContext(componentName: string) {
  const context = React.useContext(TriggerContext);
  if (!context) {
    throw new Error(`${componentName} must be used inside TabsTrigger`);
  }
  return context;
}
