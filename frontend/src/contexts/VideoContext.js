import { createContext, useState } from 'react';

export const VideoContext = createContext();

export function VideoProvider({ children }) {
    const [isMuted, setIsMuted] = useState(true);

    return (
        <VideoContext.Provider
            value={{
                isMuted,
                setIsMuted,
            }}
        >
            {children}
        </VideoContext.Provider>
    );
}
