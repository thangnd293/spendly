import React from 'react';

import { Platform, Text as RNText } from 'react-native';
import type { TextStyle } from 'react-native';
import { textStyle } from './styles';
import { VariantProps } from 'tailwind-variants';

type ITextProps = React.ComponentProps<typeof RNText> & VariantProps<typeof textStyle>;
type FontWeight = 400 | 500 | 600 | 700;

const IOS_FONT_WEIGHTS: Record<FontWeight, TextStyle['fontWeight']> = {
  400: '400',
  500: '500',
  600: '600',
  700: '700',
};

function getFontWeight(className: string | undefined, bold?: boolean): FontWeight {
  if (bold || className?.includes('font-bold')) return 700;
  if (className?.includes('font-semibold')) return 600;
  if (className?.includes('font-medium')) return 500;
  return 400;
}

const Text = React.forwardRef<React.ComponentRef<typeof RNText>, ITextProps>(function Text(
  {
    className,
    bold,
    underline,
    strikeThrough,
    size = 'md',
    sub,
    italic,
    highlight,
    style,
    ...props
  },
  ref,
) {
  const fontWeight = getFontWeight(className, bold);
  const platformFontClass = Platform.select({
    ios: 'font-system',
    android: `font-roboto-${fontWeight}`,
    default: 'font-system',
  });
  const fontStyle: TextStyle =
    Platform.OS === 'ios'
      ? { fontWeight: IOS_FONT_WEIGHTS[fontWeight] }
      : Platform.OS === 'android'
        ? { fontWeight: 'normal' }
        : {};

  return (
    <RNText
      className={textStyle({
        bold: bold,
        underline: underline,
        strikeThrough: strikeThrough,
        size,
        sub: sub,
        italic: italic,
        highlight: highlight,
        class: `${className ?? ''} ${platformFontClass}`,
      })}
      {...props}
      style={[fontStyle, style]}
      ref={ref}
    />
  );
});

Text.displayName = 'Text';

export { Text };
