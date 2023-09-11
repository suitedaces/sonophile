import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { getSong, getSongFeatures } from './spotify';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, Cell } from 'recharts';


const Song = () => {
  const { id } = useParams();
  const [features, setFeatures] = useState([0, 0, 0, 0, 0, 0, 0]);
  const [song, setSong] = useState(null);

  const featuresData = [
    { name: 'Danceability', value: features.danceability * 100, description: 'Danceability describes how suitable a track is for dancing.' },
    { name: 'Acousticness', value: features.acousticness * 100, description: 'High value represents high confidence that the track is acoustic.' },
    { name: 'Energy', value: features.energy * 100, description: 'Energy represents a perceptual measure of intensity and activity. Typically, energetic tracks feel fast, loud, and noisy.' },
    { name: 'Instrumentalness', value: features.instrumentalness * 100, description: 'Predicts whether a track contains no vocals. “Ooh” and “aah” sounds are treated as instrumental in this context. Rap or spoken word tracks are clearly “vocal”. High value represents the greater likelihood the track contains no vocal content.' },
    { name: 'Liveness', value: features.liveness * 100, description: 'Detects the presence of an audience in the recording. Higher liveness values represent an increased probability that the track was performed live.' },
    { name: 'Valence', value: features.valence * 100, description: 'A measure of the musical positiveness conveyed by a track. Tracks with high valence sound more positive (e.g. happy, cheerful, euphoric), while tracks with low valence sound more negative (e.g. sad, depressed, angry).' },
    { name: 'Speechiness', value: features.speechiness * 100, description: 'Speechiness detects the presence of spoken words in a track. The more exclusively speech-like the recording (e.g. talk show, audio book, poetry), the higher the attribute value.' }
  ];

  const COLORS = [
    '#F8B195',
    '#F67280',
    '#C06C84',
    '#6C5B7B',
    '#355C7D',
    '#99B898',
    '#FECEAB'
];


  useEffect(() => {

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
                <BarChart data={featuresData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip 
                    cursor={{ fill: 'rgba(255, 255, 255, 0.2)' }} 
                    wrapperStyle={{ backgroundColor: '#6C5B7B', borderRadius: '5px' }}
                    labelStyle={{ color: '#F67280' }}
                    itemStyle={{ color: '#C06C84' }}
                  />
                  <Legend />
                  <Bar dataKey="value" barSize={150}>
                    {featuresData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index]} />
                    ))}
                  </Bar>
                </BarChart>
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
