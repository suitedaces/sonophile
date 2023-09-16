import { useState, useEffect } from 'react'
import { SongCard } from '../components/Items'
import { Link } from 'react-router-dom'
import { FadeLoader } from 'react-spinners'
import { getUsersTopTracks, getUsersTopTracksSinceWeeks, getUsersTopTracksSinceAYear } from '../spotifyApi'

const TopTracks = () => {

	const [activeTab, setActiveTab] = useState('4 Weeks');
	const [tracks, setTracks] = useState(null)

	useEffect(() => {
		window.scrollTo(0, 0)
		getUsersTopTracksSinceWeeks().then(res =>setTracks(res.data.items))		

	}, [])

	const bringWeeks = () => {
        setActiveTab('4 Weeks');
		getUsersTopTracksSinceWeeks().then(res => setTracks(res.data.items))		
	}

	const bringMonths = () => {
        setActiveTab('6 Months');
		getUsersTopTracks().then(res => setTracks(res.data.items))		
	}

	const bringYear = () => {
        setActiveTab('All Time');
		getUsersTopTracksSinceAYear().then(res => setTracks(res.data.items))		
	}

	return (
		<div className='py-12  md:py-28 '>
            <div className='flex justify-center space-x-4'>
                <h2 
                    className={`w-32 text-center rounded-full shadow-md p-2 text-sm md:text-base cursor-pointer hover:text-green-400 ${activeTab === '4 Weeks' ? 'bg-gray-800 text-green-400': 'bg-gray-1000'}`}
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
                    className={`w-32  text-center rounded-full shadow-md p-2 text-sm md:text-base cursor-pointer hover:text-green-400 ${activeTab === 'All Time' ? 'bg-gray-800 text-green-400': 'bg-gray-1000'}`}
                    onClick={bringYear}
                >
                    All Time
                </h2>
            </div>

			{tracks ?
				<div className='mt-12'>
					<h3 className="text-2xl heading font-bold">⚡️ Your favorite songs</h3>
					<div className='grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-5'>
						{tracks.map((track, index) => 
							<Link to={`/track/${track.id}`} key={track.id}>
								<SongCard index={index+1} imageURL={track.album.images[1].url} itemName={track.name} subItem={track.artists}/>
							</Link>
						)}
					</div>
				</div>
				:
				<div className="flex justify-center items-center h-full pt-40"> {/* <-- This is the new container div */}
					<FadeLoader color="#1DB954" />
				</div>
			}
		</div>
	)
}

export default TopTracks