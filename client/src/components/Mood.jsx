
import { useState } from 'react'
import { getRecommendations } from '../spotifyApi'


const Mood = () => {
	const moods = [
		{title: 'Happy', emoji: '😄'},
		{title: 'Sad', emoji: '😢'},
		{title: 'Hype', emoji: '🕺🏽'},
		{title: 'Chill', emoji: '🧘🏽‍♂️'}
	];
	const allGenres = ['Alt-Rock', 'Hip-Hop', 'Indie', 'Pop', 'EDM', 'R&B', 'K-Pop', 'Latin', 'Country', 'Metal', 'Electronic'];
	
	const [genre, setGenre] = useState(null);
	const [mood, setMood] = useState(null);
	const [rex, setRex] = useState(null);

	// bugfix
	const transformGenre = (genre) => {
		if (genre === "R&B") {
		  return "r-n-b";
		}
		return genre.toLowerCase();
	  };
	
	const setParams = (m) => {
		let q;
		switch(m) {
			case 'Happy':
				q = 'minValence=0.8';
				break;
			case 'Sad':
				q = 'maxValence=0.3&maxEnergy=0.4';
				break;
			case 'Hype':
				q = 'minEnergy=0.7&minValence=0.7&minDanceability=0.5';
				break;
			case 'Chill':
				q = 'maxEnergy=0.3&minValence=0.3';
				break;
			default:
				console.log('Hmmm.. not sure what happened here.');
		}
		setMood({mood: m, features: q});
	}

	const go = () => {
		const transformedGenre = transformGenre(genre);
		getRecommendations(transformedGenre.toLowerCase(), mood.features)
			.then(res => {
				setRex(res.data)
				setTimeout(() => {
					window.scrollBy({top: 300, behavior: 'smooth'})
				}, 300);
			})
	}


	return (
		<div className='py-12'>
			<h2 className='mb-10 text-3xl heading font-bold'>🔍 Search by Mood</h2>

			<div className="my-8">
				<h2 className="heading mb-3 font-bold">Select Mood</h2>
				<div className='grid grid-cols-2 md:grid-cols-4 gap-3'>
					{moods.map(m => 
						<div className={`${mood?.mood===m.title ? 'bg-green-500' : 'bg-gray-900'} h-20 rounded-full flex items-center justify-center text-xl cursor-pointer hover:text-spotify shadow-lg transform transition-transform duration-200 hover:-translate-y-1`} key={m.title} onClick={() => setParams(m.title)}>
							<h2>{m.emoji}</h2>
							&nbsp;
							<h2>{m.title}</h2>
						</div>	
						)}
				</div>
			</div>

			<div className="my-12">
				<h2 className="heading mb-3 font-bold">Select Genre</h2>
				<div className="grid grid-cols-3 gap-3 md:grid-cols-4" >
					{allGenres.map(g => 
						<h2 className={`${genre===g ? 'bg-green-500' : 'bg-gray-900'} p-3 rounded-full cursor-pointer hover:text-spotify shadow-lg transform transition-transform duration-200 hover:-translate-y-1 text-center`} key={g} onClick={() => setGenre(g)}>
							{g}
						</h2>)}
				</div>
			</div>

			<button className='text-center px-10 py-4 rounded-full overflow-shadow bg-green-500 hover:bg-green-900' onClick={go}>Search</button>

			{rex ?
				<div className='mt-20' >
					<h2 className='mb-10 text-3xl heading font-bold'>Here are some songs you might like...</h2>
					{rex.tracks.map(song => 
						<div className='flex items-start pb-5' key={song.id || song.name}>
							<iframe 
								style={{ borderRadius: '12px' }}
								src={`https://open.spotify.com/embed/track/${song.id}`}
								width="100%" 
								height="152" 
								frameBorder="0" 
								allowFullScreen 
								allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
								loading="lazy">
							</iframe>
						</div>
					)}

				</div>
				:
				<div className='loading'/>
			}
		</div>
	)
}

export default Mood

