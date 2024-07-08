import './App.css';
import { Box, CircularProgress, ToggleButton, ToggleButtonGroup, ImageList, ImageListItem } from '@mui/material';
import { useGetSomeDogsQuery } from './services/dogs';
import { useState, useEffect, useCallback } from 'react';
import { FavoriteBorderOutlined, HomeOutlined } from '@mui/icons-material';

function App() {
  const [dogImagesList, setDogImagesList] = useState([]);
  const [count, setCount] = useState(24);
  const { data, error, isLoading } = useGetSomeDogsQuery(count);
  const [currentView, setCurrentView] = useState('feed');
  const pastLikes = JSON.parse(localStorage.getItem('likedPosts')) || [];
  const [likedPosts, setLikedPosts] = useState(pastLikes);

  useEffect(() => {
    if (data) {
      setDogImagesList(prevList => [...prevList, ...data]);
    }
  }, [data]);

  useEffect(() => {
    if (likedPosts.length > 0) {
      localStorage.setItem('likedPosts', JSON.stringify(likedPosts));
    }
  }, [likedPosts]);

  const handleLike = (e) => {
    const url = e.target.getAttribute('data-source');
    setLikedPosts(prevLiked => (prevLiked.includes(url) ? prevLiked : [...prevLiked, url]));
  };

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
      <main style={{ maxWidth: '100vw', overflowY: 'visible' }}>
        <Box display="flex"
          alignItems="center" justifyContent={'center'} sx={{ height: '5rem', width: '100%' }}>
          <ToggleButtonGroup sx={{ color: '#FFFFFF' }}
            value={currentView} exclusive onChange={() => (currentView === 'feed' ? setCurrentView('liked') : setCurrentView('feed'))} aria-label='show liked'>
            <ToggleButton color='success' sx={{ color: 'gray' }} value={'feed'}>
              <HomeOutlined />
            </ToggleButton>
            <ToggleButton color='success' sx={{ color: 'gray' }} value={'liked'}>
              <FavoriteBorderOutlined />
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>
        <Box
          style={{ width: '80vw', margin: '0 auto', height: '100%', overflowY: 'auto', textAlign: 'center', position: 'relative' }}
          onScroll={debouncedHandleScroll}
        >
          {isLoading && (
            <div style={{ position: 'absolute', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', width: '100%', zIndex: '9999', backgroundColor: 'rgba(255, 255, 255, 0.8)' }}>
              <CircularProgress />
            </div>
          )}
          <ImageList variant="masonry" cols={3} gap={8}>
            {error ? (
              <>Oh no, there was an error</>
            ) : (
              currentView === 'feed' ? (
                dogImagesList.map((item) => (
                  <ImageListItem key={item.url}>
                    <img
                      srcSet={`${item.url}?w=248&fit=crop&auto=format&dpr=2 2x`}
                      src={`${item.url}?w=248&fit=crop&auto=format`}
                      alt={''}
                      data-source={item.url}
                      loading="lazy"
                      className='img-rounded'
                      onClick={handleLike}
                    />
                  </ImageListItem>
                ))
              ) : likedPosts.length > 0 ? (
                likedPosts.map((item, index) => (
                  <ImageListItem key={index}>
                    <img
                      srcSet={`${item}?w=248&fit=crop&auto=format&dpr=2 2x`}
                      src={`${item}?w=248&fit=crop&auto=format`}
                      alt={''}
                      loading="lazy"
                      className='img-rounded '
                    />
                  </ImageListItem>
                ))
              ) : (
                <ImageListItem cols={3}>
                  <p>Вы еще не выбрали то, что вам нравится</p>
                </ImageListItem>
              )
            )}
          </ImageList>
        </Box>
      </main>
    </div>
  );
}

export default App;
