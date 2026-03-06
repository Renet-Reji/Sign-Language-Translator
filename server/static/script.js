document.addEventListener("DOMContentLoaded", function () {

    const video = document.getElementById("video");
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");
    const output = document.getElementById("output");

    // Setup MediaPipe Hands
    const hands = new Hands({
        locateFile: (file) => {
            return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
        }
    });

    hands.setOptions({
        maxNumHands: 1,
        modelComplexity: 1,
        minDetectionConfidence: 0.7,
        minTrackingConfidence: 0.7
    });

    hands.onResults(async (results) => {

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(results.image, 0, 0, canvas.width, canvas.height);

        if (results.multiHandLandmarks) {

            for (const landmarks of results.multiHandLandmarks) {

                // Draw landmarks
                drawConnectors(ctx, landmarks, HAND_CONNECTIONS);
                drawLandmarks(ctx, landmarks);

                // Convert landmarks to 42 values
                let data = [];
                for (let i = 0; i < 21; i++) {
                    data.push(landmarks[i].x);
                    data.push(landmarks[i].y);
                }

                // Send to Flask
                const response = await fetch("/predict", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ landmarks: data })
                });

                const result = await response.json();
                output.innerText = result.prediction;
            }
        }
    });

    // Setup camera
    const camera = new Camera(video, {
        onFrame: async () => {
            await hands.send({ image: video });
        },
        width: 640,
        height: 480
    });

    camera.start();

});
