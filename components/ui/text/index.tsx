import React from "react";

import { Text as RNText } from "react-native";
import { textStyle } from "./styles";
import { VariantProps } from "tailwind-variants";

type ITextProps = React.ComponentProps<typeof RNText> &
  VariantProps<typeof textStyle>;

const Text = React.forwardRef<React.ComponentRef<typeof RNText>, ITextProps>(
  function Text(
    {
      className,
      bold,
      underline,
      strikeThrough,
      size = "md",
      sub,
      italic,
      highlight,
      ...props
    },
    ref,
  ) {
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
          class: className,
        })}
        {...props}
        ref={ref}
      />
    );
  },
);

Text.displayName = "Text";

export { Text };
