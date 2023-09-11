import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getUsersTopArtists, getUsersTopArtistsSinceWeeks, getUsersTopArtistsSinceAnYear } from '../components/spotify';
import { ArtistCard } from '../components/Items';
import { FadeLoader } from 'react-spinners';

const TopArtists = () => {
    const [artists, setArtists] = useState(null);
    const [activeTab, setActiveTab] = useState('4 Weeks');  // Default to '6 Months'

    useEffect(() => {
        getUsersTopArtists().then(res => setArtists(res.data.items));
    }, []);

    const bringWeeks = () => {
        setActiveTab('4 Weeks');
        getUsersTopArtistsSinceWeeks().then(res => setArtists(res.data.items));
    }

    const bringMonths = () => {
        setActiveTab('6 Months');
        getUsersTopArtists().then(res => setArtists(res.data.items));
    }

    const bringYear = () => {
        setActiveTab('Over an Year');
        getUsersTopArtistsSinceAnYear().then(res => setArtists(res.data.items));
    }

    return (
        <div className='py-12 md:py-28'>
            <div className='flex justify-center space-x-4'>
                <h2 
                    className={`w-32 text-center rounded-full shadow-md p-2 text-sm md:text-base cursor-pointer hover:text-green-400 ${activeTab === '4 Weeks' ? 'bg-gray-800 text-green-400' : 'bg-gray-1000'}`}
                    onClick={bringWeeks}
                >
                    4 Weeks
                </h2>
                <h2 
                    className={`w-32 text-center rounded-full shadow-md p-2 text-sm md:text-base cursor-pointer hover:text-green-400 ${activeTab === '6 Months' ? 'bg-gray-800 text-green-400' : 'bg-gray-1000'}`}
                    onClick={bringMonths}
                >
                    6 Months
                </h2>
                <h2 
                    className={`w-32  text-center rounded-full shadow-md p-2 text-sm md:text-base cursor-pointer hover:text-green-400 ${activeTab === 'Over an Year' ? 'bg-gray-800 text-green-400' : 'bg-gray-1000'}`}
                    onClick={bringYear}
                >
                    All Time
                </h2>
            </div>

            {artists ? (
                <div className='mt-12'>
                    <h3 className="text-2xl heading font-bold">⚡️ Your favorite artists</h3>
                    <div className='grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-5'>
                        {artists.map((artist, index) => (
                            <Link to={`/artist/${artist.id}`} key={artist.id}>
                                <ArtistCard index={index + 1} imageURL={artist.images[2].url} itemName={artist.name} />
                            </Link>
                        ))}
                    </div>
                </div>
            ) : (
				<div className="flex justify-center items-center h-full pt-40"> {/* <-- This is the new container div */}
					<FadeLoader color="#1DB954" />
				</div>
            )}
        </div>
    );
}

export default TopArtists;
