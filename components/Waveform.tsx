import React, { useEffect, useRef } from 'react';

interface Props {
  isProcessing: boolean;
  mediaRecorder: MediaRecorder | null;
}

export const Waveform = ({ isProcessing, mediaRecorder }: Props) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioContext = useRef<AudioContext | null>(null);
  const analyser = useRef<AnalyserNode | null>(null);
  const dataArray = useRef<Uint8Array | null>(null);

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

            ctx.clearRect(0, 0, WIDTH, HEIGHT);

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

  return (
    !isProcessing && (
      <canvas
        ref={canvasRef}
        height={40}
        className="my-4 w-80 mx-auto"
      ></canvas>
    )
  );
};
