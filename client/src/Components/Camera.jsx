import { FilesetResolver, HandLandmarker } from '@mediapipe/tasks-vision'
import axiosInstance from '../Config/axiosInstance'
import React, { useEffect, useRef } from 'react'

export default function Camera({ onLetterPredict }) {
    const videoRef = useRef(null)
    const canvasRef = useRef(null)

    useEffect(() => {
        let stream = null;
        let animationFrameId = null;
        let handLandmarker = null;
        let isRunning = true;

        async function createHandLandmarker() {
            try {
                const vision = await FilesetResolver.forVisionTasks("https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision/wasm")

                if (!isRunning) return;
                handLandmarker = await HandLandmarker.createFromOptions(vision, {
                    baseOptions: {
                        modelAssetPath: "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task"
                    },
                    runningMode: 'VIDEO',
                    numHands: 1
                })

                if (isRunning) startCamera()
            } catch (err) {
                console.error("Error creating HandLandmarker:", err)
            }
        }

        async function startCamera() {
            try {
                stream = await navigator.mediaDevices.getUserMedia({ video: true })
                if (videoRef.current && isRunning) {
                    videoRef.current.srcObject = stream
                    videoRef.current.play()
                    videoRef.current.onloadeddata = () => {
                        if (isRunning) detectFrame()
                    }
                }
            } catch (err) {
                console.error("Error accessing camera:", err)
            }
        }    

        

        function detectFrame() {
            if (!isRunning) return;
            const video = videoRef.current
            const canvas = canvasRef.current
            if (!video || !canvas) return;

            const ctx = canvas.getContext('2d')

            async function frameLoop() {
                if (!isRunning || !video || !canvas) return;

                if (video.videoWidth > 0 && video.videoHeight > 0) {
                    canvas.width = video.videoWidth
                    canvas.height = video.videoHeight

                    if (video.readyState >= 2 && handLandmarker) {
                        try {
                            const results = handLandmarker.detectForVideo(
                                video,
                                performance.now()
                            )

                            ctx.clearRect(0, 0, canvas.width, canvas.height);

                            if (results.landmarks && results.landmarks.length > 0) {
                                results.landmarks.forEach((landmarks) => {
                                    landmarks.forEach((point) => {
                                        ctx.beginPath();
                                        ctx.arc(
                                            point.x * canvas.width,
                                            point.y * canvas.height,
                                            6,
                                            0,
                                            2 * Math.PI
                                        );
                                        ctx.fillStyle = "#00f3ff"; // Neon cyan
                                        ctx.shadowColor = "#00f3ff";
                                        ctx.shadowBlur = 10;
                                        ctx.fill();
                                    });

                                    // Extract landmark data
                                    const extracted = [];
                                    landmarks.forEach(point => {
                                        extracted.push(point.x);
                                        extracted.push(point.y);
                                    });

                                    axiosInstance({
                                        method: 'post',
                                        url: '/predict',
                                        data: { landmarks: extracted }
                                    })
                                        .then((res) => {
                                            if (isRunning && onLetterPredict) {
                                                onLetterPredict(res?.data?.prediction)
                                            }
                                        })
                                        .catch((err) => {
                                            // Handle error
                                        })
                                });
                            }
                        } catch (err) {
                            console.error("Error detecting landmarks:", err)
                        }
                    }
                }
                if (isRunning) {
                    animationFrameId = requestAnimationFrame(frameLoop);
                }
            }
            frameLoop();
        }

        createHandLandmarker()

        return () => {
            isRunning = false;
            if (animationFrameId) {
                cancelAnimationFrame(animationFrameId);
            }
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
            if (handLandmarker) {
                handLandmarker.close();
            }
        };
    }, []) // eslint-disable-line

    return (
        <div className="relative w-full h-full flex items-center justify-center bg-transparent rounded-3xl overflow-hidden shadow-[inset_0_0_50px_rgba(0,0,0,0.5)]">
            {/* Real-time Video layer underneath */}
            <video 
                ref={videoRef} 
                autoPlay 
                playsInline 
                className="absolute w-full h-full object-cover rounded-3xl" 
                style={{ transform: 'scaleX(-1)' }} 
            />
            <canvas 
                ref={canvasRef} 
                className="absolute w-full h-full object-cover z-10 pointer-events-none rounded-3xl" 
                style={{ transform: 'scaleX(-1)' }}
            />
        </div>
    )
}
