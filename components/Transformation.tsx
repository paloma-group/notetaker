'use client';

import spinner from '@/assets/spinner.svg';
import { formatDate } from '@/utils/date/formatDate';
import Image from 'next/image';
import { useOptimistic, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { PiCheck, PiPencil, PiX } from 'react-icons/pi';
import { CopyToClipboardButton } from './CopyToClipboardButton';

interface Props {
  title?: string | null;
  text?: string | null;
  created_at?: string | null;
  action?: (data: FormData) => Promise<any>;
}

const EditableText = ({
  isEditing,
  text,
}: {
  isEditing: boolean;
  text: string;
}) => {
  const formState = useFormStatus();

  return (
    <div className={'w-full relative'}>
      {isEditing && !formState.pending ? (
        <>
          <textarea
            name={'transcript'}
            className={'w-full p-2'}
            defaultValue={text ?? ''}
            rows={6}
          />
          <div className={'absolute right-2 bottom-4 flex gap-4'}></div>
        </>
      ) : (
        <p>{text}</p>
      )}
    </div>
  );
};

const EditButtons = ({
  onCancel,
  isEditing,
}: {
  onCancel: () => void;
  isEditing: boolean;
}) => {
  const formState = useFormStatus();

  if (!isEditing) {
    return;
  }

  if (formState.pending) {
    return <Image className="m-auto size-4" src={spinner} alt={'Loading'} />;
  }

  return (
    <>
      <button onClick={onCancel} type={'button'}>
        <PiX className={'text-red-500'} />
      </button>
      <button type={'submit'}>
        <PiCheck className={'text-green-500'} />
      </button>
    </>
  );
};

export default function Transformation({
  title,
  text,
  created_at,
  action,
}: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [optimisticText, updateOptimisticText] = useOptimistic<string>(
    text ?? ''
  );

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelEditing = () => {
    setIsEditing(false);
  };

  const handleSave = async () => {
    setIsEditing(false);
  };

  const handleAction = async (data: FormData) => {
    const transcript = data.get('transcript');
    if (typeof transcript === 'string' && action) {
      setIsEditing(false);
      updateOptimisticText(transcript);
      await action(data);
    }
  };

  return (
    <form action={handleAction}>
      <div className="bg-gray-300 p-6 grid gap-4 rounded-xl">
        <div className={'flex justify-between'}>
          <h3 className="text-xl font-semibold">{title}</h3>
          <div className={'flex gap-4'}>
            {action && !isEditing && (
              <button onClick={handleEditClick}>
                <PiPencil />
              </button>
            )}
            {action && (
              <EditButtons
                onCancel={handleCancelEditing}
                isEditing={isEditing}
              />
            )}
            <CopyToClipboardButton text={optimisticText} />
          </div>
        </div>
        {created_at && (
          <h4 className="text-sm">{formatDate(new Date(created_at))}</h4>
        )}
        {action ? (
          <EditableText isEditing={isEditing} text={optimisticText} />
        ) : (
          <p>{optimisticText}</p>
        )}
      </div>
    </form>
  );
}
