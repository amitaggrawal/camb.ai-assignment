import React from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {
  faMagnifyingGlass,
  faPause,
  faPlay,
  faVolumeHigh,
} from '@fortawesome/free-solid-svg-icons';
import styles from './style.module.css'

export const DEFAULT_ZOOM = 10;

type ControlPanelProps = {
  zoomHandler: (event: React.ChangeEvent<HTMLInputElement>) => void;
  volumeHandler: (event: React.ChangeEvent<HTMLInputElement>) => void;
  playPauseHandler: () => void;
  tracksLoaded: boolean;
  isPlaying: boolean;
};
export const ControlPanel = ({
  volumeHandler,
  zoomHandler,
  playPauseHandler,
  isPlaying,
  tracksLoaded,
}: ControlPanelProps) => {
  return (
    <div className={`${styles.container} ${tracksLoaded ? "visibleState" : "hiddenState"}`}>
      <div className={styles.utilityControls}>
        <div className={styles.controlItem}>
          <FontAwesomeIcon icon={faVolumeHigh} size="lg" />
          <input
            type="range"
            defaultValue={'50'}
            min="0"
            max="100"
            onInput={volumeHandler}
          />
        </div>
        <div className={styles.controlItem}>
          <FontAwesomeIcon icon={faMagnifyingGlass} size="lg" />
          <input
            type="range"
            defaultValue={`${DEFAULT_ZOOM}`}
            min="5"
            max="100"
            onInput={zoomHandler}
          />
        </div>
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
  );
};
