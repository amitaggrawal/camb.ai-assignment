import {useEffect} from 'react';

export const useHotkey = (key: string[], callback: () => void) => {
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (key.includes(event.code)) {
        event.preventDefault();
        callback();
      }
    };
    document.addEventListener('keydown', handleKeyPress);
    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [callback, key]);
};
