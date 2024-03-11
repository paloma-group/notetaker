'use client';

import { useEffect, useState, useRef, startTransition } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { formatDate } from '@/utils/date/formatDate';
import { createNote } from '@/utils/notes/create-note';

const Recorder = ({ userId }: { userId: string }) => {
  const { push, refresh } = useRouter();

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioContext = useRef<AudioContext | null>(null);
  const analyser = useRef<AnalyserNode | null>(null);
  const dataArray = useRef<Uint8Array | null>(null);

  const [title, setTitle] = useState('Record your voice note');
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null
  );
  const [isRunning, setIsRunning] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [minutes, setMinutes] = useState(0);

  async function startRecording() {
    setIsRunning(true);
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
      const note = await createNote({
        supabase: createClient(),
        userId,
        audioBlob: blob,
      });

      if (note) {
        startTransition(() => {
          refresh();
          push(`/recording/${note.id}`);
        });
      }

      setTitle('Record your voice note');
      setMinutes(0);
      setSeconds(0);
    };
    setMediaRecorder(recorder);
    recorder.start(1000);
  }

  function stopRecording() {
    // @ts-ignore
    mediaRecorder.stop();
    setIsRunning(false);
    setIsProcessing(true);

    // Stop all media tracks
    mediaRecorder?.stream.getTracks().forEach((track) => track.stop());
  }

  useEffect(() => {
    if (canvasRef.current && mediaRecorder && mediaRecorder.stream) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        audioContext.current = new AudioContext();
        analyser.current = audioContext.current.createAnalyser();
        const source = audioContext.current.createMediaStreamSource(
          mediaRecorder.stream
        );
        source.connect(analyser.current);
        analyser.current.fftSize = 256;
        const bufferLength = analyser.current.frequencyBinCount;
        dataArray.current = new Uint8Array(bufferLength);

        // Initialize an array to store smoothed amplitude values
        const smoothedAmplitudes = new Array(bufferLength).fill(0);

        const draw = () => {
          if (ctx && analyser.current && dataArray.current) {
            const WIDTH = canvas.width;
            const HEIGHT = canvas.height;

            analyser.current.getByteFrequencyData(dataArray.current);

            // Apply smoothing to amplitude values
            for (let i = 0; i < bufferLength; i++) {
              smoothedAmplitudes[i] =
                0.9 * smoothedAmplitudes[i] + 0.1 * dataArray.current[i];
            }

            const maxAmplitude = Math.max(...smoothedAmplitudes);
            const centerLine = HEIGHT / 2;
            const barWidth = 2;

            ctx.fillStyle = 'rgb(243, 244, 246)';
            ctx.fillRect(0, 0, WIDTH, HEIGHT);

            for (let i = 0; i < bufferLength; i++) {
              const amplitude = smoothedAmplitudes[i];
              const barHeight = ((amplitude / maxAmplitude) * HEIGHT) / 2 || 1;

              ctx.fillStyle = 'rgb(249, 115, 22)';
              ctx.fillRect(
                WIDTH / 2 + i * (barWidth + 1),
                centerLine - barHeight / 2,
                barWidth,
                barHeight
              );
              ctx.fillRect(
                WIDTH / 2 - (i + 1) * (barWidth + 1),
                centerLine - barHeight / 2,
                barWidth,
                barHeight
              );
            }

            // Shift the canvas to the left
            ctx.drawImage(canvas, -1, 0, WIDTH, HEIGHT, 0, 0, WIDTH, HEIGHT);

            // Clear the rightmost column
            ctx.clearRect(WIDTH - 1, 0, 1, HEIGHT);
          }
          requestAnimationFrame(draw);
        };

        draw();
      }
    }
  }, [mediaRecorder]);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning) {
      interval = setInterval(() => {
        setSeconds((prevSeconds) => {
          if (prevSeconds === 59) {
            setMinutes((prevMinutes) => prevMinutes + 1);
            return 0;
          }
          return prevSeconds + 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isRunning]);

  const handleRecordClick = () => {
    if (!isRunning) {
      setTitle(formatDate(new Date()));
      startRecording();
    } else if (isRunning) {
      setTitle('Generating transcription...');
      stopRecording();
    }
  };

  const renderStartStopRecordingButton = () => (
    <button
      onClick={handleRecordClick}
      className={`flex items-center px-6 py-4 mx-auto border border-gray-300 hover:border-orange-500 rounded-full`}
    >
      <span
        className={`block rounded-full bg-${isRunning ? 'error-50 bg-orange-500' : 'orange-500 border-white'} mr-2 border-[1px]`}
      >
        <span
          className={`block w-3 h-3 m-3 ${!isRunning && 'rounded-full'} bg-white`}
        ></span>
      </span>
      <span className="text-2xl">
        {isRunning ? 'Stop recording' : 'Record a note'}
      </span>
    </button>
  );

  if (!isRunning && !isProcessing) {
    return (
      <div className="h-dvh flex flex-col items-center justify-center -mt-36">
        {renderStartStopRecordingButton()}
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto">
      <div className="text-5xxl font-400  text-center mt-32">
        {minutes < 10 ? `0${minutes}` : minutes}:
        {seconds < 10 ? `0${seconds}` : seconds}
      </div>
      <p className="text-base font-normal text-center mx-auto mt-4">{title}</p>
      {!isProcessing && (
        <canvas
          ref={canvasRef}
          height={40}
          className="my-4 w-80 mx-auto"
        ></canvas>
      )}
      {!isProcessing && renderStartStopRecordingButton()}
    </div>
  );
};

export default Recorder;
