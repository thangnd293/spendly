import React, {
  PropsWithChildren,
  ReactElement,
  ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  Dimensions,
  LayoutChangeEvent,
  Modal,
  Pressable,
  PressableInstance,
  Platform,
  View,
  ViewStyle,
} from 'react-native';

import Theme from '@/components/Theme';
import { Text } from '@/components/ui/Text';

export type TooltipPlacement =
  | 'top'
  | 'bottom'
  | 'left'
  | 'right'
  | 'top-start'
  | 'top-end'
  | 'bottom-start'
  | 'bottom-end'
  | 'left-start'
  | 'left-end'
  | 'right-start'
  | 'right-end';

export type TooltipProps = PropsWithChildren<{
  text?: ReactNode;
  content?: ReactNode;
  placement?: TooltipPlacement;
  isOpen?: boolean;
  defaultIsOpen?: boolean;
  isDisabled?: boolean;
  openDelay?: number;
  closeDelay?: number;
  closeOnPress?: boolean;
  offset?: number;
  shouldFlip?: boolean;
  hasArrow?: boolean;
  className?: string;
  contentClassName?: string;
  textClassName?: string;
  onOpen?: () => void;
  onClose?: () => void;
  triggerAccessibilityLabel?: string;
  triggerTestID?: string;
}>;

type TriggerRect = {
  x: number;
  y: number;
  width: number;
  height: number;
};

type TooltipSize = {
  width: number;
  height: number;
};

