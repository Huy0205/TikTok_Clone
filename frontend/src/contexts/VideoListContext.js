import { createContext, useRef, useState } from 'react';

export const VideoListContext = createContext();

export function VideoListProvider({ children }) {
    const [videoList, setVideoList] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [scrollPosition, setScrollPosition] = useState(0);

    const loadedPages = useRef(new Set());

    return (
        <VideoListContext.Provider
            value={{
                videoList,
                setVideoList,
                page,
                setPage,
                hasMore,
                setHasMore,
                scrollPosition,
                setScrollPosition,
                loadedPages,
            }}
        >
            {children}
        </VideoListContext.Provider>
    );
}
