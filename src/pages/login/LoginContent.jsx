export const LoginContent = () => {

  return (
    <div className="h-screen w-screen flex items-center bg-center bg-cover">
      <div className="splash__container w-full mx-8 z-10 sm:mx-12 md:mx-24 xl:mx-auto">
        <div className="md:grid md:grid-cols-2 md:gap-12">
          <div className="md:self-center">
            <p className="mb-3 ml-3 text-7xl border-2 tracking-tight md:text-8xl md:mb-8 border-yellow-600 font-bold font-sans">
            Spotistics 🤓
            </p>
            <div className="flex my-8 md:my-12">
              <a
                href={"http://localhost:8888/login"}
                className="ml-12 center bg-green-500 hover:bg-green-700 text-white font-bold py-4 px-8 rounded-full font-sans">
                Launch App
              </a>
            </div>
          </div>
          <div>
            <p className="mr-5 text-2xl leading-normal font-bold md:text-7xl lg:text-8xl font-sans" style={{
              WebkitTextFillColor: '#1ED760',
              WebkitTextStrokeWidth: '1.5px',
              WebkitTextStrokeColor: '#191414',
              letterSpacing: '3px'
            }}>
              Your <span className="stroke-font">Spotify</span> wrapped, all year-round. 🎶
            </p>
          </div>
        </div>
        <p className="text-xs mt-12 md:text-sm md:w-1/2 ml-3">
          Spotistics is not officially connected with © Spotify AB in any way.
        </p>
      </div>
    </div>
  );
}

export default LoginContent;