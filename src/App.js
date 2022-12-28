import axios from 'axios';
import { useEffect, useState } from 'react';
import './App.css';

import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: '#282828',
  color: '#fff',
  p: 4,
};

function App() {
  const API_URL = 'https://api.themoviedb.org/3';
  const API_KEY = '45857599b87e4e8d1a1db3b90b958b90';
  
  const [movies, setMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [page, setPage] = useState(2);

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [movie, setMovie] = useState ([]);

  const getGenres = async() => {
    const res = await axios.get(`${API_URL}/genre/movie/list`, 
    {params:{
      api_key: API_KEY,
    }});
    setGenres(res.data.genres);
    console.log(res.data.genres)
  }

  const firstFetch = async() => {
    const results = await axios.get(`${API_URL}/discover/movie?api_key${API_KEY}&page=1`, 
    {params:{
      api_key: API_KEY,
    }});
    setMovies(results.data.results);
  }

  const fetchMovies = async() => {
    const results = await axios.get(`${API_URL}/discover/movie?api_key${API_KEY}&page=${page}`, 
    {params:{
      api_key: API_KEY,
    }});
    setMovies(movies.concat(results.data.results))




  }

  useEffect(()=>{
    firstFetch();
    getGenres();
  },[]);

  


  const onScroll = () => {
    console.log( (document.body.scrollHeight - window.innerHeight ))
    if (document.body.scrollHeight - window.innerHeight < window.scrollY + 2) {

      setPage(page+1);
      console.log('estoy en el final del scroll')
      console.log('pagina: '+page)
      fetchMovies()
     }
   }
   

   const selectMovie = (m) => {
    console.log(m);
    setMovie(m);
    handleOpen()
   }

   window.addEventListener('scroll', onScroll);


  return (
    <div className="App">
      <div className='App-header'>
        <div className='container'>
          <div className='row'>
            {movies.map((m)=> (
              <div key={m.id} className='col-3' onClick={()=> selectMovie(m)}>
                <img src={`https://image.tmdb.org/t/p/w500${m.poster_path}`} height={400} width="100%"></img>
                <h5>{m.title}</h5>

              </div>
            ))}
          </div>
        </div>
      </div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} height="100%" width="100%"></img>
          <Typography id="modal-modal-title" variant="h4" component="h2">
            {movie.title}
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            <strong>Genres: </strong>
            {movie.genre_ids? movie.genre_ids.map(m=> (
            <span> {genres?.find(g=>g.id === m).name}, 
            </span>
            )):''}
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            <strong>Year: </strong>
            <span>{movie?.release_date?.slice(0,4)}</span>
            
          </Typography>
        </Box>
      </Modal>
    </div>
  );
}

export default App;
