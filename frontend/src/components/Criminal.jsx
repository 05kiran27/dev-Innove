import React, { useEffect, useRef, useState } from "react";
import axios from "axios";

const Criminal = () => {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const intervalRef = useRef(null);
    const [devices, setDevices] = useState([]);
    const [selectedDeviceId, setSelectedDeviceId] = useState("");
    const [detections, setDetections] = useState([]);

    useEffect(() => {
        const getVideoDevices = async () => {
            try {
                const devices = await navigator.mediaDevices.enumerateDevices();
                const videoDevices = devices.filter((device) => device.kind === "videoinput");
                setDevices(videoDevices);
                if (videoDevices.length > 0) {
                    setSelectedDeviceId(videoDevices[1].deviceId);
                }
            } catch (err) {
                console.error("Error fetching video devices:", err);
            }
        };
        getVideoDevices();
    }, []);

    useEffect(() => {
        const startWebcam = async () => {
            try {
                const constraints = { video: selectedDeviceId ? { deviceId: { exact: selectedDeviceId } } : true };
                const stream = await navigator.mediaDevices.getUserMedia(constraints);
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
                const response = await axios.post("http://localhost:5000/detect", formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
                setDetections(response.data.faces || []);
                console.log('prediction -> ', response)
            } catch (error) {
                console.error("Error sending frame to server:", error.response?.data || error.message);
            }
        }, "image/jpeg");
    };

    useEffect(() => {
        intervalRef.current = setInterval(captureAndSendFrame, 1000);
        return () => clearInterval(intervalRef.current);
    }, []);

    useEffect(() => {
        if (!canvasRef.current || !videoRef.current) return;

        const canvas = canvasRef.current;
        const video = videoRef.current;
        const context = canvas.getContext("2d");
        const videoWidth = video.videoWidth;
        const videoHeight = video.videoHeight;
        const displayWidth = video.clientWidth;
        const displayHeight = video.clientHeight;
        const scaleX = displayWidth / videoWidth;
        const scaleY = displayHeight / videoHeight;

        context.clearRect(0, 0, canvas.width, canvas.height);
        context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

        detections.forEach(({ location, color, name }) => {
            const [x, y, width, height] = location;
            const scaledX = x * scaleX;
            const scaledY = y * scaleY;
            const scaledWidth = width * scaleX;
            const scaledHeight = height * scaleY;

            context.strokeStyle = color || "red";
            context.lineWidth = 3;
            context.strokeRect(scaledX, scaledY, scaledWidth, scaledHeight);
            context.fillStyle = color || "red";
            context.font = "16px Arial";
            context.fillText(name || "Unknown", scaledX, scaledY - 5);
        });
    }, [detections]);

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
            <div style={{ position: "relative" }}>
                <video
                    ref={videoRef}
                    style={{
                        width: "100%",
                        maxWidth: "600px",
                        borderRadius: "10px",
                        transform: "scaleX(-1)",
                        objectFit: "cover",
                    }}
                    autoPlay
                />
                <canvas
                    ref={canvasRef}
                    style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        pointerEvents: "none",
                    }}
                />
            </div>
            <h2>Detections:</h2>
            <ul>
                {detections.map(({ name }, index) => (
                    <li key={index}>{name}</li>
                ))}
            </ul>
        </div>
    );
};

export default Criminal;
