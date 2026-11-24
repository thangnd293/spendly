import { useEffect, useState } from 'react';
import { Image } from 'react-native';
import { Center } from './Center';
import { Text } from './Text';

const AVATAR_COLORS = [
  { bg: 'bg-yellow-100', text: 'text-yellow-600' },
  { bg: 'bg-green-100', text: 'text-green-600' },
  { bg: 'bg-blue-100', text: 'text-blue-600' },
  { bg: 'bg-pink-100', text: 'text-pink-600' },
  { bg: 'bg-purple-100', text: 'text-purple-600' },
  { bg: 'bg-orange-100', text: 'text-orange-600' },
  { bg: 'bg-teal-100', text: 'text-teal-600' },
  { bg: 'bg-red-100', text: 'text-red-600' },
] as const;

function getAvatarColor(seed: string) {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  }
  return AVATAR_COLORS[hash % AVATAR_COLORS.length];
}

type AvatarProps = {
  name: string;
  uri?: string | null;
  size?: number;
};

export default function Avatar({ name, uri, size = 48 }: AvatarProps) {
  const [failed, setFailed] = useState(false);

  // Đổi link thì thử tải lại
  useEffect(() => {
    setFailed(false);
  }, [uri]);

  if (uri && !failed) {
    return (
      <Image
        source={{ uri }}
        style={{ width: size, height: size, borderRadius: size / 2 }}
        className="bg-background"
        onError={() => setFailed(true)}
      />
    );
  }

  const color = getAvatarColor(name);

  return (
    <Center style={{ width: size, height: size }} className={`rounded-full ${color.bg}`}>
      <Text className={color.text} size="2xl" bold>
        {(Array.from(name)[0] ?? '?').toUpperCase()}
      </Text>
    </Center>
  );
}