function Tooltip({
  text,
  content,
  placement = 'bottom',
  isOpen,
  defaultIsOpen = false,
  isDisabled = false,
  openDelay = 350,
  closeDelay = 0,
  closeOnPress = true,
  offset = 8,
  shouldFlip = true,
  hasArrow = false,
  className,
  contentClassName,
  textClassName,
  onOpen,
  onClose,
  triggerAccessibilityLabel,
  triggerTestID,
  children,
}: TooltipProps) {
  const triggerRef = useRef<PressableInstance>(null);
  const openTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const suppressHoverTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const didLongPressRef = useRef(false);
  const suppressHoverOpenRef = useRef(false);
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultIsOpen);
  const [triggerRect, setTriggerRect] = useState<TriggerRect | null>(null);
  const [tooltipSize, setTooltipSize] = useState<TooltipSize | null>(null);
  const controlled = isOpen !== undefined;
  const actualOpen = controlled ? Boolean(isOpen) : uncontrolledOpen;

  const clearTimers = useCallback(() => {
    if (openTimerRef.current) clearTimeout(openTimerRef.current);
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    if (suppressHoverTimerRef.current) clearTimeout(suppressHoverTimerRef.current);
    openTimerRef.current = null;
    closeTimerRef.current = null;
    suppressHoverTimerRef.current = null;
  }, []);

  const setOpen = useCallback(
    (open: boolean) => {
      if (!controlled) setUncontrolledOpen(open);
      if (open) onOpen?.();
      else onClose?.();
    },
    [controlled, onClose, onOpen],
  );

  const open = useCallback(() => {
    if (!isDisabled && !actualOpen) setOpen(true);
  }, [actualOpen, isDisabled, setOpen]);

  const close = useCallback(() => {
    if (openTimerRef.current) clearTimeout(openTimerRef.current);
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    openTimerRef.current = null;
    closeTimerRef.current = null;
    suppressHoverOpenRef.current = true;
    if (suppressHoverTimerRef.current) clearTimeout(suppressHoverTimerRef.current);
    suppressHoverTimerRef.current = setTimeout(() => {
      suppressHoverOpenRef.current = false;
      suppressHoverTimerRef.current = null;
    }, 500);
    if (actualOpen) setOpen(false);
    setTooltipSize(null);
  }, [actualOpen, setOpen]);

  const openWithDelay = useCallback(() => {
    if (Platform.OS !== 'web' || isDisabled || suppressHoverOpenRef.current) return;
    if (openTimerRef.current) clearTimeout(openTimerRef.current);
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    openTimerRef.current = setTimeout(open, openDelay);
  }, [closeTimerRef, isDisabled, open, openDelay]);

  const closeWithDelay = useCallback(() => {
    if (Platform.OS !== 'web') return;
    if (openTimerRef.current) clearTimeout(openTimerRef.current);
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    closeTimerRef.current = setTimeout(close, closeDelay);
  }, [close, closeDelay]);

  const onPressTrigger = useCallback(() => {
    if (didLongPressRef.current) {
      didLongPressRef.current = false;
      return;
    }
    if (actualOpen) {
      close();
    } else {
      suppressHoverOpenRef.current = false;
      open();
    }
  }, [actualOpen, close, open]);

  useEffect(() => clearTimers, [clearTimers]);

  const measureTrigger = useCallback(() => {
    triggerRef.current?.measureInWindow((x, y, width, height) => {
      if (width > 0 && height > 0) {
        console.log({ x, y, width, height });
        setTriggerRect({ x, y, width, height });
      }
    });
  }, []);

  useEffect(() => {
    if (actualOpen) measureTrigger();
  }, [actualOpen, measureTrigger]);

  function onTooltipLayout(event: LayoutChangeEvent) {
    const { width, height } = event.nativeEvent.layout;
    setTooltipSize((current) =>
      current?.width === width && current.height === height ? current : { width, height },
    );
  }

  const { position, arrowStyle } = getTooltipPosition({
    triggerRect,
    tooltipSize,
    placement,
    offset,
    shouldFlip,
    hasArrow,
  });

  const trigger = React.isValidElement(children) ? (
    (children as ReactElement)
  ) : (
    <View>{children}</View>
  );

  return (
    <>
      <Pressable
        ref={triggerRef}
        collapsable={false}
        className={className}
        accessibilityLabel={triggerAccessibilityLabel}
        testID={triggerTestID}
        onLongPress={() => {
          didLongPressRef.current = true;
          open();
          setTimeout(() => {
            didLongPressRef.current = false;
          }, 800);
        }}
        delayLongPress={openDelay}
        onHoverIn={openWithDelay}
        onHoverOut={closeWithDelay}
        onPress={closeOnPress ? onPressTrigger : open}
      >
        {trigger}
      </Pressable>

      <Modal
        visible={actualOpen}
        transparent
        animationType="none"
        statusBarTranslucent
        onRequestClose={close}
        navigationBarTranslucent
      >
        <Theme>
          <View className="flex-1">
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Đóng tooltip"
              className="absolute inset-0"
              onPress={close}
            />
            <View
              className="absolute z-10 max-w-72"
              style={[position, { opacity: tooltipSize ? 1 : 0 }]}
              onLayout={onTooltipLayout}
            >
              <View
                className={`rounded-lg bg-foreground px-3 py-2 ${contentClassName ?? ''}`}
                pointerEvents="none"
              >
                {content ?? (
                  <Text className={`text-xs text-background ${textClassName ?? ''}`}>{text}</Text>
                )}
              </View>
              {hasArrow ? (
                <View
                  className="absolute size-2.5 rotate-45 bg-foreground"
                  style={arrowStyle}
                  pointerEvents="none"
                />
              ) : null}
            </View>
          </View>
        </Theme>
      </Modal>
    </>
  );
}

type GetTooltipPositionProps = {
  triggerRect: TriggerRect | null;
  tooltipSize: TooltipSize | null;
  placement: TooltipPlacement;
  offset: number;
  shouldFlip: boolean;
  hasArrow: boolean;
};

