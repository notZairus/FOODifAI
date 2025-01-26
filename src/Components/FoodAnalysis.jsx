import CameraIcon from "../assets/icons/camera.svg";
import { useState, useEffect, useRef } from "react";
import { postToServer } from "../js/functions.js";
import { analyzeFood } from "../js/ai.js";
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';


const MySwal = withReactContent(Swal);


export default function FoodAnalysis({ setResult }) {
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

  function startAnalysis() {
    let canvas = document.createElement('canvas');
    canvas.width = vidRef.current.videoWidth;
    canvas.height = vidRef.current.videoHeight;

    let context = canvas.getContext('2d');
    context.drawImage(vidRef.current, 0, 0, canvas.width, canvas.height);

    canvas.toBlob(async (blob) => {
      try {
        let newImage = new File([blob], 'food.png', { type: 'image/png' });
        let url = await postToServer(newImage); 
        let result = await analyzeFood("https://curiousflavors.com/wp-content/uploads/2023/09/Untitled-design-2023-09-21T141726.597.jpg");
        setResult(result);
      } catch(error) {
        alert('yeeet');
      }
    })
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
        <button onClick={startAnalysis} className="aspect-square w-16 bg-accent active:bg-accent/80 rounded-full flex items-center justify-center">
          <img src={CameraIcon} alt="camera"  className="w-4/6"/>
        </button>
      </div>
      
    </>
  );
}