import { cn } from '@/utils/tailwind/cn';
import styles from './RecordButton.module.css';

interface Props {
  onClick?: () => void;
  disabled: boolean;
  isRunning: boolean;
}

export const RecordButton = ({ onClick, disabled, isRunning }: Props) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        'flex items-center px-6 py-4 mx-auto bg-white rounded-full',
        !disabled && 'hover:border-orange-500',
        styles.buttonShadow
      )}
      disabled={disabled}
    >
      <span
        className={cn(
          'block rounded-full mr-2 border-[1px]',
          isRunning ? 'bg-error-50' : 'bg-orange-500 border-white'
        )}
      >
        <span
          className={cn(
            'block w-3 h-3 m-3 bg-white',
            !isRunning && 'rounded-full'
          )}
        ></span>
      </span>
      <span className="text-xl">
        {isRunning ? 'Stop recording' : 'Record a note'}
      </span>
    </button>
  );
};
