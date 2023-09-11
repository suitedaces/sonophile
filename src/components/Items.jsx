import PropTypes from 'prop-types';
import { cleaner } from '../helper';




export const ArtistCard = ({index, imageURL, itemName}) => {
    return (
        <div className='relative bg-card pb-1.5 mr-3 md:mr-6 mt-4 w-36 md:w-40 shadow-lg hover:shadow-2xl transition-transform duration-300 transform hover:scale-110 flex flex-col items-center justify-center'>
            <div className='w-40 h-40 rounded-full overflow-hidden mb-2 shadow-inner relative'>
                <img src={imageURL} alt="" className='object-cover w-full h-full transition-opacity duration-300 hover:opacity-100'/>
				<div className="absolute top-0 left-0 w-full h-full flex items-center justify-center text-4xl font-bold border border-black p-1 opacity-0 hover:opacity-100 transition-opacity duration-300">
					{index}
				</div>
            </div>
            <h3 className='text-center w-32 truncate'>{itemName}</h3>
        </div>
    )
}

export const SongCard = ({index, imageURL, subItem, itemName}) => {
	return (
		<div className='bg-card pb-1.5 mr-3 md:mr-6 mt-4 w-40 md:w-44 shadow-2xl rounded-sm transition-transform duration-200 transform hover:scale-105'>
			<div className='px-4'>
				<div className='image pt-4 relative'>
					<img src={imageURL} alt="" className='w-40 h-40 object-cover'/> {/* Increased size to w-40 h-40 */}
					<div className="absolute top-0 left-0 w-full h-full flex items-center justify-center text-4xl font-bold text-white border border-black p-1 opacity-0 hover:opacity-100 transition-opacity duration-300">
						{index}
					</div>
				</div>
				<div className='w-40'> {/* Adjusted width to match image width */}
					<h3 className='mt-1 text-gray-100 truncate' >{itemName}</h3>
					<div className='text-sm text-gray-500 mb-2'>
						{Array.isArray(subItem) ? 
							<h3 className='truncate'>{cleaner(subItem)}</h3> 
							: 
							<h3 className='truncate'>{subItem}</h3>}
					</div>
				</div>
			</div>
		</div>
	)
}

export const TrackItem = ({songName, songArtists, picURL}) => {
	return (
		<div className='w-full flex items-start mb-7 pr-8 truncate overflow-hidden'>
			<div className='hidden sm:block sm:w-12 sm:h-12 overflow-hidden rounded-full'>
				<img src={picURL} alt="track" className='object-cover'/>
			</div>
			<div className='ml-4 truncate'>
				<h4 className='text-gray-400 hover:text-white truncate' >{songName}</h4>
					{Array.isArray(songArtists) && songArtists ?
						<h3 className='text-sm text-gray-700 truncate'>{cleaner(songArtists)}</h3>
						:
						<h3 className='text-sm text-gray-700 truncate' >{songArtists}</h3>
					}
				
			</div>
		</div>

	)
}

ArtistCard.propTypes = {
	index: PropTypes.number.isNotRequired,
	imageURL: PropTypes.string.isRequired,
	itemName: PropTypes.string.isRequired,
  };
  
SongCard.propTypes = {
	index: PropTypes.number.isNotRequired,
	imageURL: PropTypes.string.isRequired,
	subItem: PropTypes.oneOfType([
		PropTypes.string,
		PropTypes.arrayOf(PropTypes.object),
	]).isRequired,
	itemName: PropTypes.string.isRequired,
  };
  
  TrackItem.propTypes = {
	songName: PropTypes.string.isRequired,
	songArtists: PropTypes.oneOfType([
		PropTypes.string,
		PropTypes.arrayOf(PropTypes.object),
	]).isRequired,
	picURL: PropTypes.string.isRequired,
  };

