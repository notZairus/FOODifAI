import { useState, useEffect, useRef } from "react";
import RecipeGenerator from "./Components/RecipeGenerator.jsx";

function App() {

  const [result, setResult] = useState(null);

  return (
    <>
      <div className="w-screen min-h-screen py-8 px-9 font-mmo bg-zinc-800 flex flex-col items-center">

        <div className="max-w-[400px] mx-auto border border-white/15 p-8 rounded-lg">
          <h1 className="text-white text-5xl text-center tracking-normal">FOODifAI</h1>
  
          <div className="w-full bg-black/15 mt-8 rounded-full flex items-center tracking-wider">
            <div className="h-14 flex-1 text-white/90 justify-center items-center flex  bg-lime-700 rounded-full">Recipe Generator</div>
            <div className="h-14 flex-1 text-white/90 justify-center items-center flex rounded-full">Food Analysis</div>
          </div>
  
          <main>
    
            <section>
              <RecipeGenerator />
            </section>
  
            <section className="text-justify bg-lime-700 shadow-md rounded-lg mt-12 mb-12 text-white/90 p-4">
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
                    <li>list2</li>
                    <li>list2</li>
                    <li>list2</li>
                    <li>list2</li>
                    <li>list2</li>
                    <li>list2</li>
                    <li>list2</li>
                    <li>list2</li>
                    <li>list2</li>
                    <li>list2</li>
                    <li>list2</li>
                    <li>list2</li>
                  </ul>
                </div>
              </div>
            </section>
  
          </main> 

        </div>

      </div>
    </>
  )
}

export default App
