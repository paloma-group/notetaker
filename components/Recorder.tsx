'use client';

import { RecordButton } from '@/components/RecordButton';
import { Waveform } from '@/components/Waveform';
import { useCounter } from '@/hooks/useCounter';
import { useInterval } from '@/hooks/useInterval';
import useNavigatorPermissions from '@/hooks/useNavigatorPermission';
import { formatDate } from '@/utils/date/formatDate';
import { createNote } from '@/utils/notes/create-note';
import Image from 'next/image';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { use, useEffect, useRef, useState } from 'react';
import spinner from '../assets/spinner.svg';

const WHISPER_SAMPLING_RATE = 16_000;
const MAX_AUDIO_LENGTH = 30; // seconds
const MAX_SAMPLES = WHISPER_SAMPLING_RATE * MAX_AUDIO_LENGTH;

const Recorder = ({ userId }: { userId: string }) => {
  const { push, replace } = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const microphonePermission = useNavigatorPermissions(
    'microphone' as PermissionName
  );

  const [title, setTitle] = useState('Record your voice note');
  const [error, setError] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const seconds = useCounter();
  const workerRef = useRef<Worker | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const [transcription, setTranscription] = useState('');
  const [chunks, setChunks] = useState<Blob[]>([]);
  const [shouldStartRecording, setShouldStartRecording] = useState(false);

  const record = searchParams.get('record');

  // Setup serach params
  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    if (record) {
      params.delete('record');
      replace(`${pathname}?${params.toString()}`);
      (async () => await startRecording())();
    }
  }, [record]);

  // Setup worker.js for speech recognition
  useEffect(() => {
    workerRef.current = new Worker(
      new URL('../utils/whisper/worker.js', import.meta.url)
    );

    const handleWorkerMessage = (e: MessageEvent) => {
      const { status, output } = e.data;

      switch (status) {
        case 'ready':
          // The worker is ready, you can now start recording or enable UI elements
          console.log('Worker is ready to process audio data.');
          break;
        case 'update':
          // Log the partial transcript as it's being processed
          // console.log('Transcription update:', output);
          break;
        case 'complete':
          // Log the final transcript and update the state
          console.log('Transcription complete:', output);
          setTranscription((prev) => {
            console.log(`Previous: ${prev}\n\nTranscription: ${transcription}`)
            const newTranscript = `${transcription} ${output}` //`${prev?.trim()} ${output}`
            return newTranscript;
          }); // Assuming 'output' is the final transcript text
          if (recorderRef.current?.state === 'recording') {
            recorderRef.current?.requestData();
          }
          break;
        default:
          // Handle other statuses or log an unrecognized status
          console.log(`Received unrecognized status from worker: ${status}`);
      }
    };

    workerRef.current.addEventListener('message', handleWorkerMessage);

    // Post a message to the worker to load the model
    workerRef.current.postMessage({ type: 'load' });

    return () => {
      workerRef.current?.removeEventListener('message', handleWorkerMessage);
      workerRef.current?.terminate();
    };
  }, []);

  // Setup MediaRecorder when recording should be started
  useEffect(() => {
    if (recorderRef.current) return;

    if (shouldStartRecording) {
      if (navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices
          .getUserMedia({ audio: true })
          .then((stream) => {
            recorderRef.current = new MediaRecorder(stream);
            audioContextRef.current = new AudioContext({ sampleRate: 16000 });

            recorderRef.current.onstart = () => {
              console.log('onstart: Recording started. Setting chunks to emmpty.')
              setChunks([]);
            };
            recorderRef.current.ondataavailable = (e) => {
              if (e.data.size > 0) {
                setChunks((prev) => [...prev, e.data]);
              } else {
                // Empty chunk received, so we request new data after a short timeout
                setTimeout(() => {
                  if (recorderRef.current) recorderRef.current.requestData();
                }, 25);
              }
            };

            recorderRef.current.onstop = () => {
              console.log('onstop: Recording stopped');
              setIsRunning(false);
              setIsProcessing(false);
              seconds.reset();
            };

            // Start recording
            recorderRef.current?.start();
          })
          .catch((err) => console.error('The following error occurred: ', err));
      } else {
        console.error('getUserMedia not supported on your browser!');
      }
      setShouldStartRecording(false);
    }

    return () => {
      recorderRef.current?.stop();
      recorderRef.current = null;
      setShouldStartRecording(false);
    };
  }, [shouldStartRecording]);

  // Process audio chunks
  useEffect(() => {
    if (!recorderRef.current) return;
    if (!isRunning) return;
    // if (status !== 'ready') return;
    
    if (chunks.length > 0) {
      // Generate from data
      console.log(
        `Generating from ${chunks.length} chunks with mimetype ${recorderRef.current.mimeType}`
      );
      const blob = new Blob(chunks, { type: recorderRef.current.mimeType });

      const fileReader = new FileReader();

      fileReader.onloadend = async () => {
        const arrayBuffer = fileReader.result;
        if (!arrayBuffer || typeof arrayBuffer === 'string') return;
        const decoded =
          await audioContextRef.current?.decodeAudioData(arrayBuffer);
        let audio = decoded?.getChannelData(0);
        if (audio && audio.length > MAX_SAMPLES) {
          // Get last MAX_SAMPLES
          audio = audio.slice(-MAX_SAMPLES);
        }

        workerRef.current?.postMessage({
          type: 'generate',
          data: { audio, language: 'en' },
        });
      };
      fileReader.readAsArrayBuffer(blob);
    } else {
      if (recorderRef.current?.state === 'recording') {
        recorderRef.current.requestData();
      }
    }
  }, [isRunning, isProcessing, chunks]);

  const startRecording = async () => {
    setShouldStartRecording(true);
    setIsRunning(true);
    setError(null);
    // const stream = await navigator.mediaDevices.getUserMedia({
    //   audio: true,
    // });
    // const recorder = new MediaRecorder(stream);
    // let audioChunks: any = [];

    // recorder.ondataavailable = (e) => {
    //   audioChunks.push(e.data);
    // };

    // recorder.onstop = async () => {
    //   const blob = new Blob(audioChunks, { type: 'audio/mp3' });
    //   try {
    //     const note = await createNote({
    //       userId,
    //       audioBlob: blob,
    //     });

    //     if (note) {
    //       return push(`/notes/${note.id}`);
    //     }
    //   } catch (e) {
    //     if (e instanceof Error) {
    //       setError(e.message);
    //     } else {
    //       setError(
    //         'There was an error with the transcription process, please try again.'
    //       );
    //     }
    //     setIsRunning(false);
    //     setIsProcessing(false);
    //     seconds.reset();
    //   }
    //   recorderRef.current = null;
    // };
    // recorderRef.current = recorder;
    // recorder.start(1000);
  };

  function stopRecording() {
    if (!recorderRef.current) {
      setIsRunning(false);
      return;
    }

    recorderRef.current.stop();
    setIsRunning(false);
    setIsProcessing(true);

    // Stop all media tracks
    recorderRef.current.stream.getTracks().forEach((track) => track.stop());
  }

  useInterval(
    seconds.increment,
    isRunning && recorderRef.current ? 1000 : null
  );

  const handleRecordClick = () => {
    if (!isRunning) {
      setTitle(formatDate(new Date()));
      return startRecording();
    }

    setTitle('Generating transcription...');
    stopRecording();
  };

  const displayTranscript = () => transcription && (
    <div className="text-base font-normal text-center mx-auto mt-4 overflow-auto max-h-24" style={{lineHeight: '1.5em', maxHeight: '12em'}}>
      {transcription}
    </div>
  )

  if (!isRunning && !isProcessing) {
    return (
      <div>
        <RecordButton
          onClick={handleRecordClick}
          disabled={isRunning && !recorderRef.current}
          isRunning={isRunning}
        />
        {displayTranscript()}
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
      {((isRunning && !recorderRef.current) || isProcessing) && (
        <Image className="m-auto w-10" src={spinner} alt={'Loading'} />
      )}
      <Waveform
        isProcessing={isProcessing}
        mediaRecorder={recorderRef.current}
      />
      {!isProcessing && (
        <RecordButton
          onClick={handleRecordClick}
          disabled={isRunning && !recorderRef.current}
          isRunning={isRunning}
        />
      )}
      {displayTranscript()}
    </div>
  );
};

export default Recorder;
