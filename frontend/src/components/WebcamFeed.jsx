

// import React, { useEffect, useRef, useState } from "react";
// import axios from "axios";

// const WebcamFeed = () => {
//     const videoRef = useRef(null);
//     const canvasRef = useRef(null);
//     const intervalRef = useRef(null);
//     const [devices, setDevices] = useState([]);
//     const [selectedDeviceId, setSelectedDeviceId] = useState("");

//     useEffect(() => {
//         // Fetch available video devices
//         const getVideoDevices = async () => {
//             try {
//                 const devices = await navigator.mediaDevices.enumerateDevices();
//                 const videoDevices = devices.filter((device) => device.kind === "videoinput");
//                 setDevices(videoDevices);
//                 if (videoDevices.length > 0) {
//                     setSelectedDeviceId(videoDevices[0].deviceId); // Default to the first device
//                 }
//             } catch (err) {
//                 console.error("Error fetching video devices:", err);
//             }
//         };

//         getVideoDevices();
//     }, []);

//     useEffect(() => {
//         // Start the webcam feed with the selected device
//         const startWebcam = async () => {
//             try {
//                 const constraints = {
//                     video: selectedDeviceId
//                         ? { deviceId: { exact: selectedDeviceId } }
//                         : true,
//                 };
//                 const stream = await navigator.mediaDevices.getUserMedia(constraints);
//                 if (videoRef.current) {
//                     videoRef.current.srcObject = stream;
//                     videoRef.current.onloadedmetadata = () => {
//                         videoRef.current.play().catch((err) => console.error("Autoplay error:", err));
//                     };
//                 }
//             } catch (err) {
//                 console.error("Error accessing webcam:", err);
//                 alert("Unable to access the webcam. Please check permissions or try a different camera.");
//             }
//         };
        

//         if (selectedDeviceId) {
//             startWebcam();
//         }

//         return () => {
//             if (videoRef.current && videoRef.current.srcObject) {
//                 videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
//             }
//         };
//     }, [selectedDeviceId]);

//     <select
//         onChange={(e) => {
//             console.log("Selected device ID:", e.target.value);
//             setSelectedDeviceId(e.target.value);
//         }}
//         value={selectedDeviceId}
//     >
//         {devices.map((device) => (
//             <option key={device.deviceId} value={device.deviceId}>
//                 {device.label || `Camera ${device.deviceId}`}
//             </option>
//         ))}
//     </select>


//     const captureAndSendFrame = async () => {
//         if (!canvasRef.current || !videoRef.current) return;

//         const canvas = canvasRef.current;
//         const video = videoRef.current;
//         const context = canvas.getContext("2d");

//         canvas.width = video.videoWidth;
//         canvas.height = video.videoHeight;

//         context.drawImage(video, 0, 0, canvas.width, canvas.height);

//         canvas.toBlob(async (blob) => {
//             const formData = new FormData();
//             formData.append("image", blob, "frame.jpg");

//             try {
//                 const response = await axios.post(
//                     "http://localhost:5000/predict", // Ensure the URL is correct
//                     formData,
//                     {
//                         headers: { "Content-Type": "multipart/form-data" },
//                     }
//                 );
//                 console.log("Prediction:", response.data);
//             } catch (error) {
//                 console.error("Error sending frame to server:", error.message);
//             }
//         }, "image/jpeg");
//     };


//     useEffect(() => {
//         intervalRef.current = setInterval(captureAndSendFrame, 1000); // 1 frame per second

//         return () => {
//             clearInterval(intervalRef.current);
//         };
//     }, []);

//     return (
//         <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
//             <select
//                 onChange={(e) => setSelectedDeviceId(e.target.value)}
//                 value={selectedDeviceId}
//                 style={{ marginBottom: "10px" }}
//             >
//                 {devices.map((device) => (
//                     <option key={device.deviceId} value={device.deviceId}>
//                         {device.label || `Camera ${device.deviceId}`}
//                     </option>
//                 ))}
//             </select>
//             <video
//                 ref={videoRef}
//                 style={{
//                     width: "100%",
//                     maxWidth: "600px",
//                     borderRadius: "10px",
//                     transform: "scaleX(-1)", // Fix mirrored video
//                     objectFit: "cover",
//                 }}
//             />
//             <canvas ref={canvasRef} style={{ display: "none" }} />
//         </div>
//     );
// };

// export default WebcamFeed;




import React, { useEffect, useRef, useState } from "react";
import axios from "axios";

