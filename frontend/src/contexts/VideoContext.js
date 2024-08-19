import { createContext, useState } from 'react';

export const VideoContext = createContext();

export function VideoProvider({ children }) {
    const [isMuted, setIsMuted] = useState(true);
    const [volume, setVolume] = useState(1);

    return (
        <VideoContext.Provider
            value={{
                isMuted,
                setIsMuted,
                volume,
                setVolume,
            }}
        >
            {children}
        </VideoContext.Provider>
    );
}
