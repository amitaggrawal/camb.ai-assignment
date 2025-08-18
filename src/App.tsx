import React, {useCallback, useRef, useState} from 'react';
import MultiTrack, {
  type TrackOptions,
} from 'wavesurfer-multitrack';
import {useHotkey} from './hooks/useHotKey';
import DragAndDrop from './components/DragNDrop/DragNDrop';
import {ControlPanel, DEFAULT_ZOOM} from './components/ControlPanel/ControlPanel';
import styles from './App.module.css'

const DEFAULT_MULTITRACK_OPTIONS = {
  cursorWidth: 2,
  cursorColor: '#D72F21',
  trackBackground: '#2D2D2D',
  trackBorderColor: '#7C7C7C',
  dragBounds: true,
  envelopeOptions: {
    lineColor: 'rgba(255, 0, 0, 0.7)',
    lineWidth: '4',
    dragPointSize: window.innerWidth < 600 ? 20 : 10,
    dragPointFill: 'rgba(255, 255, 255, 0.8)',
    dragPointStroke: 'rgba(255, 255, 255, 0.3)',
  },
  timelineOptions: {
    height: 20,
    style: {
      color: 'white',
    },
  },
};



function App() {
  const [audioTracks, setAudioTracks] = useState<TrackOptions[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [zoom, setZoom] = useState(DEFAULT_ZOOM);
  const tracksContainerRef = useRef<HTMLDivElement>(null);
  const multitrack = useRef<MultiTrack | null>(null);
  const inputRef = useRef<{click: () => void}>(null);


  const loadTracks = useCallback(
    (newTracks: TrackOptions[]) => {
      if (!tracksContainerRef.current) {
        return;
      }
      if (multitrack.current) {
        multitrack.current.destroy();
      }
      multitrack.current = MultiTrack.create([...audioTracks, ...newTracks], {
        ...DEFAULT_MULTITRACK_OPTIONS,
        container: tracksContainerRef.current,
        minPxPerSec: zoom,
      });
      setAudioTracks((prevTracks) => [...prevTracks, ...newTracks]);
    },
    [audioTracks, zoom],
  );

  const playPauseHandler = useCallback(() => {
    if (audioTracks.length > 0 && multitrack.current?.isPlaying()) {
      multitrack.current?.pause();
      setIsPlaying(false);
    } else {
      multitrack.current?.play();
      setIsPlaying(true);
    }
  }, [audioTracks.length]);

  const zoomHandler = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      if (multitrack.current) {
        multitrack.current.zoom(Number(event.target.value));
        setZoom(Number(event.target.value));
      }
    },
    [],
  );

  const volumeHandler = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      if (multitrack.current) {
        audioTracks.forEach((_, index) => {
          multitrack.current!.setTrackVolume(
            index,
            Number(event.target.value) / 100,
          );
        });
      }
    },
    [audioTracks],
  );

  const addTrackHandler = () => {
   inputRef.current?.click() 
  }

  useHotkey('Space', playPauseHandler);
  useHotkey('Enter', playPauseHandler);

  return (
    <DragAndDrop
      ref={inputRef}
      loadTracks={loadTracks}>
      <div className={styles.container}>
        <header className={styles.header}>
          iAudio
        </header>
        <div style={{width: '100%'}}>
        {audioTracks.length >0 && (
          <ControlPanel
          volumeHandler={volumeHandler}
          zoomHandler={zoomHandler}
          playPauseHandler={playPauseHandler}
          isPlaying={isPlaying}
          tracksLoaded={audioTracks.length > 0}
          />
        )}
        </div>
      </div>
      {audioTracks.length === 0 && (
        <div
        className={styles.uploadPrompt}
        onClick={addTrackHandler}>
          <h1 className={styles.uploadPromptText}>Drop your audio files</h1>
          <h4 className={styles.uploadPromptText}>or</h4>
          <h1 className={styles.uploadPromptText}>Click here to upload audio</h1>
          <h2 className={styles.uploadPromptText}>
            Supported formats: mp3, wav, ogg, flac
          </h2>
        </div>
      )}

      <div className='flex flex-col gap-4 w-full md:w-11/12 bg-black bg-opacity-50 overflow-scroll rounded-md m-4'>
        <div className='flex gap-4 relative no-scrollbar h-fit' ref={tracksContainerRef}>
        {/* To be used by wavesurfer library for displaying waves of uploaded audio files */}
        </div>
      </div>

      {audioTracks.length > 0 && (
        <div
          className={styles.addMoreTracksBtn}
          onClick={addTrackHandler}>
          Add more tracks
        </div>
      )}
    </DragAndDrop>
  );
}



export default App;
