import CameraIcon from "../assets/icons/camera.svg";
import { useState, useEffect, useRef } from "react";
import { urlToImg, postToServer } from "../js/functions.js";
import { scanUrl } from "../js/ai.js";
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import "@sweetalert2/theme-dark";



export default function RecipeGenerator({ setResult }) {
  const [images, setImages] = useState([]);
  const [ingredients, setIngredients] = useState([]);
  const vidRef = useRef(null);

  const MySwal = withReactContent(Swal);
  
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

  useEffect(() => {
    if (images.length == 0) return;

    const identifyIngredient = async (imgUrl) => {
      const imgBlob = await urlToImg(imgUrl);
      const url = await postToServer(imgBlob);
      const ingredient = await scanUrl(url);

      setIngredients((prev) => [...prev, ingredient]);
    }

    identifyIngredient(images[images.length - 1]);

  }, [images]);

  function captureImage() {
    let canvas = document.createElement('canvas');
    canvas.width = vidRef.current.videoWidth;
    canvas.height = vidRef.current.videoHeight;

    let context = canvas.getContext('2d');
    context.drawImage(vidRef.current, 0, 0, canvas.width, canvas.height);

    canvas.toBlob((blob) => {
      const newImg = new File([blob], "newImage.png", {type: 'image/png'});
      const newUrl = URL.createObjectURL(newImg);
      setImages(prev => [...prev, newUrl]);
    })
  }

  function generateRecipe() {
    MySwal.fire({
      title: "Wait a sec.",
      text: "Wait until all the images are analyzed :))))))))))))",
      icon: "warning"
    });
  }

  return (
    <>
      <div className="aspect-square w-full">
        <video 
          ref={vidRef}
          playsInline
          autoPlay
          className="w-full h-full bg-red-400 mt-8 rounded-lg overflow-hidden object-cover"
        >
        </video>
      </div>
      <div className="flex items-center justify-center mt-8">
        <button onClick={captureImage} className="aspect-square w-16  bg-lime-700 rounded-full flex items-center justify-center">
          <img src={CameraIcon} alt="camera"  className="w-4/6"/>
        </button>
      </div>
      {images.length > 0 && 
        <div className="w-full bg-white/5 mt-8 gap-2 p-4 pb-6 space-y-8 rounded-lg">
          
          <div className="w-full gap-2 rounded-lg grid grid-cols-4">
            {
              images.map((image, index) => (
                <div className="aspect-square bg-white flex rounded overflow-hidden">
                  <img src={image} alt={`captured-image-${index}`} className="flex-1"/>
                </div>
              ))
            }
          </div>

          <div className="w-full flex justify-center">
            <button className="bg-lime-700 text-white px-8 py-4 text-xl rounded-full" onClick={generateRecipe}>
              Generate Recipe 
            </button>
          </div>

        </div>
      }
    </>
  );
}