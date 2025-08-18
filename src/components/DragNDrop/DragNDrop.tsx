import React, {useState,forwardRef, useRef,useImperativeHandle} from 'react';
import {useDropzone} from 'react-dropzone';
import type { TrackOptions } from 'wavesurfer-multitrack';
import styles from './style.module.css';

type DragAndDropProps = {
  loadTracks: (newTracks: TrackOptions[]) => void;
  children: React.ReactNode;

};
type InputHandle = {
  click: () => void;
}
const DragAndDrop = forwardRef<InputHandle, DragAndDropProps>(
  ({ loadTracks, children }, ref) => {
    const [isDragActive, setIsDragActive] = useState(false);
    const [isDropRejected, setIsDropRejected] = useState(false);

    const inputRef = useRef<HTMLInputElement | null>(null);

    const { getRootProps, getInputProps } = useDropzone({
      accept: { "audio/*": [] },
      noClick: true, //required so that intraction with waves via mouse (re-arraging audio etc) does not open file selector
      noKeyboard: true, //required so that intraction with waves via keyboard does not open file selector.
      onDropAccepted(acceptedFiles) {
        const newTracks = acceptedFiles.map((file) => {
          const track: TrackOptions = {
            id: `${file.name}-${Date.now()}`,
            url: URL.createObjectURL(file),
            startPosition: 0,
            draggable: true,
            options: {
              waveColor: "hsl(161, 87%, 49%)",
              progressColor: "hsl(161, 87%, 20%)",
              height: 100,
              normalize: true,
            },
          };
          return track;
        });
        loadTracks(newTracks);
        setIsDragActive(false);
      },
      onDragEnter: () => setIsDragActive(true),
      onDragLeave: () => setIsDragActive(false),
      onDropRejected: () => {
        setIsDragActive(false);
        setIsDropRejected(true);
        setTimeout(() => setIsDropRejected(false), 1000);
      },
    });

    // Expose methods/DOM to parent
    useImperativeHandle(ref, () => ({
      click: () => inputRef.current?.click(),      
    }));

    console.log('amit, input props', getInputProps())

    return (
      <div className={styles.container} {...getRootProps()}>
        {isDragActive && <h1>Drop your audio files here</h1>}
        {isDropRejected && (
          <div style={{backgroundColor:'red'}}>
            <h2>Only audio files are allowed</h2>
          </div>
        )}
        <input {...getInputProps()} ref={inputRef} />
        {children}
      </div>
    );
  }
);

export default DragAndDrop;