import CameraIcon from "./assets/icons/camera.svg";


function App() {


  return (
    <>
      <main className="w-screen min-h-screen py-8 px-9 font-mmo bg-zinc-800 flex flex-col items-center">

        <h1 className="text-white text-5xl text-center tracking-normal">FOODifAI</h1>

        <div className="w-full bg-black/15 mt-8 rounded-full flex items-center tracking-wider">
          <div className="h-14 flex-1 text-white/90 justify-center items-center flex  bg-lime-700 rounded-full">Recipe Generator</div>
          <div className="h-14 flex-1 text-white/90 justify-center items-center flex rounded-full">Food Analysis</div>
        </div>

        <section>
          <div className="aspect-square w-full">
            <video 
              className="w-full h-full bg-red-400 mt-8 rounded-lg overflow-hidden"
              playsInline
              autoPlay
            >
            </video>
          </div>
          <div className="flex items-center justify-center mt-8">
            <button className="aspect-square w-16  bg-lime-700 rounded-full flex items-center justify-center">
              <img src={CameraIcon} alt="camera"  className="w-4/6"/>
            </button>
          </div>

          <div className="w-full h-96 text-justify bg-lime-700 shadow-md rounded-lg mt-12 mb-12 text-white/90 p-4">
            <h1 className="text-3xl">Result</h1>
            <div className="mt-4 space-y-4">
              
              <div>
                <h2 className="text-xl">Ingredients</h2>
                <ul className="tracking-wider">
                  <li>list1 sadasds </li>
                  <li>list2</li>
                </ul>
              </div>

              <div>
                <h2 className="text-xl">Steps</h2>
                <ul className="tracking-wider">
                  <li>list1 sadasds </li>
                  <li>list2</li>
                </ul>
              </div>
            </div>
          </div>
        </section> 

      </main>
    </>
  )
}

export default App
