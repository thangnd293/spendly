import { tv } from 'tailwind-variants';

export const buttonStyle = tv({
  base: 'flex-row items-center justify-center gap-2 rounded-full py-3',
  variants: {
    variant: {
      primary: 'bg-primary active:opacity-80',
      secondary: 'bg-surface active:bg-black/10',
    },
    disabled: {
      true: 'bg-black/10',
      false: '',
    },
  },
  defaultVariants: {
    variant: 'primary',
    disabled: false,
  },
});

export const buttonTextStyle = tv({
  base: 'text-lg',
  variants: {
    variant: {
      primary: 'text-white',
      secondary: 'text-primary',
    },
  },
  defaultVariants: {
    variant: 'primary',
  },
});
