import { tv } from 'tailwind-variants';

export const imageStyle = tv({
  base: 'max-w-full',
  variants: {
    size: {
      '2xs': 'h-6 w-6',
      xs: 'h-8 w-8',
      sm: 'h-10 w-10',
      md: 'h-14 w-14',
      lg: 'h-18 w-18',
      xl: 'h-24 w-24',
      '2xl': 'h-32 w-32',
      full: 'h-full w-full',
      none: '',
    },
  },
});
