import { cn } from '@/lib/utils';

interface ChipProps {
  value?: React.ReactNode | string;
  selected?: boolean;
  disabled?: boolean;
  color?: boolean;
  onSelect?: () => void;
  className?: string;
}

export function Chip({
  value,
  selected,
  disabled,
  color,
  onSelect,
  className,
}: ChipProps) {
  const baseClasses = 'chip-wrapper relative inline-flex items-center justify-center';
  const selectedClasses = selected ? 'border-primary' : '';
  const hoverClasses =
    !disabled && !selected ? 'hover:bg-gray-200' : '';
  const disabledClasses = disabled
    ? 'bg-component border-disabled/50 hover:bg-component cursor-not-allowed text-disabled'
    : 'cursor-pointer';
  const colorClasses = color
    ? 'w-[40px] h-[40px] border rounded-md'
    : 'px-3 py-1 border rounded-md';

  return (
    <div
      data-disabled={disabled}
      className={cn(
        baseClasses,
        colorClasses,
        selectedClasses,
        hoverClasses,
        disabledClasses,
        className
      )}
      onClick={!disabled ? onSelect : undefined}
      role='button'
      tabIndex={disabled ? -1 : 0}
    >
      {color ? (
        <span
          className={cn(
            'w-[32px] h-[32px] bg-action rounded-xs',
            disabled && 'bg-disabled'
          )}
          style={{
            backgroundColor: (value || '').toString(),
          }}
        />
      ) : (
        value
      )}
    </div>
  );
}
