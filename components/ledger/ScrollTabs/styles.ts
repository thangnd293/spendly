import { tv } from 'tailwind-variants';

export const scrollTabsStyle = tv({
  base: 'overflow-hidden rounded-full bg-background px-1',
});

export const scrollTabContentStyle = tv({
  base: 'flex-row p-1',
});

export const scrollTabItemStyle = tv({
  base: 'items-center justify-center rounded-full px-4 py-4',
});

export const scrollTabTextStyle = tv({
  base: 'text-sm',
});

export const scrollTabIndicatorStyle = tv({
  base: 'pointer-events-none absolute bottom-1 left-0 top-1 rounded-full bg-primary',
});
