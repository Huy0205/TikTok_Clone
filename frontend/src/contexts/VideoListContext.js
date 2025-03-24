import { createContext, useCallback, useRef, useState } from 'react';

export const VideoListContext = createContext();

export function VideoListProvider({ children }) {
    const [videoList, setVideoList] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [scrollPosition, setScrollPosition] = useState(0);

    const loadedPages = useRef(new Set());

    const resetVideoListContext = useCallback(() => {
        setVideoList([]);
        setPage(1);
        setHasMore(true);
        setScrollPosition(0);
        loadedPages.current.clear();
    }, []);

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
                resetVideoListContext,
            }}
        >
            {children}
        </VideoListContext.Provider>
    );
}
