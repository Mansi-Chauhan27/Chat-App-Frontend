import { useRecordWebcam } from 'react-record-webcam'
import axios from "axios";

export default function RecordVideo(props) {
  const recordWebcam = useRecordWebcam();

  const saveFile = async () => {
    const blob = await recordWebcam.getRecording();
    console.log(typeof blob);
    console.log(blob.type)
    const blobUrl = URL.createObjectURL(blob)
    console.log(blobUrl)
    var d = new Date();
    var file = new File([blob],d.valueOf(),{type:'videoo/webm'})
    console.log(file);
    console.log(typeof file)

    // let file = ev;
    let fileName = file.name + '.webm';
    let fileType = file.type;
    var url = null
    var returnData = null
    axios.post("http://localhost:8000/chat/sign_s3/",{
    fileName : fileName, //parameter 1
    fileType : fileType  //parameter 2
    })
    .then(response => {
        console.log(response)
    returnData = response.data['data']
    console.log(returnData)
    // var signedRequest = returnData.signedRequest;
    url = returnData['url'];
    console.log(url)
    

    const formData = new FormData();

    // append the fields in presignedPostData in formData   
    console.log(returnData)   
    var obj = {}    
    obj['file'] = new File([blob],d.valueOf(),{type:'videoo/webm'})
    Object.keys(returnData['fields']).forEach(key => {
                formData.append(key, returnData['fields'][key]);
                obj[key]=returnData['fields'][key]
                });           

    // append the file
    formData.append("file", file);
    console.log(formData)
    
    
    // formData.append('Content-Type', 'video/webm');
    console.log(obj)
    var options = {
        headers: {
        'Content-Type':'text/plain',
        }
        };
        // http_response = requests.post(response['url'], data=response['fields'], files=files)
    
    // axios.put(url,file,options)
    // .then(result => {console.log(result)})
    // .catch(error => {
    // console.log(error)
    // })

    axios.post(url,formData,options).then(function (response) {
           console.log(response,'heyyy',obj);
          })
           .catch(function (error) {
            console.log(error,'wayyy');
         });            
        
        })
            
  };

  return (
    <div>
      <p>Camera status: {recordWebcam.status}</p>
      <button onClick={recordWebcam.open}>Open camera</button>
      <button onClick={recordWebcam.start}>Start recording</button>
      <button onClick={recordWebcam.stop}>Stop recording</button>
      <button onClick={recordWebcam.retake}>Retake recording</button>
      <button onClick={recordWebcam.download}>Download recording</button>
      <button onClick={saveFile}>Save file to server</button>
      <video ref={recordWebcam.webcamRef} autoPlay muted />
      <video ref={recordWebcam.previewRef} autoPlay muted loop />
    </div>
  )
}