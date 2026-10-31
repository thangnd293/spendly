import { CalendarDays, ChevronLeft, ChevronRight } from 'lucide-react-native';
import { useState } from 'react';
import { Modal, Pressable } from 'react-native';
import { Calendar, DateData } from 'react-native-calendars';

import { HStack, Text } from '@/components/ui';
import useColors from '@/hooks/useColors';
import { FormRowLeading } from '../FormRowLeading';
import { addDays, formatBar, fromYmd, toYmd } from './dateUtils';
import './locale';
import { MonthPicker } from './MonthPicker';
import { StepButton } from './StepButton';

type DatePickerProps = {
  value: Date;
  onChange: (date: Date) => void;
  onOpen?: () => void;
};

function DatePicker({ value, onChange, onOpen }: DatePickerProps) {
  const colors = useColors();
  const [open, setOpen] = useState(false);
  const [monthPickerOpen, setMonthPickerOpen] = useState(false);
  const [pickerYear, setPickerYear] = useState(value.getFullYear());
  const [calendarStart, setCalendarStart] = useState(toYmd(value));

  const selected = toYmd(value);

  function backToCalendar() {
    setMonthPickerOpen(false);
  }

  function openCalendar() {
    onOpen?.();
    setCalendarStart(selected);
    setMonthPickerOpen(false);
    setOpen(true);
  }

  function pickMonth(month: number) {
    const date = `${pickerYear}-${String(month + 1).padStart(2, '0')}-01`;
    setCalendarStart(date);
    backToCalendar();
  }

  function pickDate(day: DateData) {
    onChange(fromYmd(day.dateString));
    setOpen(false);
  }

  return (
    <>
      <HStack className="items-center">
        <FormRowLeading>
          <CalendarDays />
        </FormRowLeading>
        <HStack className="flex-1 items-center py-3 pr-1" space="lg">
          <StepButton
            direction="left"
            onPress={() => onChange(addDays(value, -1))}
            accessibilityLabel="Ngày trước"
          />
          <Pressable
            className="h-8 flex-1 items-center justify-center rounded-md bg-background"
            onPress={openCalendar}
          >
            <Text className="text-primary" numberOfLines={1}>
              {formatBar(value)}
            </Text>
          </Pressable>
          <StepButton
            direction="right"
            onPress={() => onChange(addDays(value, 1))}
            accessibilityLabel="Ngày sau"
          />
        </HStack>
      </HStack>
      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <Pressable
          className="flex-1 items-center justify-center bg-black/35 p-6"
          onPress={() => setOpen(false)}
        >
          <Pressable
            className="w-full max-w-96 rounded-2xl bg-surface px-2 pb-3 pt-2"
            onPress={() => {}}
          >
            {monthPickerOpen ? (
              <MonthPicker
                year={pickerYear}
                pickedDate={value}
                onYearChange={setPickerYear}
                onPickMonth={pickMonth}
                onPressYear={backToCalendar}
              />
            ) : (
              <Calendar
                initialDate={calendarStart}
                firstDay={1}
                hideExtraDays={false}
                enableSwipeMonths
                onDayPress={pickDate}
                markedDates={{
                  [selected]: {
                    selected: true,
                    selectedColor: colors.primary,
                    selectedTextColor: '#FFFFFF',
                  },
                }}
                renderHeader={(date) => (
                  <Pressable
                    onPress={() => {
                      if (!date) return;
                      setPickerYear(date.getFullYear());
                      setMonthPickerOpen(true);
                    }}
                    accessibilityRole="button"
                    accessibilityLabel="Chọn tháng và năm"
                    className="px-2 py-1"
                  >
                    <Text className="text-primary">
                      {date ? `Tháng ${date.getMonth() + 1} ${date.getFullYear()}` : ''}
                    </Text>
                  </Pressable>
                )}
                renderArrow={(direction) =>
                  direction === 'left' ? (
                    <ChevronLeft color={colors.primary} />
                  ) : (
                    <ChevronRight color={colors.primary} />
                  )
                }
                theme={{
                  calendarBackground: colors.surface,
                  textSectionTitleColor: colors.muted,
                  todayTextColor: colors.accent,
                  dayTextColor: colors.foreground,
                  textDisabledColor: colors.muted,
                  textDayFontSize: 16,
                  textDayHeaderFontSize: 11,
                  textDayFontWeight: '500',
                  arrowStyle: { padding: 0, backgroundColor: colors.surface, borderRadius: '100%' },
                }}
              />
            )}
            <HStack className="items-center justify-between">
              {!monthPickerOpen ? (
                <Pressable
                  onPress={() => setOpen(false)}
                  className="px-3 py-2"
                  accessibilityLabel="Hủy"
                >
                  <Text className="text-foreground">Hủy</Text>
                </Pressable>
              ) : (
                <Pressable
                  onPress={backToCalendar}
                  className="px-3 py-2"
                  accessibilityRole="button"
                  accessibilityLabel="Quay lại chọn ngày"
                >
                  <Text className="text-foreground">Quay lại</Text>
                </Pressable>
              )}
            </HStack>
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}

export { DatePicker };
