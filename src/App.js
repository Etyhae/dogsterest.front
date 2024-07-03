import './App.css';
import { ImageList, ImageListItem } from '@mui/material';
import { useGetRandomDogQuery } from './services/dogs';

function App() {

  const { data, error, isLoading } = useGetRandomDogQuery()
  return (
    <div className="App">
      <main style={{ maxWidth: '100vw' }}>

        <ImageList variant="masonry" cols={3} gap={8}>
          {error ? (
            <>Oh no, there was an error</>
          ) : isLoading ? (
            <>Loading...</>
          ) : data ? (
            <ImageListItem key={data.fileSizeBytes}>
              <img
                srcSet={`${data.url}?w=248&fit=crop&auto=format&dpr=2 2x`}
                src={`${data.url}?w=248&fit=crop&auto=format`}
                alt={''}
                loading="lazy"
                className='img-rounded'
              />
            </ImageListItem>
          ) : null}
        </ImageList>
      </main>
    </div >
  );
}

export default App;
