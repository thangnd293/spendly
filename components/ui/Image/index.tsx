import React from 'react';
import { Image as RNImage } from 'react-native';
import { VariantProps } from 'tailwind-variants';

import { imageStyle } from './styles';

const DEFAULT_IMAGE = require('@/assets/images/placeholder.png');

type ImageProps = VariantProps<typeof imageStyle> & React.ComponentProps<typeof RNImage>;

const Image = React.forwardRef<
  React.ComponentRef<typeof RNImage>,
  ImageProps & { className?: string }
>(function Image({ size = 'md', className, alt, source: sourceProp, ...props }, ref) {
  let source = sourceProp ?? DEFAULT_IMAGE;

  if (typeof source === 'string') {
    source = { uri: source };
  }

  if (Array.isArray(source)) {
    source = source[0] ?? DEFAULT_IMAGE;
  }

  if (typeof alt !== 'string') {
    console.warn('Please pass alt prop to Image component');
  }

  return (
    <RNImage
      {...props}
      source={source}
      accessibilityLabel={props?.['aria-label'] || alt}
      className={imageStyle({ size, class: className })}
      ref={ref}
    />
  );
});

Image.displayName = 'Image';
export { Image };