const WebcamFeed = () => {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const intervalRef = useRef(null);
    const [devices, setDevices] = useState([]);
    const [selectedDeviceId, setSelectedDeviceId] = useState("");
    const [prediction, setPrediction] = useState(null);

    useEffect(() => {
        // Fetch available video devices
        const getVideoDevices = async () => {
            try {
                const devices = await navigator.mediaDevices.enumerateDevices();
                const videoDevices = devices.filter((device) => device.kind === "videoinput");
                setDevices(videoDevices);
                if (videoDevices.length > 0) {
                    setSelectedDeviceId(videoDevices[0].deviceId); // Default to the first device
                }
            } catch (err) {
                console.error("Error fetching video devices:", err);
            }
        };

        getVideoDevices();
    }, []);

    useEffect(() => {
        // Start the webcam feed with the selected device
        const startWebcam = async () => {
            try {
                const constraints = {
                    video: selectedDeviceId ? { deviceId: { exact: selectedDeviceId } } : true,
                };
                const stream = await navigator.mediaDevices.getUserMedia(constraints);
                console.log("Webcam stream:", stream);
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                    videoRef.current.onloadedmetadata = () => {
                        videoRef.current.play().catch((err) => console.error("Autoplay error:", err));
                    };
                }
            } catch (err) {
                console.error("Error accessing webcam:", err);
                alert("Unable to access the webcam. Please check permissions or try a different camera.");
            }
        };

        if (selectedDeviceId) {
            startWebcam();
        }

        return () => {
            if (videoRef.current && videoRef.current.srcObject) {
                videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
            }
        };
    }, [selectedDeviceId]);

    const captureAndSendFrame = async () => {
        if (!canvasRef.current || !videoRef.current) return;

        const canvas = canvasRef.current;
        const video = videoRef.current;
        const context = canvas.getContext("2d");

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        canvas.toBlob(async (blob) => {
            if (!blob) {
                console.error("Failed to capture frame");
                return;
            }

            const formData = new FormData();
            formData.append("image", blob, "frame.jpg");

            try {
                const response = await axios.post(
                    "http://localhost:5000/upload",
                    formData,
                    {
                        headers: { "Content-Type": "multipart/form-data" },
                    }
                );
                console.log("Prediction:", response.data);
                setPrediction(response.data.label);
            } catch (error) {
                console.error("Error sending frame to server:", error.response?.data || error.message);
            }
        }, "image/jpeg");
    };

    useEffect(() => {
        intervalRef.current = setInterval(captureAndSendFrame, 1000); // 1 frame per second

        return () => {
            clearInterval(intervalRef.current);
        };
    }, []);

    return (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <select
                onChange={(e) => setSelectedDeviceId(e.target.value)}
                value={selectedDeviceId}
                style={{ marginBottom: "10px" }}
            >
                {devices.map((device) => (
                    <option key={device.deviceId} value={device.deviceId}>
                        {device.label || `Camera ${device.deviceId}`}
                    </option>
                ))}
            </select>
            <video
                ref={videoRef}
                style={{
                    width: "100%",
                    maxWidth: "600px",
                    borderRadius: "10px",
                    transform: "scaleX(-1)", // Fix mirrored video
                    objectFit: "cover",
                }}
                autoPlay
            />
            <canvas ref={canvasRef} style={{ display: "none" }} />
            <h2>Prediction: {prediction !== null ? prediction : "Waiting for response..."}</h2>
        </div>
    );
};

export default WebcamFeed;





// import React, { useEffect, useRef, useState } from "react";
// import axios from "axios";

// const WebcamFeed = () => {
//     const videoRef = useRef(null);
//     const canvasRef = useRef(null);
//     const [devices, setDevices] = useState([]);
//     const [selectedDeviceId, setSelectedDeviceId] = useState("");
//     const [prediction, setPrediction] = useState(null);

//     useEffect(() => {
//         // Fetch available video devices
//         const getVideoDevices = async () => {
//             try {
//                 const devices = await navigator.mediaDevices.enumerateDevices();
//                 const videoDevices = devices.filter((device) => device.kind === "videoinput");
//                 setDevices(videoDevices);
//                 if (videoDevices.length > 0) {
//                     setSelectedDeviceId(videoDevices[0].deviceId); // Default to the first device
//                 }
//             } catch (err) {
//                 console.error("Error fetching video devices:", err);
//             }
//         };

//         getVideoDevices();
//     }, []);

//     useEffect(() => {
//         // Start the webcam feed
//         const startWebcam = async () => {
//             try {
//                 const constraints = {
//                     video: selectedDeviceId ? { deviceId: { exact: selectedDeviceId } } : true,
//                 };
//                 const stream = await navigator.mediaDevices.getUserMedia(constraints);
//                 if (videoRef.current) {
//                     videoRef.current.srcObject = stream;
//                     videoRef.current.onloadedmetadata = () => {
//                         videoRef.current.play().catch((err) => console.error("Autoplay error:", err));
//                     };
//                 }
//             } catch (err) {
//                 console.error("Error accessing webcam:", err);
//                 alert("Unable to access the webcam. Please check permissions.");
//             }
//         };

//         if (selectedDeviceId) {
//             startWebcam();
//         }

//         return () => {
//             if (videoRef.current && videoRef.current.srcObject) {
//                 videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
//             }
//         };
//     }, [selectedDeviceId]);

//     return (
//         <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
//             <h2>Webcam Feed</h2>
//             <select
//                 onChange={(e) => setSelectedDeviceId(e.target.value)}
//                 value={selectedDeviceId}
//                 style={{ marginBottom: "10px" }}
//             >
//                 {devices.map((device) => (
//                     <option key={device.deviceId} value={device.deviceId}>
//                         {device.label || `Camera ${device.deviceId}`}
//                     </option>
//                 ))}
//             </select>
//             <video
//                 ref={videoRef}
//                 style={{
//                     width: "100%",
//                     maxWidth: "600px",
//                     borderRadius: "10px",
//                     transform: "scaleX(-1)", // Flip video to match mirror view
//                     objectFit: "cover",
//                     border: "2px solid #ccc",
//                     boxShadow: "0px 4px 10px rgba(0,0,0,0.3)",
//                 }}
//                 autoPlay
//             />
//         </div>
//     );
// };

// export default WebcamFeed;
