import React from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {
  faMagnifyingGlass,
  faPause,
  faPlay,
  faVolumeHigh,
  faVolumeMute,
} from '@fortawesome/free-solid-svg-icons';
import styles from './style.module.css'

export const DEFAULT_ZOOM = 10;

// Track state interface for per-track controls
interface TrackState {
  id: string;
  volume: number;
  isMuted: boolean;
  trackOptions: any; // TrackOptions from wavesurfer-multitrack
}

type ControlPanelProps = {
  // Global controls
  playPauseHandler: () => void;
  zoomHandler: (event: React.ChangeEvent<HTMLInputElement>) => void;
  tracksLoaded: boolean;
  isPlaying: boolean;
  currentZoom: number;
  
  // Per-track controls (optional)
  trackStates?: TrackState[];
  onTrackVolumeChange?: (trackId: string, volume: number) => void;
  onTrackMuteToggle?: (trackId: string) => void;
  showPerTrackControls?: boolean;
};

export const ControlPanel = ({
  playPauseHandler,
  zoomHandler,
  isPlaying,
  tracksLoaded,
  currentZoom,
  trackStates = [],
  onTrackVolumeChange,
  onTrackMuteToggle,
  showPerTrackControls = false,
}: ControlPanelProps) => {
  return (
    <div className={`${styles.container} ${tracksLoaded ? "visibleState" : "hiddenState"}`}>
      {/* Per-Track Controls */}
      {showPerTrackControls && trackStates.length > 0 && (
        <div className={styles.perTrackControls}>
          <div className={styles.perTrackHeader}>
            <h4 className={styles.perTrackTitle}>Individual Track Controls</h4>
            <div className={styles.headerControls}>
              <div className={styles.zoomControl}>
                <FontAwesomeIcon icon={faMagnifyingGlass} size="sm" />
                <input
                  type="range"
                  value={currentZoom}
                  min="5"
                  max="100"
                  onChange={zoomHandler}
                  className={styles.zoomSlider}
                  title={`Zoom: ${currentZoom}`}
                />
              </div>
              <button
                onClick={playPauseHandler}
                className={styles.controlButton}>
                {isPlaying ? (
                  <FontAwesomeIcon icon={faPause} size="lg" />
                ) : (
                  <FontAwesomeIcon icon={faPlay} size="lg" />
                )}
              </button>
            </div>
          </div>
          {trackStates.map((trackState) => (
            <div key={trackState.id} className={styles.trackControl}>
              <div className={styles.trackInfo}>
                <span className={styles.trackName}>
                  {String(trackState.trackOptions.id || 'Untitled Track')}
                </span>
              </div>
              
              <div className={styles.trackControls}>
                <div className={styles.trackVolumeControl}>
                  <button
                    onClick={() => onTrackMuteToggle?.(trackState.id)}
                    className={styles.trackMuteButton}
                    title={trackState.isMuted ? 'Unmute' : 'Mute'}
                  >
                    <FontAwesomeIcon 
                      icon={trackState.isMuted ? faVolumeMute : faVolumeHigh} 
                      size="sm" 
                    />
                  </button>
                  
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={trackState.isMuted ? 0 : Math.round(trackState.volume * 100)}
                    onChange={(e) => onTrackVolumeChange?.(trackState.id, Number(e.target.value) / 100)}
                    className={styles.trackVolumeSlider}
                    title={`Volume: ${Math.round(trackState.volume * 100)}%`}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
