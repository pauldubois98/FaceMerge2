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
    await faceapi.loadSsdMobilenetv1Model("models");
    await faceapi.loadFaceLandmarkModel("models");
    var hidden_img = document.getElementById("avatar");
    await faceapi.detectAllFaces(hidden_img).withFaceLandmarks();
    console.log("loaded");
    full_load.style.display = "none";
};