import { X } from 'lucide-react-native';
import { Modal, Pressable, View } from 'react-native';

import { HStack, Text } from '@/components/ui';

type LedgerReportModalProps = {
  visible: boolean;
  from: Date | null;
  to: Date | null;
  onClose: () => void;
};

function formatDate(date: Date | null) {
  if (!date) return null;
  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date);
}

export default function LedgerReportModal({
  visible,
  from,
  to,
  onClose,
}: LedgerReportModalProps) {
  const fromLabel = formatDate(from);
  const toLabel = formatDate(to);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <Pressable className="flex-1 justify-end bg-black/35" onPress={onClose}>
        <Pressable className="rounded-t-3xl bg-surface px-6 pb-8 pt-3" onPress={() => {}}>
          <View className="mx-auto mb-4 h-1 w-10 rounded-full bg-gray-300" />
          <HStack className="items-center justify-between">
            <Text size="lg" bold>
              Báo cáo
            </Text>
            <Pressable
              className="size-9 items-center justify-center rounded-full bg-surfaceSecondary"
              onPress={onClose}
              accessibilityRole="button"
              accessibilityLabel="Đóng báo cáo"
            >
              <X size={18} color="#88888c" />
            </Pressable>
          </HStack>
          {fromLabel || toLabel ? (
            <Text className="mt-4 text-center text-muted">
              {fromLabel}
              {toLabel ? ` - ${toLabel}` : ''}
            </Text>
          ) : null}
          <Text className="mt-6 text-center text-muted">Nội dung báo cáo</Text>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
