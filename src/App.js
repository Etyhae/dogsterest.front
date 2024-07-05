import './App.css';
import { Box, CircularProgress } from '@mui/material';
import { useGetSomeDogsQuery } from './services/dogs';
import { useState, useEffect, useCallback } from 'react';

function App() {
  const [dogImagesList, setDogImagesList] = useState([]);
  const [count, setCount] = useState(24);
  const { data, error, isLoading } = useGetSomeDogsQuery(count);

  useEffect(() => {
    if (data) {
      setDogImagesList(prevList => [...prevList, ...data]);
    }
  }, [data]);

  const debounce = useCallback((callback, delay = 500) => {
    let timer = null;
    return (...args) => {
      if (timer) {
        clearTimeout(timer);
      }
      timer = setTimeout(() => {
        callback(...args);
      }, delay);
    };
  }, []);

  const handleScrollToBottom = useCallback((e) => {
    const bottom = e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight;
    console.log(bottom, isLoading);
    if (bottom && !isLoading) {
      setCount(prevCount => prevCount === 12 ? 9 : 12)
    }
  }, [setCount, isLoading])

  const debouncedHandleScroll = debounce(handleScrollToBottom);

  return (
    <div className="App">
      <main style={{ maxWidth: '100vw' }}>
        <Box
          style={{ height: '100vh', overflowY: 'auto' }}
          onScroll={debouncedHandleScroll}
        >
          <div className='masonry'>
            {error ? (
              <>Oh no, there was an error</>
            ) : isLoading ? (
              <div style={{ position: 'absolute', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', width: '100%', zIndex: '9999' }}>
                <CircularProgress />
              </div>
            ) : dogImagesList ? (
              dogImagesList.map((item, index) => (
                <div key={index} className='masonry__block'>
                  <img
                    srcSet={`${item.url}?w=248&fit=crop&auto=format&dpr=2 2x`}
                    src={`${item.url}?w=248&fit=crop&auto=format`}
                    alt={''}
                    loading="lazy"
                    className='img-rounded '
                  />
                </div>
              ))
            ) : null}
          </div>
        </Box>
      </main>
    </div>
  );
}

export default App;
