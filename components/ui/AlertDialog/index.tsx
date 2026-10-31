import React, { createContext, PropsWithChildren, useContext, useMemo } from 'react';
import {
  Modal,
  ModalProps,
  Pressable,
  PressableProps,
  ScrollView,
  ScrollViewProps,
  View,
  ViewProps,
} from 'react-native';

import Theme from '@/components/Theme';
import { Text } from '@/components/ui/Text';

type AlertDialogContextValue = {
  onClose: () => void;
  closeOnOverlayClick: boolean;
  size: 'xs' | 'sm' | 'md' | 'lg' | 'full';
};

const AlertDialogContext = createContext<AlertDialogContextValue | null>(null);

function useAlertDialogContext() {
  const context = useContext(AlertDialogContext);
  if (!context) {
    throw new Error('AlertDialog components must be used inside AlertDialog');
  }
  return context;
}

export type AlertDialogProps = PropsWithChildren<
  Omit<ModalProps, 'children' | 'visible'> & {
    isOpen: boolean;
    onClose: () => void;
    closeOnOverlayClick?: boolean;
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'full';
  }
>;

function AlertDialog({
  isOpen,
  onClose,
  closeOnOverlayClick = true,
  size = 'md',
  children,
  ...modalProps
}: AlertDialogProps) {
  const context = useMemo(
    () => ({ onClose, closeOnOverlayClick, size }),
    [onClose, closeOnOverlayClick, size],
  );

  return (
    <Modal
      visible={isOpen}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onClose}
      {...modalProps}
    >
      <Theme>
        <AlertDialogContext.Provider value={context}>
          <View className="flex-1 items-center justify-center">{children}</View>
        </AlertDialogContext.Provider>
      </Theme>
    </Modal>
  );
}

export type AlertDialogBackdropProps = Omit<PressableProps, 'onPress' | 'style'> & {
  className?: string;
};

function AlertDialogBackdrop({ className, ...props }: AlertDialogBackdropProps) {
  const { onClose, closeOnOverlayClick } = useAlertDialogContext();

  return (
    <Pressable
      {...props}
      accessibilityRole="button"
      className={`absolute inset-0 z-0 bg-black/50 ${className ?? ''}`}
      onPress={closeOnOverlayClick ? onClose : undefined}
    />
  );
}

export type AlertDialogContentProps = ViewProps & {
  className?: string;
};

function AlertDialogContent({ className, ...props }: AlertDialogContentProps) {
  const { size } = useAlertDialogContext();
  const sizeClassName = {
    xs: 'w-[60%] max-w-[360px]',
    sm: 'w-[70%] max-w-[420px]',
    md: 'w-[80%] max-w-[510px]',
    lg: 'w-[90%] max-w-[640px]',
    full: 'w-full',
  }[size];

  return (
    <View
      {...props}
      pointerEvents="auto"
      className={`z-10 overflow-hidden rounded-3xl border border-border bg-surface ${sizeClassName} ${className ?? ''}`}
    />
  );
}

function AlertDialogHeader({ className, ...props }: ViewProps & { className?: string }) {
  return (
    <View
      {...props}
      className={`flex-row items-center justify-between px-4 pt-4 pb-2 ${className ?? ''}`}
    />
  );
}

function AlertDialogBody({ className, ...props }: ScrollViewProps & { className?: string }) {
  return <ScrollView {...props} className={className} />;
}

function AlertDialogFooter({ className, ...props }: ViewProps & { className?: string }) {
  return (
    <View
      {...props}
      className={`flex-row items-center justify-end gap-3 ${className ?? ''}`}
    />
  );
}

function AlertDialogCloseButton({
  className,
  onPress,
  ...props
}: PressableProps & { className?: string }) {
  const { onClose } = useAlertDialogContext();

  return (
    <Pressable
      {...props}
      accessibilityRole="button"
      className={`z-10 rounded-lg p-2 active:bg-black/10 ${className ?? ''}`}
      onPress={(event) => {
        onPress?.(event);
        onClose();
      }}
    />
  );
}

export type ConfirmAlertDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  pending?: boolean;
  error?: string | null;
};

function ConfirmAlertDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = 'Xác nhận',
  cancelText = 'Hủy',
  pending = false,
  error,
}: ConfirmAlertDialogProps) {
  return (
    <AlertDialog
      isOpen={isOpen}
      onClose={() => {
        if (!pending) onClose();
      }}
      size="sm"
      closeOnOverlayClick={!pending}
    >
      <AlertDialogBackdrop />
      <AlertDialogContent>
        <AlertDialogHeader className="p-4 pb-2">
          <Text className="font-semibold" size="xl">
            {title}
          </Text>
        </AlertDialogHeader>
        <AlertDialogBody className="px-4 pb-4">
          <Text className="text-muted">{description}</Text>
          {error && <Text className="mt-3 text-spend">{error}</Text>}
        </AlertDialogBody>
        <AlertDialogFooter className="border-t border-border p-3">
          <Pressable
            accessibilityRole="button"
            disabled={pending}
            className="rounded-full px-4 py-3 active:bg-black/10"
            onPress={onClose}
          >
            <Text>{cancelText}</Text>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            disabled={pending}
            className="rounded-full bg-spend px-4 py-3 active:opacity-80"
            onPress={onConfirm}
          >
            <Text className="font-semibold text-white">
              {pending ? `${confirmText}...` : confirmText}
            </Text>
          </Pressable>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export {
  AlertDialog,
  AlertDialogBackdrop,
  AlertDialogBody,
  AlertDialogCloseButton,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  ConfirmAlertDialog,
};
