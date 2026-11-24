import { useMemo, useState } from 'react';
import { View } from 'react-native';
import { BarChart } from 'react-native-gifted-charts';

import { Text } from '@/components/ui';
import useColors from '@/hooks/useColors';
import { formatCompact, niceCeil, type Period } from '@/utils/period';

const BAR_WIDTH = 30;
const Y_LABEL_WIDTH = 44;
const TOP_LABEL_WIDTH = 56;

type Props = {
  periods: Period[];
  /** Cùng độ dài và thứ tự với periods, giá trị >= 0 */
  values: number[];
  /** Bar nào được gắn nhãn "extreme" ngoài bar hiện tại. Mặc định 'max' */
  extreme?: 'max' | 'min' | null;
  /** Vd '+' cho thu nhập */
  valuePrefix?: string;
  /** Màu bar kỳ hiện tại, mặc định colors.primary */
  activeColor?: string;
  activeGradientColor?: string;
  height?: number;
};

export default function PeriodBarChart({
  periods,
  values,
  extreme = 'max',
  valuePrefix = '',
  activeColor,
  activeGradientColor,
  height = 150,
}: Props) {
  const colors = useColors();
  const [width, setWidth] = useState(0);

  const active = activeColor ?? colors.primary;
  const activeGradient = activeGradientColor ?? colors.chartGradientEnd;
  const gradientTop = activeGradientColor ?? colors.chartGradientStart;
  const gradientBottom = activeColor ?? colors.chartGradientEnd;

  const { barData, maxValue } = useMemo(() => {
    const safe = values.map((v) => Math.max(v, 0));
    const maxValue = niceCeil(Math.max(...safe, 0));

    // Chỉ đánh dấu khi có bar > 0
    let extremeIdx = -1;
    if (extreme && safe.some((v) => v > 0)) {
      extremeIdx = safe.reduce(
        (best, v, i) =>
          extreme === 'max' ? (v > safe[best] ? i : best) : v < safe[best] ? i : best,
        0,
      );
    }

    const barData = periods.map((p, i) => {
      const value = safe[i] ?? 0;
      const isExtreme = i === extremeIdx;
      const showLabel = p.isCurrent || isExtreme;

      return {
        value,
        label: p.label,
        frontColor: p.isCurrent ? gradientBottom : colors.border,
        gradientColor: p.isCurrent ? gradientTop : undefined,
        showGradient: p.isCurrent,
        barBorderTopLeftRadius: 6,
        barBorderTopRightRadius: 6,
        topLabelContainerStyle: {
          width: TOP_LABEL_WIDTH,
          left: -(TOP_LABEL_WIDTH - BAR_WIDTH) / 2,
        },
        topLabelComponent: showLabel
          ? () => (
              <View className="mb-1 items-center">
                <Text
                  size="sm"
                  numberOfLines={1}
                  className={p.isCurrent ? 'font-semibold' : 'font-medium text-muted'}
                >
                  {value > 0 ? valuePrefix : ''}
                  {formatCompact(value)}
                </Text>
              </View>
            )
          : undefined,
        labelTextStyle: {
          color: p.isCurrent ? active : colors.muted,
          fontSize: 11,
          fontWeight: p.isCurrent ? ('700' as const) : ('400' as const),
          textAlign: 'center' as const,
        },
      };
    });

    return { barData, maxValue };
  }, [periods, values, extreme, valuePrefix, active, activeGradient, colors]);

  const count = periods.length;
  const plotWidth = Math.max(width - Y_LABEL_WIDTH, 0);
  const spacing = Math.max((plotWidth - BAR_WIDTH * count) / count, 4);

  return (
    <View onLayout={(e) => setWidth(e.nativeEvent.layout.width)}>
      {width > 0 && (
        <BarChart
          data={barData}
          width={plotWidth}
          height={height}
          barWidth={BAR_WIDTH}
          spacing={spacing}
          initialSpacing={spacing / 2}
          endSpacing={0}
          maxValue={maxValue}
          noOfSections={3}
          formatYLabel={(label) => (Number(label) === 0 ? '0' : formatCompact(Number(label)))}
          yAxisLabelWidth={Y_LABEL_WIDTH}
          yAxisTextStyle={{ color: colors.muted, fontSize: 11 }}
          yAxisThickness={0}
          xAxisThickness={1}
          xAxisColor={colors.border}
          xAxisLabelsHeight={18}
          rulesType="solid"
          rulesColor={colors.border}
          disableScroll
          isAnimated
        />
      )}
    </View>
  );
}
