import { Link } from 'react-router-dom'
import { useQuery } from 'react-query'

import { convertMS } from '../helper'
import { ArtistCard, SongCard, TrackItem } from '../components/Items'
import { FadeLoader } from 'react-spinners'
import { getUser, getUsersTop9Artists, getFollowing, getUsersTop5Tracks, getPlaylists, getRecentlyPlayed, logOut } from '../spotifyApi'
import { useEffect } from 'react'


const getUserData = async() => 	{
	
	const user = await getUser()	
	const topArtists =  await getUsersTop9Artists()
	const topTracks =  await getUsersTop5Tracks()
	const following = await getFollowing()
	const playlists = await getPlaylists()
	const recentlyPlayed = await getRecentlyPlayed()

	return Promise.all([user, topArtists, topTracks, following, playlists, recentlyPlayed])
}

const Home = () => {

	const {data} = useQuery("basics", getUserData)

	useQuery("basics", getUserData)

	if(data === undefined) {
		return (
			<div className="flex justify-center items-center h-screen">
				<FadeLoader color="#1DB954" />
			</div>)
	}

	if(data[0]?.status !== 200){
		logOut()
	}
	if(data[0]?.status === 401) {

	}

	return (
		<>	
			{data ? 
				<main className='flex flex-col py-8 md:pb-12'>
				
					{/* Hero */}
					<div className='py-10'>
						<h1 className='text-center text-3xl sm:text-4xl lg:text-4xl mr-5'>
							<span className='text-gray-400'>Howdy </span>
							<span className='bg-gradient-to-r from-green-300 via-blue-500 to-purple-600 text-transparent bg-clip-text'>{data[0].data.display_name.split(' ')[0].concat('!')}</span>
							<span>&nbsp;👋</span>
						</h1>
					</div>
					
					{/* Fave Artists */}
					
					<div className='mt-10 md:mt-24'>
							<h2 className='mb-10 text-3xl heading font-bold'>Artists you ❤️ the most..</h2>
						<div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-x-4 gap-y-2">
							{data[1].data.items.map((artist, index) => 
								<Link to={`artist/${artist.id}`} key={artist.id}>
									<ArtistCard index={index + 1} imageURL={artist.images[1].url} itemName={artist.name} key={artist.name}/>
								</Link>
							)}
							<Link to='/artist' className='pt-2 bg-gradient-to-b from-gray-900 to-black mr-3 md:mr-6 mt-4 w-36 md:w-40 h-44 flex justify-center items-center text-gray-200 rounded'>
								<h2 className=' hover:text-green-400'>See More</h2>
							</Link>
						</div>
					</div>
					
					{/* Fave Tracks */}
					
					<div className='mt-10 md:mt-20'>
							<h2 className='mb-10 text-3xl heading font-bold'>Your all-time favorite jams..</h2>
						<div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-x-8  gap-y-2">
							{data[2].data.items.map((track, index) => 
								<Link to={`track/${track.id}`} key={track.id}>
									<SongCard index={index+1} imageURL={track.album.images[1].url} itemName={track.name} subItem={track.artists} key={track.name}/>
								</Link>
							)}
							<Link to='/track'  className='pt-2 bg-gradient-to-b from-gray-900 to-black mr-3 md:mr-6 mt-4 w-36 md:w-40 h-44 flex justify-center items-center text-gray-200 rounded'>
								<h2 className="hover:text-green-400">See More</h2>
							</Link>
						</div>
					</div>
					
					
					{/* Recently Played */}
					<div className='mt-10 md:mt-20 w-full'>
						<h2 className='mb-10 text-3xl heading font-bold '>Your recently played tracks..</h2>
						<div className='mt-1 w-full'>
							<div className="flex justify-between w-full mb-4 tracking-wider text-sm border-gray-800 sticky top-0 pt-8 bg-black border-bottom">
								<div className='w-6/12 lg:w-7/12 text-left'>SONG</div>
								<div className='w-4/12 hidden lg:block text-left'>ALBUM</div>
								<div className='w-2/12 text-right lg:text-left'>DURATION</div>
							</div>
							{data[5].data.items.map(song => 
								<div className="flex justify-between w-full object-contain text-gray-400 pb-4 hover:translate-x-4 transition-transform duration-300 transform" key={song.played_at}>
									<div className="w-6/12 lg:w-7/12 truncate">
										<Link to={`/track/${song.track.id}`}>
											<TrackItem songName={song.track.name} songArtists={song.track.artists} songAlbum={song.track.album.name} picURL={song.track.album.images[1].url}/>
										</Link>
									</div>
									<div className='w-4/12 hidden lg:block pr-4'>{song.track.album.name}</div>
									<div className='w-2/12 text-right lg:text-left'>{convertMS(song.track.duration_ms)}</div>
								</div>
							)}
						</div>
					</div>

				</main>
				: 
				<div className="flex justify-center items-center h-screen transform -translate-y-12 mb-20">
					<FadeLoader color="#1DB954" />
				</div>	
				}
		</>
	)
} 


export default Home