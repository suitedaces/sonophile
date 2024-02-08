import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { getSong, getSongFeatures } from '../spotifyApi';
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';


const Song = () => {
  const { id } = useParams();
  const [features, setFeatures] = useState([0, 0, 0, 0, 0, 0, 0]);
  const [song, setSong] = useState(null);

  const featuresData = [
    { name: 'Danceability', value: features.danceability * 100, description: 'Danceability describes how suitable a track is for dancing.' },
    { name: 'Acousticness', value: features.acousticness * 100, description: 'High value represents high confidence that the track is acoustic.' },
    { name: 'Energy', value: features.energy * 100, description: 'Energy represents a perceptual measure of intensity and activity. Typically, energetic tracks feel fast, loud, and noisy.' },
    { name: 'Instrumentalness', value: features.instrumentalness * 100, description: 'Predicts whether a track contains no vocals. 

  useEffect(() => {
    window.scrollTo(0,0)
    getSong(id).then(res => setSong(res.data));
    getSongFeatures(id).then(res => setFeatures(res.data));
  }, [id]);

  return (
    <div className="pt-20">
      {song && features ?
        <div>
          <div className='flex items-center'>
            <div className='w-full'>
              
			<iframe 
				style={{ borderRadius: '12px' }}
				src={`https://open.spotify.com/embed/track/${id}`}
				width="100%" 
				height="352" 
				frameBorder="0" 
				allowFullScreen 
				allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
				loading="lazy">
			</iframe>
			</div>
          </div>
          <div className="graph mt-16 w-full">
            <h3 className='text-2xl heading mb-8'>Track Features</h3>
            <div>
              <ResponsiveContainer width="100%" height={400}>
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={featuresData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="name" />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} />
                  <Radar name="Features" dataKey="value" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                  <Tooltip 
                    cursor={{ fill: 'rgba(255, 255, 255, 0.2)' }} 
                    wrapperStyle={{ backgroundColor: '#6C5B7B', borderRadius: '5px' }}
                    labelStyle={{ color: '#F67280' }}
                    itemStyle={{ color: '#C06C84' }}
                  />
                  <Legend />
                </RadarChart>
              </ResponsiveContainer>
            </div>
            <div className='mt-16 '>
              <h3 className='mb-10 text-5xl heading font-bold'>Features Description</h3>
              {featuresData.map(feature =>
                <div className=' mb-6' key={feature.name}>
                  <h3 className='text-gray-300'>{feature.name}</h3>
                  <p className='text-gray-600'>{feature.description}</p>
                </div>
              )}
            </div>
          </div>
        </div>
        :
        <div className='loader' />
      }
    </div>
);

}


export default Song;
