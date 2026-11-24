import { useMemo } from 'react';
import { View } from 'react-native';
import Svg, { Line, Path } from 'react-native-svg';
import type { LucideIcon } from 'lucide-react-native';

import { Text } from '@/components/ui';

export type DonutItem = {
  key: string;
  label: string;
  value: number;
  color: string;
  icon: LucideIcon;
};

type Props = {
  data: DonutItem[];
  size?: number; // khung vuông chứa cả vòng + icon + %
  outerRadius?: number;
  innerRadius?: number;
};

const ICON_SIZE = 32;
const LABEL_W = 36;
const LABEL_H = 16;
const GAP = 0.025; // rad, khe hở giữa các cung

export default function ExpenseDonut({
  data,
  size = 300,
  outerRadius = 62,
  innerRadius = 40,
}: Props) {
  const cx = size / 2;
  const cy = size / 2;
  const iconOrbit = outerRadius + 38; // khoảng cách từ tâm tới tâm icon
  const iconR = ICON_SIZE / 2;

  const slices = useMemo(() => {
    const total = data.reduce((s, d) => s + d.value, 0);
    if (total <= 0) return [];

    const polar = (r: number, a: number) => ({
      x: cx + r * Math.cos(a),
      y: cy + r * Math.sin(a),
    });

    let angle = -Math.PI / 2; // bắt đầu từ đỉnh, đi theo chiều kim đồng hồ

    return data
      .filter((d) => d.value > 0)
      .map((d) => {
        const sweep = Math.min((d.value / total) * Math.PI * 2, Math.PI * 2 - 0.001);
        const a0 = angle + GAP / 2;
        const a1 = angle + sweep - GAP / 2;
        const mid = angle + sweep / 2;
        angle += sweep;

        const p1 = polar(outerRadius, a0);
        const p2 = polar(outerRadius, a1);
        const p3 = polar(innerRadius, a1);
        const p4 = polar(innerRadius, a0);
        const large = a1 - a0 > Math.PI ? 1 : 0;

        const path =
          `M ${p1.x} ${p1.y} ` +
          `A ${outerRadius} ${outerRadius} 0 ${large} 1 ${p2.x} ${p2.y} ` +
          `L ${p3.x} ${p3.y} ` +
          `A ${innerRadius} ${innerRadius} 0 ${large} 0 ${p4.x} ${p4.y} Z`;

        const cos = Math.cos(mid);
        const sin = Math.sin(mid);

        // Đường nối: từ mép ngoài vòng tới mép icon
        const lineStart = polar(outerRadius + 3, mid);
        const lineEnd = polar(iconOrbit - iconR, mid);
        const iconCenter = polar(iconOrbit, mid);

        // Label % nằm ngoài icon, dịch theo hướng để không đè icon
        const labelDist = iconR + 6 + (LABEL_W / 2) * Math.abs(cos) + (LABEL_H / 2) * Math.abs(sin);
        const labelCenter = {
          x: iconCenter.x + cos * labelDist,
          y: iconCenter.y + sin * labelDist,
        };

        return {
          ...d,
          percent: Math.round((d.value / total) * 100),
          path,
          lineStart,
          lineEnd,
          iconCenter,
          labelCenter,
        };
      });
  }, [data, cx, cy, outerRadius, innerRadius, iconOrbit, iconR]);

  return (
    <View style={{ width: size, height: size, alignSelf: 'center' }}>
      <Svg width={size} height={size} style={{ position: 'absolute' }}>
        {slices.map((s) => (
          <Path key={`p-${s.key}`} d={s.path} fill={s.color} />
        ))}
        {slices.map((s) => (
          <Line
            key={`l-${s.key}`}
            x1={s.lineStart.x}
            y1={s.lineStart.y}
            x2={s.lineEnd.x}
            y2={s.lineEnd.y}
            stroke={s.color}
            strokeWidth={1}
            strokeOpacity={0.7}
          />
        ))}
      </Svg>

      {slices.map((s) => {
        const Icon = s.icon;
        return (
          <View key={`i-${s.key}`}>
            <View
              style={{
                position: 'absolute',
                left: s.iconCenter.x - iconR,
                top: s.iconCenter.y - iconR,
                width: ICON_SIZE,
                height: ICON_SIZE,
                borderRadius: iconR,
                backgroundColor: s.color,
              }}
              className="items-center justify-center"
              accessibilityLabel={s.label}
            >
              <Icon size={16} color="#fff" />
            </View>
            <Text
              size="sm"
              className="text-center text-muted"
              style={{
                position: 'absolute',
                left: s.labelCenter.x - LABEL_W / 2,
                top: s.labelCenter.y - LABEL_H / 2,
                width: LABEL_W,
                height: LABEL_H,
              }}
            >
              {s.percent}%
            </Text>
          </View>
        );
      })}
    </View>
  );
}
