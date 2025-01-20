


async function urlToImg(imgUrl) {
  const response = await fetch(imgUrl);
  const blob = await response.blob();
  return blob;
}

async function postToServer(imgBlob) {
  let fdata = new FormData();
  fdata.append('image', imgBlob);

  let key = import.meta.env.VITE_IMGBB_API_KEY;
  
  let response = await fetch(`https://api.imgbb.com/1/upload?key=${key}`, {
    method: "POST",
    body: fdata
  });

  let result = await response.json();
  return result.data.url;
}



export {
  urlToImg,
  postToServer,
}