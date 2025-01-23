import CameraIcon from "../assets/icons/camera.svg";
import { useState, useEffect, useRef } from "react";
import { postToServer } from "../js/functions.js";
import { analyzeFood } from "../js/ai.js";
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';


const MySwal = withReactContent(Swal);


export default function FoodAnalysis({ setResult }) {
  const [image, setImage] = useState(null);
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

  function getAnalysis() {
    let canvas = document.createElement('canvas');
    canvas.width = vidRef.current.videoWidth;
    canvas.height = vidRef.current.videoHeight;

    let context = canvas.getContext('2d');
    context.drawImage(vidRef.current, 0, 0, canvas.width, canvas.height);

    canvas.toBlob(async (blob) => {
      console.log('sadasds')
      let newImage = new File([blob], 'food.png', { type: 'image/png' });
      //let url = await postToServer(newImage);
      setResult(await analyzeFood("https://www.rotinrice.com/wp-content/uploads/2011/10/BeefBeanStew-3.jpg"));

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
        <button onClick={getAnalysis} className="aspect-square w-16  bg-accent rounded-full flex items-center justify-center">
          <img src={CameraIcon} alt="camera"  className="w-4/6"/>
        </button>
      </div>
      
    </>
  );
}