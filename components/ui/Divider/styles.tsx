import { tv } from 'tailwind-variants';

export const dividerStyle = tv({
  base: 'bg-border',
  variants: {
    orientation: {
      vertical: 'w-px h-full',
      horizontal: 'h-px w-auto',
    },
  },
});
