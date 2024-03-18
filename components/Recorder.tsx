'use client';

import { RecordButton } from '@/components/RecordButton';
import { Waveform } from '@/components/Waveform';
import { useCounter } from '@/hooks/useCounter';
import { useInterval } from '@/hooks/useInterval';
import useNavigatorPermissions from '@/hooks/useNavigatorPermission';
import { formatDate } from '@/utils/date/formatDate';
import { createNote } from '@/utils/notes/create-note';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import spinner from '../assets/spinner.svg';

const Recorder = ({ userId }: { userId: string }) => {
  const { push } = useRouter();
  const microphonePermission = useNavigatorPermissions(
    'microphone' as PermissionName
  );

  const [title, setTitle] = useState('Record your voice note');
  const [error, setError] = useState<string | null>(null);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null
  );
  const [isRunning, setIsRunning] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const seconds = useCounter();

  const startRecording = async () => {
    setIsRunning(true);
    setError(null);
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
    });
    const recorder = new MediaRecorder(stream);
    let audioChunks: any = [];

    recorder.ondataavailable = (e) => {
      audioChunks.push(e.data);
    };

    recorder.onstop = async () => {
      const blob = new Blob(audioChunks, { type: 'audio/mp3' });
      try {
        const note = await createNote({
          userId,
          audioBlob: blob,
        });

        if (note) {
          return push(`/notes/${note.id}`);
        }
      } catch (e) {
        if (e instanceof Error) {
          setError(e.message);
        } else {
          setError(
            'There was an error with the transcription process, please try again.'
          );
        }
        setIsRunning(false);
        setIsProcessing(false);
        seconds.reset();
      }
    };
    setMediaRecorder(recorder);
    recorder.start(1000);
  };

  function stopRecording() {
    if (!mediaRecorder) {
      setIsRunning(false);
      return;
    }

    mediaRecorder.stop();
    setIsRunning(false);
    setIsProcessing(true);

    // Stop all media tracks
    mediaRecorder.stream.getTracks().forEach((track) => track.stop());
  }

  useInterval(seconds.increment, isRunning && mediaRecorder ? 1000 : null);

  const handleRecordClick = () => {
    if (!isRunning) {
      setTitle(formatDate(new Date()));
      return startRecording();
    }

    setTitle('Generating transcription...');
    stopRecording();
  };

  if (!isRunning && !isProcessing) {
    return (
      <div>
        <RecordButton
          onClick={handleRecordClick}
          disabled={isRunning && !mediaRecorder}
          isRunning={isRunning}
        />
        {error && (
          <p className="text-base font-normal text-center mx-auto mt-4 text-red-500">
            {error}
          </p>
        )}
      </div>
    );
  }

  if (isRunning && microphonePermission.status === 'denied') {
    return (
      <div>
        <p className="text-xl font-400 text-center">Microphone Access Denied</p>
        <p className="text-base font-normal text-center mx-auto mt-4">
          To record voice notes, allow microphone access in your browser
          settings.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="text-5xxl font-400 text-center">
        {Math.floor(seconds.count / 60)}:
        {(seconds.count % 60).toString().padStart(2, '0')}
      </div>
      <p className="text-base font-normal text-center mx-auto mt-4">{title}</p>
      {((isRunning && !mediaRecorder) || isProcessing) && (
        <Image className="m-auto w-10" src={spinner} alt={'Loading'} />
      )}
      <Waveform isProcessing={isProcessing} mediaRecorder={mediaRecorder} />
      {!isProcessing && (
        <RecordButton
          onClick={handleRecordClick}
          disabled={isRunning && !mediaRecorder}
          isRunning={isRunning}
        />
      )}
    </div>
  );
};

export default Recorder;
