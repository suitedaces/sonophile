const API_URL = import.meta.env.VITE_API_URL;

export const LoginContent = () => {

  return (
    <div className="h-screen w-screen flex items-center bg-center bg-cover">
      <div className="splash__container w-full mx-8 z-10 sm:mx-12 md:mx-24 xl:mx-auto">
        <div className="md:grid md:grid-cols-2 md:gap-12">
          <div className="md:self-center">
            <span className="mb-3 ml-5 text-7xl tracking-tight md:text-8xl md:mb-8 font-bold font-sans text-gray-100 ">
            <p>            
              <span className="text-outline">
              Sono
            </span>
              <span className="text-black">phile 👨🏽‍🎤</span> 
            </p>

            </span>
            <div className="flex my-8 md:my-12">
              <a
                href={`/api/login`}
                className="ml-12 center bg-green-500 hover:bg-green-700 text-gray-100 font-bold py-4 px-8 rounded-full font-sans shadow-md border-1 border-black shadow-lg z-100 relative">
                Login with Spotify
              </a>
            </div>
          </div>
          <div>
            <p className="mr-5 text-2xl leading-normal font-bold md:text-7xl lg:text-7xl font-sans text-gray-800" style={{
              // WebkitTextFillColor: '#1ED760',
              WebkitTextStrokeWidth: '0.5px',
              WebkitTextStrokeColor: '#191414',
              letterSpacing: '1.5px'
            }}>
              Your <span className="text-outline">Spotify</span> wrapped and <span className="text-outline">mood-based recommendations</span>, all year-round. 🎶
            </p>
          </div>
        </div>
        <p className="text-xs mt-12 md:text-sm md:w-1/2 ml-3">
          Sonophile is not officially connected with © Spotify AB in any way.
        </p>
      </div>
    </div>
  );
}

export default LoginContent;