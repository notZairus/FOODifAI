import { useState, useEffect, useRef, lazy, Suspense } from "react";

const RecipeGenerator = lazy(() => import("./Components/RecipeGenerator.jsx"))
const FoodAnalysis = lazy(() => import("./Components/FoodAnalysis.jsx"))

function App() {

  const [mode, setMode] = useState("RecipeGenerator");
  const [result, setResult] = useState(null);
  const resultRef = useRef(null);
  
  console.log(result);

  useEffect(() => {
    if (!result) return;
    if (resultRef.current != null) {
      resultRef.current.scrollIntoView({behavior: 'smooth'});
    }
  }, [result])


  return (
    <div className="relative lg:w-[480px] bg-accent/5 mx-auto w-screen min-h-screen py-8 px-9 font-mmo flex flex-col items-center">
      <h1 className="text-accent text-5xl text-center tracking-normal">FOODifAI</h1>

      <div className="w-full h-12 bg-accent/15 mt-8 rounded-full flex items-center tracking-wider text-lg">
        <button 
          onClick={() => {setMode('RecipeGenerator')}} 
          className={
            mode == 'RecipeGenerator' 
            ? 'h-full flex-1 transition-all duration-300 text-white/90 justify-center items-center flex  bg-accent rounded-l-full'
            : 'h-full flex-1 transition-all duration-200 text-black/20 justify-center items-center flex rounded-full'
          }
          >
            Generate Recipe
        </button>
        <button 
          onClick={() => {setMode('FoodAnalysis')}} 
          className={
            mode == 'FoodAnalysis' 
            ? 'h-full flex-1 transition-all duration-300 text-white/90 justify-center items-center flex  bg-accent rounded-r-full'
            : 'h-full flex-1 transition-all duration-200 text-black/20 justify-center items-center flex rounded-full'
          }
          >
            Analyze Food
        </button>
      </div>

      <main>

        <section className="mb-12">
          <Suspense>
            { 
              mode == "RecipeGenerator" 
                ? <RecipeGenerator setResult={setResult}/>
                : <FoodAnalysis setResult={setResult}/>
            }
          </Suspense>
          
        </section>

        {result && (
          result.is_ingredient ? (
            <section className="text-justify bg-accent shadow-md rounded-lg mb-12 text-white/90 p-4">
              <h1 className="text-3xl" ref={resultRef}>{result.name}</h1>
              <div>
                <div className="mt-4 space-y-4">
                  {result.ai_message &&<div>
                    <p className="text-xl">{result.ai_message || result.ai}</p>
                  </div>}
                  <div>
                    <h2 className="text-xl">Ingredients</h2>
                    <ul className="tracking-wider list-disc list-inside ml-4">
                      {
                        result.ingredients.map(ingredient => (
                          <li>{ingredient}</li>
                        ))
                      }
                    </ul>
                  </div>
                  <div>
                    <h2 className="text-xl">Steps</h2>
                    <ul className="tracking-wider list-decimal list-inside ml-4">
                    {
                        result.steps.map(step => (
                          <li>{step}</li>
                        ))
                      }
                    </ul>
                  </div>
                  <div>
                    <h2 className="text-xl">Nutrients per 100g</h2>
                    <ul className="tracking-wider list-disc list-inside ml-4">
                    {
                        result.nutrients_per_100g.map(nutrient => (
                          <li>{nutrient}</li>
                        ))
                      }
                    </ul>
                  </div>
                </div>
              </div>
            </section>
          ) : result.there_is_a_food && result.image_is_intelligible ? (
            <section className="text-justify bg-accent shadow-md rounded-lg mb-12 text-white/90 p-4">
              <h1 className="text-3xl" ref={resultRef}>{result.name_of_food} ({result.is_healthy ? 'Healthy' : 'Unhealthy'})</h1>
              <div>
                <div className="mt-4 space-y-4">
                  {result.ai_message && <div>
                    <p className="text-xl">{result.ai_message || result.ai}</p>
                  </div>}

                  <div>
                    <h2 className="text-xl">Calorie Count</h2>
                    <p className="ml-4">{result.total_calorie}</p>
                  </div>
                  
                  <div>
                    <h2 className="text-xl">Nutrients</h2>
                    <ul className="tracking-wider list-disc list-inside ml-4">
                      {
                        result.nutrients.map(nutrient => (
                          <li>{nutrient.name}: {nutrient.amount}</li>
                        ))
                      }
                    </ul>
                  </div>

                </div>
              </div>
            </section>
          ) : (
            <section className="text-justify bg-accent shadow-md rounded-lg mb-12 text-white/90 p-4">
              <div>
                <div className="space-y-4">
                  {result.ai_message && <div>
                    <p className="text-xl">{result.ai_message || result.ai}</p>
                  </div>}
                </div>
              </div>
            </section>
          )
        )}
        
      </main> 
      <footer className="text-white bg-accent absolute bottom-0 w-full text-center py-2">Developer: Zairus V. Bermillo</footer>
    </div>
  )
}

export default App
