import React, { useState, useEffect } from 'react';
import axios from 'axios'
import { Oval } from 'react-loader-spinner';
import Pagination from './Pagination';
function Movies() {
    const [movies, setMovies] = useState([])
    const [page, setPage] = useState(1)
    const [hover, setHover] = useState('')
    const [favourites, setFavourites] = useState([]);
    const [movieSearch,setMovieSearch] = useState("");
    let filteredMovies = [];
    const handleInfiniteScroll = () => {
        try {
            let scrlHeight = document.documentElement.scrollHeight;
            let wndwHgt = window.innerHeight;
            let scrlTop = document.documentElement.scrollTop;
            if (wndwHgt + scrlTop + 1 >= scrlHeight) {
                setPage(page => page + 1);
            }
        } catch (err) {
            window.alert(err.message);
        }
    }

    useEffect(() => {
        window.addEventListener("scroll", handleInfiniteScroll);
        return () => window.removeEventListener("scroll");
    }, [])

    const handleMoviesSearch = (e) => {
        setMovieSearch(() => e.target.value);
    }

    useEffect(function () {
        // everytime when page reloads
        let oldFav = localStorage.getItem("imdb");
        oldFav = JSON.parse(oldFav) || [];
        console.log(oldFav);
        // setFavourites(oldFav);
        // data manga 
        axios.get(`https://api.themoviedb.org/3/trending/movie/week?api_key=0ea5f4d2b4f64f4b2385585535727b81&page=${page}`).then((res) => {
            console.table(res.data.results)
            setMovies((movies) => [...movies, ...res.data.results]);
            
        })
    }, [page]);

    
    let add = (movie) => {
        let newArray = [...favourites, movie]
        setFavourites([...newArray])
        localStorage.setItem("imdb", JSON.stringify(newArray))
    }

    let del = (movie) => {
        let newArray = favourites.filter((m) => m.id !== movie.id)
        setFavourites([...newArray])
        localStorage.setItem("imdb", JSON.stringify(newArray))
    }
    filteredMovies = [...movies];
    if(movieSearch.length > 0) {
        filteredMovies = filteredMovies.filter(movie => movie.title.toLowerCase().indexOf(movieSearch.toLowerCase()) !== -1);
    }
    return <>
        <div className="mb-8 text-center">
            <div className="flex items-center  justify-center gap-x-2 mt-8 mb-8 font-bold text-2xl text-center">
                <div>Trending Movies</div>
                <div>
                    <input onChange = {(e) => setMovieSearch(e.target.value)} type = "text" placeholder = "Search" className='text-xl font-normal h-12 border-2 border-sky-800 p-2 rounded'/>
                </div>
            </div>
            {
                filteredMovies.length === 0 ?
                    <div className='flex justify-center'>
                        <Oval
                            heigth="100"
                            width="100"
                            color='grey'
                            secondaryColor='grey'
                            ariaLabel='loading'
                        />
                    </div> :
                    
                    <div className="flex flex-wrap justify-center">
                        {
                            filteredMovies.map((movie) => (
                                <div className={`
                                    bg-[url(https://image.tmdb.org/t/p/w500/${movie.backdrop_path})] 
                                    md:h-[30vh] md:w-[250px] 
                                    h-[25vh] w-[150px]
                                    bg-center bg-cover
                                    rounded-xl
                                    flex items-end
                                    m-4
                                    hover:scale-110
                                    ease-out duration-300
                                    relative
                                `}
                                    onMouseEnter={() => {
                                        setHover(movie.id)
                                    }}

                                    onMouseLeave={() =>
                                        setHover("")}
                                >
                                    {
                                        hover === movie.id && <>{
                                            !favourites.find((m) => m.id === movie.id) ?
                                                <div className='absolute top-2 right-2
                                    p-2
                                    bg-gray-800
                                    rounded-xl
                                    text-xl
                                    cursor-pointer
                                    '
                                                    onClick={() => add(movie)}
                                                >😍</div> :
                                                <div className='absolute top-2 right-2
                                    p-2
                                    bg-gray-800
                                    rounded-xl
                                    text-xl
                                    cursor-pointer
                                    '
                                                    onClick={() => del(movie)}
                                                >❌</div>

                                        }
                                        </>
                                    }

                                    <div className="w-full bg-gray-900 text-white py-2 font-bold text-center rounded-b-xl">{movie.title} </div>
                                </div>
                            ))
                        }

                    </div>
            }
        </div>
    </>
}

export default Movies;