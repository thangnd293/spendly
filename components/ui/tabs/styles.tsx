import { tv } from "tailwind-variants";

export const tabsStyle = tv({
  base: "w-full gap-1",
});

export const tabsListStyle = tv({
  base: "flex relative bg-background p-0.5 rounded-full",
  variants: {
    orientation: {
      horizontal: "flex-row",
      vertical: "flex-col",
    },
  },
});

export const tabsTriggerStyle = tv({
  base: "justify-center relative z-10 items-center px-5 py-1.5 flex-row gap-1 data-[disabled=true]:opacity-40",
});

export const tabsIndicatorStyle = tv({
  base: "pointer-events-none bg-surface rounded-full",
});

export const tabsTriggerTextStyle = tv({
  base: "text-foreground/70 data-[selected=true]:text-black data-[hover=true]:text-foreground/90",
});

export const tabsContentStyle = tv({
  base: "p-2",
});

export const tabsContentWrapperStyle = tv({
  base: "overflow-hidden rounded-lg",
});
