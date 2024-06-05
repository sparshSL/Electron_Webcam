// Get all elements in variables
const video = document.getElementById('webcam');
const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');
const blackAndWhiteButton = document.getElementById('blackAndWhite');
const saveImageButton = document.getElementById('saveImage');

let isBlackAndWhite = false;
let animationFrameId;

//Getting vebcam feed
navigator.mediaDevices.getUserMedia({ video: true })
  .then(stream => {
    video.srcObject = stream;
    video.play();
    requestAnimationFrame(applyFilter); //apply a filter on feed using the requestAnimationFrame timer
  })
  .catch(error => {
    console.error('Error accessing webcam:', error);
  });


  //function to convert image to BW using RGB Channels
  function applyBlackAndWhiteFilter(imageData) {
    const data = imageData.data;
  
    for (let i = 0; i < data.length; i += 4) {
      const gray = 0.3 * data[i] + 0.59 * data[i + 1] + 0.11 * data[i + 2];
      data[i] = gray;
      data[i + 1] = gray;
      data[i + 2] = gray;
    }
  
    return imageData;
  };
  
  //Function to capture image got in webcam
  function captureFrame() {
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    return context.getImageData(0, 0, canvas.width, canvas.height);
  };
  
  //Function to get Current frame and convert it if isBlackAndWhite toggle is on
  function applyFilter() {
    if (isBlackAndWhite) {
      const imageData = captureFrame();
      context.putImageData(applyBlackAndWhiteFilter(imageData), 0, 0);
    }
  
    if (isBlackAndWhite) { //Switch the feed from the video block or canvas block in the html file
      video.style.display = 'none';
      canvas.style.display = 'block';
    } else {
      video.style.display = 'block';
      canvas.style.display = 'none';
    }
  
    animationFrameId = requestAnimationFrame(applyFilter);
  }
  

  //Function to save the image either color or BW depending on toggle
  function saveImage() {
    const imageData = captureFrame();
    if (isBlackAndWhite) {
      context.putImageData(applyBlackAndWhiteFilter(imageData), 0, 0);
    }
    
    const dataURL = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = dataURL;
    link.download = 'webcam_image.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
  
  //Event listners for the 2 buttons
  blackAndWhiteButton.addEventListener('click', () => {
    isBlackAndWhite = !isBlackAndWhite;
    if (!isBlackAndWhite) {
      video.srcObject = video.srcObject; // Reset the video stream
    }
  });

  saveImageButton.addEventListener('click', saveImage);