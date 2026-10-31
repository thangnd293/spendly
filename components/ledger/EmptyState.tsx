import { Image, Text, VStack } from '@/components/ui';

export default function EmptyState() {
  return (
    <VStack className="flex-1 items-center justify-center overflow-hidden px-6 pb-4">
      <Image
        size="none"
        style={{ width: 160, height: 128 }}
        resizeMode="contain"
        source={require('@/assets/images/search.png')}
        alt="Không có dữ liệu"
      />
      <Text className="mt-2 text-center" size="lg" bold>
        Không có dữ liệu
      </Text>
      <Text className="mt-1 text-center text-muted" size="sm">
        Hiện tại chưa có giao dịch nào trong khoảng thời gian này
      </Text>
    </VStack>
  );
}
