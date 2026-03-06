import { FilesetResolver, HandLandmarker } from '@mediapipe/tasks-vision'
import axios from 'axios'
import React, { useEffect, useRef, useState } from 'react'

export default function Camera() {
    useEffect(() => {
        async function createHandLandmarker() {
            const vision = await FilesetResolver.forVisionTasks("https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision/wasm")

            handLandmarker = await HandLandmarker.createFromOptions(vision, {
                baseOptions: {
                    modelAssetPath: "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task"
                },
                runningMode: 'VIDEO',
                numHands: 1
            })

            startCamera()
        }

        async function startCamera() {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true })
            videoRef.current.srcObject = stream
            videoRef.current.play()

            videoRef.current.onloadeddata = () => detectFrame()
        }

        function detectFrame() {
            const video = videoRef.current
            const canvas = canvasRef.current
            const ctx = canvas.getContext('2d')

            canvas.width = video.videoWidth
            canvas.height = video.videoHeight

            async function frameLoop() {
                const results = handLandmarker.detectForVideo(
                    video,
                    performance.now()
                )

                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

                if (results.landmarks) {
                    results.landmarks.forEach((landmarks) => {
                        landmarks.forEach((point) => {
                            ctx.beginPath();
                            ctx.arc(
                                point.x * canvas.width,
                                point.y * canvas.height,
                                5,
                                0,
                                2 * Math.PI
                            );
                            ctx.fillStyle = "red";
                            ctx.fill();
                        });

                        // 🔥 HERE YOU CAN EXTRACT LANDMARK DATA
                        const extracted = [];

                        results.landmarks[0].forEach(point => {
                            extracted.push(point.x);
                            extracted.push(point.y);
                        });

                        axios({
                            method: 'POST',
                            url: 'http://127.0.0.1:5000/predict',
                            // url: '/',
                            data: { landmarks: extracted }
                        })
                            .then((res) => {
                                console.log('res :>> ', res);
                                setLetter(res?.data?.prediction)
                            })
                            .catch((err) => {
                                // console.log('err :>> ', err);
                            })
                    });
                }
                requestAnimationFrame(frameLoop);

            }
            frameLoop();
        }


        createHandLandmarker()
    }, [])

    const [letter, setLetter] = useState('')
    const videoRef = useRef(null)
    const canvasRef = useRef(null)
    let handLandmarker = null

    return (
        <div>
            <video ref={videoRef} />
            <div>
                Precition: {letter}
            </div>
            <canvas ref={canvasRef} />
        </div>
    )
}
