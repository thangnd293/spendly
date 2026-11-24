import { Text, VStack } from '@/components/ui';
import { Image } from 'react-native';

export default function Hero() {
  return (
    <VStack className="items-center px-6 pt-6">
      <Image
        source={require('@/assets/illustrations/add-contact.png')}
        style={{ width: 200, height: 160 }}
        resizeMode="contain"
      />
      <Text size="3xl" bold className="mt-4 text-center">
        Thêm liên hệ mới
      </Text>
      <Text size="lg" className="mt-2 text-center text-muted">
        Nhập tên người bạn muốn thêm{'\n'}vào danh sách
      </Text>
    </VStack>
  );
}
