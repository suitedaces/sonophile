import Home from './pages/Home';
import Artist from './pages/Artist';
import TopArtists from './pages/TopArtists';
import Song from './components/Track';
import TopTracks from './pages/TopTracks';
import Search from './pages/Search';
import Mood from './components/Mood';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import Login from './pages/Login';
import Album from './pages/Album';
import { accessToken } from './spotifyApi';
import { useState, useEffect } from 'react';
import Header from './components/Header';
import Navbar from './components/Navbar';

const queryClient = new QueryClient();

function App() {
    const [token, setToken] = useState(null);

    useEffect(() => {
        setToken(accessToken)
    }, []);

    return (
        <div className="overflow-x-hidden bg-black">
            {token ? (
                <BrowserRouter>
                    <Header />
                    <Navbar />
                    <QueryClientProvider client={queryClient}>
                        <div className="px-8 lg:ml-48 lg:px-20 lg:py-6 text-gray-100 min-h-screen">
                            <Routes>
                                <Route path="/" element={<Home />} />
                                <Route path="/artist/:id" element={<Artist />} />
                                <Route path="/artist/:id/album/:albumId" element={<Album />} />
                                <Route path="/artist" element={<TopArtists />} />
                                <Route path="/track/:id" element={<Song />} />
                                <Route path="/track" element={<TopTracks />} />
                                <Route path="/search" element={<Search />} />
                                <Route path="/mood" element={<Mood />} />
                            </Routes>
                        </div>
                    </QueryClientProvider>
                </BrowserRouter>
            ) : (
                <div>
                    <Login />
                </div>
            )}
            <footer className="bg-transparent ml-20 bottom-0 left-0 w-full text-center py-2">
                <span className="text-gray-100">Built with ❤️ 4 all the 
                    <span className="text-green-400"> dawgz</span> by 
                    <a target="blank" href="https://twitter.com/ishanxnagpal" className='bg-gradient-to-r from-green-300 via-blue-500 to-purple-600 text-transparent bg-clip-text text-lg'> Ishan Nagpal</a>
                </span>
            </footer>
        </div>
    );
}

export default App;
