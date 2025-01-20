import CameraIcon from "../assets/icons/camera.svg";
import { useState, useEffect, useRef } from "react";



export default function RecipeGenerator() {

  const [images, setImages] = useState([]);
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
      {images.length > 0 && <div className="w-full bg-white/5 mt-8 grid grid-cols-4 gap-2 p-4 rounded-lg">
        {
          images.map((image, index) => (
            <div className="aspect-square bg-white flex rounded overflow-hidden">
              <img src={image} alt={`captured-image-${index}`} className="flex-1"/>
            </div>
          ))
        }
      </div>}
    </>
  );
}