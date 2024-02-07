import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { getSong, getSongFeatures } from '../spotifyApi';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip, Legend } from 'recharts';


const Song = () => {
  const { id } = useParams();
  const [features, setFeatures] = useState([0, 0, 0, 0, 0, 0, 0]);
  const [song, setSong] = useState(null);

  const featuresData = [
    // ... existing featuresData array ...
  ];

  const COLORS = [
    // ... existing COLORS array ...
];

  useEffect(() => {
    // ... existing useEffect ...
  }, [id]);

  return (
    <div className="pt-20">
      {song && features ?
        <div>
          // ... existing code ...
          <div className="graph mt-16 w-full">
            <h3 className='text-2xl heading mb-8'>Track Features</h3>
            <div>
              <ResponsiveContainer width="100%" height={400}>
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={featuresData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="name" />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} />
                  <Tooltip 
                    cursor={{ fill: 'rgba(255, 255, 255, 0.2)' }} 
                    wrapperStyle={{ backgroundColor: '#6C5B7B', borderRadius: '5px' }}
                    labelStyle={{ color: '#F67280' }}
                    itemStyle={{ color: '#C06C84' }}
                  />
                  <Legend />
                  <Radar name="Features" dataKey="value" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
            // ... existing code ...
          </div>
        </div>
        :
        <div className='loader' />
      }
    </div>
);

}


export default Song;
