import axios from 'axios';

export const cleaner = (arr) => {
	const array = arr.map(solo => solo.name)
	return array.join(', ')
}


export const genreCleaner = (arr) => {
	const capped = arr.map(gen => gen[0].toUpperCase()+gen.slice(1))
	return capped.slice(0, 3).join(', ')
}


export const convertMS = ( milliseconds ) => {
  const minutes = Math.floor(milliseconds / 60000);
  const seconds = ((milliseconds % 60000) / 1000).toFixed(0);
  return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
}

export const simplifyDate = (date) => {
	return date.split('T')[0]
}