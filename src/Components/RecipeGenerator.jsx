import CameraIcon from "../assets/icons/camera.svg";
import { useEffect, useRef } from "react";



export default function RecipeGenerator() {

  const vidRef = useRef(null);

  useEffect(() => {
    const startCamera = async () => {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment' 
        }
      });
      vidRef.current.srcObject = stream;
    }
    startCamera();
  }, []);

  function handleClick() {
    let canvas = document.createElement('canvas');
    canvas.width = vidRef.current.width;
    canvas.height = vidRef.current.height;

    let context = canvas.getContext('2d');
    context.drawImage(vidRef.current, 0, 0);

    canvas.toBlob((blob) => {
      
    })
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
        <button onClick={handleClick} className="aspect-square w-16  bg-lime-700 rounded-full flex items-center justify-center">
          <img src={CameraIcon} alt="camera"  className="w-4/6"/>
        </button>
      </div>
      <div className="w-full bg-white/5 mt-8 grid grid-cols-4 gap-2 p-4 rounded-lg">
        <div className="aspect-square bg-white"></div>
        <div className="aspect-square bg-white"></div>
        <div className="aspect-square bg-white"></div>
        <div className="aspect-square bg-white"></div>
        <div className="aspect-square bg-white"></div>
        <div className="aspect-square bg-white"></div>
      </div>
    </>
  );
}