import React, {useCallback, useRef, useState} from 'react';
import MultiTrack, {
  type TrackOptions,
} from 'wavesurfer-multitrack';
import {useHotkey} from './hooks/useHotKey';
import DragAndDrop from './components/DragNDrop/DragNDrop';
import {ControlPanel, DEFAULT_ZOOM} from './components/ControlPanel/ControlPanel';
import styles from './App.module.css'

// New types for per-track state management
interface TrackState {
  id: string;
  volume: number;
  isMuted: boolean;
  trackOptions: TrackOptions;
}

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
  // Replace the simple audioTracks array with detailed track state
  const [trackStates, setTrackStates] = useState<TrackState[]>([]);
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
      multitrack.current = MultiTrack.create([...trackStates.map(ts => ts.trackOptions), ...newTracks], {
        ...DEFAULT_MULTITRACK_OPTIONS,
        container: tracksContainerRef.current,
        minPxPerSec: zoom,
      });
      
      // Reset playing state when tracks are reloaded
      setIsPlaying(false);
      
      setTrackStates((prevTracks) => [...prevTracks, ...newTracks.map(track => ({
        id: String(track.id || Date.now()),
        volume: 1,
        isMuted: false,
        trackOptions: track,
      }))]);
    },
    [trackStates, zoom],
  );

  const playPauseHandler = useCallback(() => {
    if (trackStates.length > 0 && multitrack.current?.isPlaying()) {
      multitrack.current?.pause();
      setIsPlaying(false);
    } else {
      multitrack.current?.play();
      setIsPlaying(true);
    }
  }, [trackStates.length]);

  const zoomHandler = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const newZoom = Number(event.target.value);
      setZoom(newZoom);
      if (multitrack.current) {
        multitrack.current.zoom(newZoom);
      }
    },
    [],
  );

  // New per-track control functions
  const setTrackVolume = useCallback((trackId: string, volume: number) => {
    if (multitrack.current) {
      const trackIndex = trackStates.findIndex(ts => ts.id === trackId);
      if (trackIndex !== -1) {
        multitrack.current.setTrackVolume(trackIndex, volume);
        setTrackStates(prev => prev.map(ts => 
          ts.id === trackId ? { ...ts, volume } : ts
        ));
      }
    }
  }, [trackStates]);

  const toggleTrackMute = useCallback((trackId: string) => {
    if (multitrack.current) {
      const trackIndex = trackStates.findIndex(ts => ts.id === trackId);
      if (trackIndex !== -1) {
        setTrackStates(prev => prev.map(ts => 
          ts.id === trackId ? { ...ts, isMuted: !ts.isMuted } : ts
        ));
        
        // Mute/unmute the track
        const track = trackStates.find(ts => ts.id === trackId);
        if (track) {
          multitrack.current.setTrackVolume(trackIndex, track.isMuted ? track.volume : 0);
        }
      }
    }
  }, [trackStates]);


  const addTrackHandler = () => {
   inputRef.current?.click() 
  }

  useHotkey(['Space','Enter'], playPauseHandler);

  return (
    <DragAndDrop
      ref={inputRef}
      loadTracks={loadTracks}>
      <div className={styles.container}>
        <header className={styles.header}>
          iAudio
        </header>
        <div style={{width: '100%'}}>
        {trackStates.length >0 && (
          <ControlPanel
          playPauseHandler={playPauseHandler}
          zoomHandler={zoomHandler}
          isPlaying={isPlaying}
          tracksLoaded={trackStates.length > 0}
          currentZoom={zoom}
          trackStates={trackStates}
          onTrackVolumeChange={setTrackVolume}
          onTrackMuteToggle={toggleTrackMute}
          showPerTrackControls={true}
          />
        )}
        </div>
      </div>
      {trackStates.length === 0 && (
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

      <div className={styles.trackWrapper}>
        <div className={`${styles.tracks} ${styles.noScrollbar}`} ref={tracksContainerRef}>
        {/* To be used by wavesurfer library for displaying waves of uploaded audio files */}
        </div>
      </div>

      {trackStates.length > 0 && (
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
