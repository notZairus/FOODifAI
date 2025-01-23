import CameraIcon from "../assets/icons/camera.svg";
import { useState, useEffect, useRef } from "react";
import { urlToImg, postToServer } from "../js/functions.js";
import { scanImageUrl, generateRecipe } from "../js/ai.js";
import { nanoid } from "nanoid";
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';




export default function RecipeGenerator({ setResult }) {
  const [images, setImages] = useState([]);
  const [ingredients, setIngredients] = useState([]);
  const vidRef = useRef(null);

  const MySwal = withReactContent(Swal);

  console.log(images);
  console.log(ingredients);

  
  useEffect(() => {
    const openCamera = async () => {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment' 
        }
      });
      vidRef.current.srcObject = stream;
    }
    openCamera();
  }, []);


  function captureImage() {
    let canvas = document.createElement('canvas');
    canvas.width = vidRef.current.videoWidth;
    canvas.height = vidRef.current.videoHeight;

    let context = canvas.getContext('2d');
    context.drawImage(vidRef.current, 0, 0, canvas.width, canvas.height);

    canvas.toBlob(async (blob) => {
      const newImg = new File([blob], "newImage.png", {type: 'image/png'});
      const newUrl = URL.createObjectURL(newImg);
      const imgBlob = await urlToImg(newUrl);
      const url = await postToServer(imgBlob);
      const ingredient = await scanImageUrl(url);

      const id = nanoid();

      setImages((prev) => [...prev, {'id': id, image_url: newUrl}]);
      setIngredients((prev) => ([...prev, {'id': id, 'ingredient': ingredient}]));
    })
  }

  async function getRecipe() {
    if (images.length != ingredients.length) {
      MySwal.fire({
        title: "Analyzing...",
        text: `Wait for me to analyze all images.`,
        icon: "warning",
      });
      return;
    }

    try {

      let response = await generateRecipe(ingredients);
      let recipe = JSON.parse(response);
      setResult(recipe);

    } catch (error) {
      
      setResult({
          "name": "Adobo",
          "ai_message": "You didn't give any ingredient.",
          "is_ingredient": false,
          "ingredients": [
            "1 kg Chicken or Beef",
            "3 cloves of Garlic, 1 onion, 1 cup ofetta Tomato",
            "1 teaspoon of Ground Black Pepper, 1 teaspoon of Salt, 2 bay leaves",
            "2 tablespoons of Vinegar, 2 tablespoons of Soy Sauce, 1 tablespoon of Fish Sauce (optional)",
            "2 tablespoons of Vegetable Oil"
          ],
          "steps": [
            "Heat oil in a pan over medium heat",
            "Sauté garlic and onions until softened",
            "Add meat and cook until browned",
            "Add tomato, pepper, salt, and bay leaves",
            "Pour in vinegar, soy sauce, and fish sauce (if using)",
            "Simmer for 30 minutes",
            "Serve hot"
          ],
          "nutrients_per_100g": [
            "calories: 250",
            "carbohydrates: 20g",
            "protein: 15g",
            "fat: 10g",
            "sodium: 500mg",
            "potassium: 400mg",
            "cholesterol: 20mg"
          ]
        });
    }
  }

  function deleteIngredient(object) {
    if (images.length != ingredients.length) {
      MySwal.fire({
        title: "Analyzing...",
        text: `Wait for me to analyze all images.`,
        icon: "warning",
      });
      return;
    }

    let id = object.id;

    setImages(prev => (
      prev.filter(image => image.id !== id)
    ))

    setIngredients(prev => (
       prev.filter(ingredient => ingredient.id !== id)
    ))
  }

  return (
    <>
      <div>
        <h2 className="text-accent mt-6 mb-1 text-center">Recipe Generator</h2>
      </div>
      <div className="p-2 aspect-square w-full border-4 border-accent/30 rounded-lg">
        <video 
          ref={vidRef}
          playsInline
          autoPlay
          className="w-full h-full bg-red-400 rounded-lg overflow-hidden object-cover"
        >
        </video>
      </div>
      <div className="flex items-center justify-center mt-8">
        <button onClick={captureImage} className="aspect-square w-16  bg-accent rounded-full flex items-center justify-center">
          <img src={CameraIcon} alt="camera"  className="w-4/6"/>
        </button>
      </div>
      {images.length > 0 && 
        <div className="w-full bg-black/10 mt-8 gap-2 p-4 pb-6 space-y-8 rounded-lg">
          
          <div className="w-full gap-2 rounded-lg grid grid-cols-4">
            {
              images.map((image, index) => (
                <div onClick={() => deleteIngredient(image)} className="aspect-square bg-white flex rounded overflow-hidden">
                  <img src={image.image_url} alt={`captured-image-${index}`} className="flex-1"/>
                </div>
              ))
            }
          </div>

          <div className="w-full flex justify-center">
            <button 
              className="bg-accent text-white px-8 py-4 text-xl rounded-full" 
              onClick={getRecipe}
            >
              Generate Recipe 
            </button>
          </div>

        </div>
      }
    </>
  );
}