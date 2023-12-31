import { useParams, Link } from 'react-router-dom'
import { getAnAlbum, getAnAlbumsTracks } from '../spotifyApi'
import { TrackItem } from '../components/Items'
import { useState, useEffect } from 'react'
import { convertMS, cleaner } from '../helper'
import { FadeLoader } from 'react-spinners'


const Album = () => {
	const {artistId, albumId} = useParams()

	const [tracks, setTracks] = useState(null)
	const [basics, setBasics] = useState(null)

	useEffect(() => 
	{
		window.scrollTo(0, 0)
		getAnAlbum(albumId)
		.then(res => {setBasics(res.data)})
		.catch(error => console.error("Error fetching album:", error));
	getAnAlbumsTracks(albumId)
		.then(res => setTracks(res.data))
		.catch(error => console.error("Error fetching album tracks:", error));
	}, [albumId])

	return (
		<div>
			{tracks && basics ?
				<div>
					<div className='w-full mt-8'>
						<div className='flex items-start'>
							<div className='w-2/12'>
								<img src={basics.images[1].url} alt="" className='object-cover w-full'/>
							</div>
							<div className='ml-4 w-9/12'>
								<h2 className='text-white text-lg lg:text-4xl'>{basics.name}</h2>
								<h2 className='text-gray-700 text-sm'>
									{basics.release_date.split('-')[0]} ⋄  
									<span> {cleaner(basics.artists)}</span>
								</h2>
							</div>
						</div>

						<div className='flex text-gray-700 mb-6 text-left sticky top-0 pt-8 text-sm bg-black border-bottom'>
							<h3 className='w-10/12'>TRACK</h3>
							<h3 className='w-1/12'>DURATION</h3>
						</div>

						{tracks.items.map(track => 
							<Link to={`/track/${track.id}`} key={track.id}>
								<div className='text-gray-500 flex'>
									<div className='w-10/12 truncate hover:translate-x-4 transition-transform duration-300 transform'>
										<TrackItem songName={track.name} picURL={basics.images[2].url} songArtists={track.artists}/>
									</div>
									<div className='w-1/12'>{convertMS(track.duration_ms)}</div>
								</div>
							</Link>
						)}
					</div>
				</div>
			: 
			<div className="flex justify-center items-center h-screen">
				<FadeLoader color="#1DB954" />
			</div>
		}
		</div>
	)
}

export default Album