function getTooltipPosition({
  triggerRect,
  tooltipSize,
  placement,
  offset,
  shouldFlip,
  hasArrow,
}: GetTooltipPositionProps) {
  if (!triggerRect || !tooltipSize) {
    return {
      position: { left: -1000, top: -1000 } as ViewStyle,
      arrowStyle: {} as ViewStyle,
    };
  }

  const window = Dimensions.get('window');
  const viewportPadding = 8;
  const gap = offset + (hasArrow ? 5 : 0);
  let basePlacement = placement.split('-')[0] as 'top' | 'bottom' | 'left' | 'right';
  let align = placement.includes('-start')
    ? 'start'
    : placement.includes('-end')
      ? 'end'
      : 'center';

  let top = 0;
  let left = 0;

  const placeTop = () => {
    top = triggerRect.y - tooltipSize.height - gap;
    left =
      align === 'start'
        ? triggerRect.x
        : align === 'end'
          ? triggerRect.x + triggerRect.width - tooltipSize.width
          : triggerRect.x + (triggerRect.width - tooltipSize.width) / 2;
  };

  const placeBottom = () => {
    top = triggerRect.y + triggerRect.height + gap;
    left =
      align === 'start'
        ? triggerRect.x
        : align === 'end'
          ? triggerRect.x + triggerRect.width - tooltipSize.width
          : triggerRect.x + (triggerRect.width - tooltipSize.width) / 2;
  };

  const placeLeft = () => {
    left = triggerRect.x - tooltipSize.width - gap;
    top =
      align === 'start'
        ? triggerRect.y
        : align === 'end'
          ? triggerRect.y + triggerRect.height - tooltipSize.height
          : triggerRect.y + (triggerRect.height - tooltipSize.height) / 2;
  };

  const placeRight = () => {
    left = triggerRect.x + triggerRect.width + gap;
    top =
      align === 'start'
        ? triggerRect.y
        : align === 'end'
          ? triggerRect.y + triggerRect.height - tooltipSize.height
          : triggerRect.y + (triggerRect.height - tooltipSize.height) / 2;
  };

  const place = () => {
    if (basePlacement === 'top') placeTop();
    else if (basePlacement === 'bottom') placeBottom();
    else if (basePlacement === 'left') placeLeft();
    else placeRight();
  };

  place();

  if (shouldFlip) {
    if (basePlacement === 'top' && top < viewportPadding) {
      basePlacement = 'bottom';
      place();
    } else if (
      basePlacement === 'bottom' &&
      top + tooltipSize.height > window.height - viewportPadding
    ) {
      basePlacement = 'top';
      place();
    } else if (basePlacement === 'left' && left < viewportPadding) {
      basePlacement = 'right';
      place();
    } else if (
      basePlacement === 'right' &&
      left + tooltipSize.width > window.width - viewportPadding
    ) {
      basePlacement = 'left';
      place();
    }
  }

  left = Math.min(
    Math.max(left, viewportPadding),
    Math.max(viewportPadding, window.width - tooltipSize.width - viewportPadding),
  );
  top = Math.min(
    Math.max(top, viewportPadding),
    Math.max(viewportPadding, window.height - tooltipSize.height - viewportPadding),
  );

  let arrowStyle: ViewStyle = {};
  if (hasArrow) {
    if (basePlacement === 'top') {
      arrowStyle = {
        left: Math.min(
          Math.max(triggerRect.x + triggerRect.width / 2 - left - 5, 10),
          tooltipSize.width - 20,
        ),
        bottom: -4,
      };
    } else if (basePlacement === 'bottom') {
      arrowStyle = {
        left: Math.min(
          Math.max(triggerRect.x + triggerRect.width / 2 - left - 5, 10),
          tooltipSize.width - 20,
        ),
        top: -4,
      };
    } else if (basePlacement === 'left') {
      arrowStyle = {
        right: -4,
        top: Math.min(
          Math.max(triggerRect.y + triggerRect.height / 2 - top - 5, 10),
          tooltipSize.height - 20,
        ),
      };
    } else {
      arrowStyle = {
        left: -4,
        top: Math.min(
          Math.max(triggerRect.y + triggerRect.height / 2 - top - 5, 10),
          tooltipSize.height - 20,
        ),
      };
    }
  }

  return {
    position: { left, top } as ViewStyle,
    arrowStyle,
  };
}

export { Tooltip };
