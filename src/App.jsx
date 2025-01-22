import { useState, useEffect, useRef } from "react";
import RecipeGenerator from "./Components/RecipeGenerator.jsx";

function App() {

  const [result, setResult] = useState(null);
  const resultRef = useRef(null);

  console.log(result);

  useEffect(() => {
    if (!result) return;
    resultRef.current.scrollIntoView({behavior: 'smooth'});
  }, [result])

  return (
    <>
      <div className="lg:w-[480px] mx-auto w-screen min-h-screen py-8 px-9 font-mmo bg-white flex flex-col items-center">
        <h1 className="text-accent text-5xl text-center tracking-normal">FOODifAI</h1>

        <div className="w-full bg-accent/10 mt-8 rounded-full flex items-center tracking-wider">
          <div className="h-14 flex-1 text-white/90 justify-center items-center flex  bg-accent rounded-full">Recipe Generator</div>
          <div className="h-14 flex-1 text-black/20 justify-center items-center flex rounded-full">Food Analysis</div>
        </div>

        <main>
  
          <section className="mb-12">
            <RecipeGenerator setResult={setResult}/>
          </section>

          {result && <section className="text-justify bg-accent shadow-md rounded-lg mb-12 text-white/90 p-4">
            <h1 className="text-3xl" ref={resultRef}>{result.name}</h1>
            
            <div>
              <div className="mt-4 space-y-4">

                {result.ai_message && <div>
                  <p className="text-xl">AI: {result.ai_message}</p>
                </div>}
                
                <div>
                  <h2 className="text-xl">Ingredients</h2>
                  <ul className="tracking-wider list-disc list-inside">
                    {
                      result.ingredients.map(ingredient => (
                        <li>{ingredient}</li>
                      ))
                    }
                  </ul>
                </div>
  
                <div>
                  <h2 className="text-xl">Steps</h2>
                  <ul className="tracking-wider list-decimal list-inside">
                  {
                      result.steps.map(step => (
                        <li>{step}</li>
                      ))
                    }
                  </ul>
                </div>

                <div>
                  <h2 className="text-xl">Nutrients per 100g</h2>
                  <ul className="tracking-wider list-disc list-inside">
                  {
                      result.nutrients_per_100g.map(nutrient => (
                        <li>{nutrient}</li>
                      ))
                    }
                  </ul>
                </div>
              </div>
            </div>

          </section>}

        </main> 

      </div>
    </>
  )
}

export default App
