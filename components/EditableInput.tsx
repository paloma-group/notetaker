'use client';

import spinner from '@/assets/spinner.svg';
import { InputHTMLAttributes, useState } from 'react';
import { useFormStatus } from 'react-dom';
import Image from 'next/image';
import { PiCheck, PiPencil, PiX } from 'react-icons/pi';

export default function EditableInput({
  label,
  inputProps,
  action,
}: {
  label: string;
  inputProps?: InputHTMLAttributes<HTMLInputElement>;
  action?: (data: FormData) => Promise<any>;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [isError, setIsError] = useState(false);

  const handleEditClick = () => {
    setIsError(false);
    setIsEditing(true);
  };

  const handleCancelEditing = () => {
    setIsEditing(false);
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

  const handleAction = async (data: FormData) => {
    const inputText = data.get('input');
    if (typeof inputText === 'string' && action) {
      setIsEditing(false);
      if (inputProps?.defaultValue !== inputText) {
        const result = await action(data);
        if (result.error) {
          setIsError(true);
        }
      }
    }
  };

  return (
    <form action={handleAction}>
      <div className="grid">
        <label className="text-md mb-2">{label}</label>
        <div className="relative">
          <input
            name="input"
            className="rounded-md w-full truncate pl-4 pr-11 py-2 border bg-white disabled:text-gray-400"
            type="text"
            disabled={!isEditing}
            {...inputProps}
          />
          <div className="absolute top-3 right-3">
            {!isEditing && (
              <button onClick={handleEditClick}>
                <PiPencil />
              </button>
            )}
            <EditButtons onCancel={handleCancelEditing} isEditing={isEditing} />
          </div>
          {isError && (
            <p className="text-sm text-red-500">An error occurred.</p>
          )}
        </div>
      </div>
    </form>
  );
}
