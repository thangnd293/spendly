import { tv } from 'tailwind-variants';

export const imageStyle = tv({
  base: 'max-w-full',
  variants: {
    size: {
      '3xs': 'size-5',
      '2xs': 'size-6',
      xs: 'size-8',
      sm: 'size-10',
      md: 'size-12',
      lg: 'size-18',
      xl: 'size-24',
      '2xl': 'size-32',
      full: 'size-full',
      none: '',
    },
  },
});
