import banner from "../assets/banner.png"
function Home() {
  return (
    <div className="select-none">
      <div className="w-full h-auto object-cover fixed top-0 left-0 right-0 -z-1 mt-17 md:mt-0">
        <img
          src={banner}
          className="md:blur-xs hue-rotate-15 shadow-2xl"
          alt="Home"
        />
      </div>
      <div className="absolute inset-0 flex items-center">
        <div className="ml-1 mt-15 ">
          <h1 className="text-6xl md:text-8xl md:text-blue-100 text-shadow-lg/30 font-semibold ">
            Heart Disease Predictor
          </h1>
          <h1 className="mt-2 text-2xl self-start text-gray-600 md:text-gray-200 drop-shadow-md">
            Use the navigation to go to prediction or upload dataset.
          </h1>
        </div>
      </div>
    </div>
  );
}
export default Home;
