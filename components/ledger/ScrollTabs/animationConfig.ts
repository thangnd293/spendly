import { Easing, WithTimingConfig } from 'react-native-reanimated';

export const scrollTabsTiming: WithTimingConfig = {
  duration: 280,
  easing: Easing.out(Easing.cubic),
};
