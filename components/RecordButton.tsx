import { cn } from '@/utils/tailwind/cn';
import styles from './RecordButton.module.css';
import Image from 'next/image';
import record from '@/assets/record.svg';
import recordActive from '@/assets/record_active.svg';

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
        !disabled && 'hover:border-orange-da',
        styles.buttonShadow
      )}
      disabled={disabled}
    >
      <Image
        className="drop-shadow-lg mr-2"
        src={isRunning ? recordActive : record}
        alt="Record icon"
      />
      <span className="text-xl">
        {isRunning ? 'Stop recording' : 'Record a note'}
      </span>
    </button>
  );
};
