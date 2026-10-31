import { PropsWithChildren } from 'react';
import { Center } from '@/components/ui';

function FormRowLeading({ className, children }: PropsWithChildren<{ className?: string }>) {
  return <Center className={`w-20 shrink-0 ${className ? className : ''}`}>{children}</Center>;
}
export { FormRowLeading };
