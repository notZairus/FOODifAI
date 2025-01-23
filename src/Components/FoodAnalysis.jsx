import CameraIcon from "../assets/icons/camera.svg";
import { useState, useEffect, useRef } from "react";
import { urlToImg, postToServer } from "../js/functions.js";
import { scanImageUrl, generateRecipe } from "../js/ai.js";
import { nanoid } from "nanoid";
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';




export default function FoodAnalysis({ setResult }) {
  const [image, setImage] = useState(null);
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

  function captureImage() {
    
  }


  return (
    <>

      <div>
        <h2 className="text-accent mt-6 mb-1 text-center">Food Analysis</h2>
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
      
    </>
  );
}