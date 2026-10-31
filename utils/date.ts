import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import 'dayjs/locale/vi';

dayjs.extend(customParseFormat);

export function formatDateForStorage(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function formatDate(dayString: string): string {
  const formatted = dayjs(dayString).locale('vi').format('dddd, DD MMMM YYYY');
  return formatted[0].toUpperCase() + formatted.slice(1);
}
