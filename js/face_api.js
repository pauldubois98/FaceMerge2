var loaded = false;
async function load() {
    await faceapi.loadSsdMobilenetv1Model("models");
    await faceapi.loadFaceLandmarkModel("models");
    loaded = true;
}
async function get_landmarks(image) {
    // // full detections
    // const detections = await faceapi.detectAllFaces(input)
    // console.log(detections)
    const detectionsWithLandmarks = await faceapi
        .detectAllFaces(image)
        .withFaceLandmarks();
    // console.log(detectionsWithLandmarks);
    // console.log(detectionsWithLandmarks[0].landmarks);
    return detectionsWithLandmarks[0].landmarks;
}

window.onload = async function () {
    await load();
    var hidden_img = document.getElementById("default-profile");
    await faceapi.detectAllFaces(hidden_img).withFaceLandmarks();
    loaded = true;
    console.log("loaded");
};