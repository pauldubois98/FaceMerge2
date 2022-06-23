var loaded = false;
async function load() {
    await faceapi.loadSsdMobilenetv1Model("/models");
    await faceapi.loadFaceLandmarkModel("/models");
    loaded = true;
}
async function get_landmarks(image) {
    if (!loaded) {
        await load();
    }
    // const detections = await faceapi.detectAllFaces(input)
    // console.log(detections)
    const detectionsWithLandmarks = await faceapi
        .detectAllFaces(image)
        .withFaceLandmarks();
    // console.log(detectionsWithLandmarks);
    // console.log(detectionsWithLandmarks[0].landmarks);
    return detectionsWithLandmarks[0].landmarks;
}
load();