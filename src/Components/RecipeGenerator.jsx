import CameraIcon from "../assets/icons/camera.svg";
import { useState, useEffect, useRef } from "react";
import { extractJson } from "../js/functions.js";
import { generateRecipe, processImage } from "../js/ai.js";
import { nanoid } from "nanoid";
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

export default function RecipeGenerator({ setResult }) {
  const [ingredients, setIngredients] = useState([]);
  const vidRef = useRef(null);

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

  function getIngredient() {
    const canvas = document.createElement('canvas');
    canvas.width = vidRef.current.videoWidth;
    canvas.height = vidRef.current.videoHeight;

    let context = canvas.getContext('2d');
    context.drawImage(vidRef.current, 0, 0, canvas.width, canvas.height);

    canvas.toBlob(async (blob) => {
      const __image_url = URL.createObjectURL(blob);

      //prompt the confirmation for the taken image
      MySwal.fire({
        title: "Confirm Image? ",
        imageUrl: __image_url,
        imageWidth: 150,
        imageHeight: 150,
        showCancelButton: true,
        confirmButtonText: "Confirm",
        showLoaderOnConfirm: true,
        preConfirm: async () => {
          // if confirmed....

          // get an img file using the canvas/context
          let imgFile = new File([blob], "takenImg.png", { type: 'image/png' });

          // prompt the ai to process the image
          let result = await processImage(imgFile, `
            Analyze and tell me what ingredient is in the image. You STRICTLY need to respond with a JSON string starting with '{' and ends with '}' the json structure is: 
              "{
                "ai_message": string,
                "image_is_intelligible": boolean,
                "there_is_an_ingredient": boolean,
                "ingredient": string
              }"
            .
            All your messages,remarks, and notes MUST be in the "ai_message" key. So that you will surely return a JSON string.
          `);

          let ingredient = extractJson(result);

          // make ai get the ingredient in the image
          try {
            ingredientDetected(ingredient, __image_url)
          } catch (error) {
            noIngredientDetected(__image_url);
          }
        }
      })
    });

    function ingredientDetected(ingredientJson, imgUrl) {
      console.log(ingredientJson);
      if (ingredientJson.image_is_intelligible && ingredientJson.there_is_an_ingredient) {
        MySwal.fire({
          title: 'Ingredient Found',
          text: 'If the detected ingredient is incorrect, you can update it using the textbox below',
          imageUrl: imgUrl,
          imageWidth: 150,
          imageHeight: 150,
          inputLabel: 'Ingredient Name: ',
          input: 'text',
          inputValue: ingredientJson.ingredient,
          inputPlaceholder: 'Mango',
          showCancelButton: true,
          confirmButtonText: 'Confirm',
          preConfirm: (value) => {
            if (!value) {
                Swal.showValidationMessage('Please provide a valid ingredient!');
            }
            return value;
          }
        }).then((result) => {
          if (result.isConfirmed) {
            const id = nanoid();
            setIngredients((prev) => ([...prev, {'id': id, 'image_url': imgUrl, 'ingredient': result.value}]));
          } 
        })
      } else {
        noIngredientDetected(imgUrl);
      }
    }

    function noIngredientDetected(imgUrl) {
      MySwal.fire({
        title: 'Ingredient Not Found',
        text: 'You can enter the ingredient name in the input field below.',
        icon: 'error',
        inputLabel: 'Ingredient Name: ',
        input: 'text',
        inputPlaceholder: 'Mango',
        showCancelButton: true,
        confirmButtonText: 'Confirm',
        preConfirm: (value) => {
          if (!value) {
              Swal.showValidationMessage('Please enter a valid ingredient name.');
          }
          return value;
        }
      }).then((result) => {
        if (result.isConfirmed) {
          const id = nanoid();
          setIngredients((prev) => ([...prev, {'id': id, 'image_url':  "https://media.istockphoto.com/id/1409329028/vector/no-picture-available-placeholder-thumbnail-icon-illustration-design.jpg?s=612x612&w=0&k=20&c=_zOuJu755g2eEUioiOUdz_mHKJQJn-tDgIAhQzyeKUQ=", 'ingredient': result.value}]));
        } 
      })
    }
  }

  async function getRecipe() {
    try {
      let recipe = await generateRecipe(ingredients);
      console.log(recipe);
      setResult(recipe);
    } catch (error) {
      setResult({
        "ai_message": "You didn't give enough ingredient.",
        "is_ingredient": false,
      });
    }
  }

  function deleteIngredient(object) {
    Swal.fire({
      title: "Remove ingredient?",
      text: object.ingredient,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, remove it!"
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "Deleted!",
          text: "Your file has been deleted.",
          icon: "success"
        });
        setIngredients(prev => prev.filter(ingredient => ingredient.id !== object.id))
      }
    });
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
        <button onClick={getIngredient} className="aspect-square w-16 bg-accent active:bg-accent/80 rounded-full flex items-center justify-center">
          <img src={CameraIcon} alt="camera"  className="w-4/6"/>
        </button>
      </div>
      {ingredients.length > 0 && 
        <div className="w-full bg-black/10 mt-8 gap-2 p-4 pb-6 space-y-8 rounded-lg">
          
          <div className="w-full gap-2 rounded-lg grid grid-cols-4">
            {
              ingredients.map((ingredient, index) => (
                <div onClick={() => deleteIngredient(ingredient)} className="cursor-pointer aspect-square bg-white flex rounded overflow-hidden">
                  <img src={ingredient.image_url} alt={`captured-image-${index}`} className="flex-1"/>
                </div>
              ))
            }
          </div>

          {ingredients.length > 3 && 
            <div className="w-full flex justify-center">
              <button 
                className="bg-accent active:bg-accent/80 text-white px-8 py-4 text-xl rounded-full" 
                onClick={getRecipe}
              >
                Generate Recipe 
              </button>
            </div>
          }

        </div>
      }
    </>
  );
}