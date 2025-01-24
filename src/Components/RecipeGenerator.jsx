import CameraIcon from "../assets/icons/camera.svg";
import { useState, useEffect, useRef } from "react";
import { postToServer, urlToImg } from "../js/functions.js";
import { scanImageUrl, generateRecipe } from "../js/ai.js";
import { nanoid } from "nanoid";
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';


const MySwal = withReactContent(Swal);

export default function RecipeGenerator({ setResult }) {
  const [images, setImages] = useState([]);
  const [ingredients, setIngredients] = useState([]);
  const vidRef = useRef(null);

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

      //prompt the confirmation for the taken image
      MySwal.fire({
        title: "Confirm Image? ",
        showCancelButton: true,
        confirmButtonText: "Confirm",
        showLoaderOnConfirm: true,
        preConfirm: async () => {
          // if confirmed....

          // get an img file using the canvas/context
          let imgFile = new File([blob], "takenImg.png", { type: 'image/png' });
          console.log(imgFile);

          // upload the img to the server
          let imgUrl = await postToServer(imgFile);
          console.log(imgUrl);

          // make ai get the ingredient in the image
          try {
            
            let ingredientJson = await scanImageUrl(imgUrl);
            console.log(ingredientJson);

            //if (ingredientJson.image_is_intelligible && ingredientJson.there_is_an_ingredient) {
              MySwal.fire({
                title: 'Ingredient Detected',
                text: 'If the ingredient I detected is incorrect, you can correct it using the textbox below.',
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
                        Swal.showValidationMessage('Please enter a valid ingredient!');
                    }
                    return value;
                }
              }).then((result) => {
                if (result.isConfirmed) {
                  const id = nanoid();
                  setImages((prev) => [...prev, {'id': id, image_url: imgUrl}]);
                  setIngredients((prev) => ([...prev, {'id': id, 'ingredient': result.value}]));
                } 
              })
            //}

          } catch (error) {

            MySwal.fire({
              title: 'Ingredient Undetected',
              text: 'You can choose to input the name ingredient in the input below.',
              imageUrl: imgUrl,
              imageWidth: 150,
              imageHeight: 150,
              inputLabel: 'Ingredient Name: ',
              input: 'text',
              inputPlaceholder: 'Mango',
              showCancelButton: true,
              confirmButtonText: 'Confirm',
              preConfirm: (value) => {
                  if (!value) {
                      Swal.showValidationMessage('Please enter a valid ingredient!');
                  }
                  return value;
              }
            }).then((result) => {
              if (result.isConfirmed) {
                const id = nanoid();
                setImages((prev) => [...prev, {'id': id, image_url: imgUrl}]);
                setIngredients((prev) => ([...prev, {'id': id, 'ingredient': result.value}]));
              } 
            })

          }
        }
      })
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
          "ai_message": "You didn't give any ingredient.",
          "is_ingredient": false,
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

    Swal.fire({
      title: "Delete the image?",
      text: "You won't be able to recovert the deleted image!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "Deleted!",
          text: "Your file has been deleted.",
          icon: "success"
        });

        setImages(prev => prev.filter(image => image.id !== object.id))
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
        <button onClick={getIngredient} className="aspect-square w-16  bg-accent active:bg-accent/80 rounded-full flex items-center justify-center">
          <img src={CameraIcon} alt="camera"  className="w-4/6"/>
        </button>
      </div>
      {images.length > 0 && 
        <div className="w-full bg-black/10 mt-8 gap-2 p-4 pb-6 space-y-8 rounded-lg">
          
          <div className="w-full gap-2 rounded-lg grid grid-cols-4">
            {
              images.map((image, index) => (
                <div onClick={() => deleteIngredient(image)} className="cursor-pointer aspect-square bg-white flex rounded overflow-hidden">
                  <img src={image.image_url} alt={`captured-image-${index}`} className="flex-1"/>
                </div>
              ))
            }
          </div>

          <div className="w-full flex justify-center">
            <button 
              className="bg-accent active:bg-accent/80 text-white px-8 py-4 text-xl rounded-full" 
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