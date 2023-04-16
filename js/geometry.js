async function calculate_landmarks() {
  full_load.style.display = "flex";
  circle_btn.disabled = true;
  circle_one_btn.disabled = true;
  center_btn.disabled = true;
  center_one_btn.disabled = true;
  load_bar.value = 0;
  // landmarks calculation
  images_landmarks = [];
  images_centers = [];
  images_translations = [];
  images_eyes_positions = [];
  images_scales = [];
  images_rotations = [];
  images_centered = [];
  for (let i = 0; i < hidden_images.length; i++) {
    var hidden_image = hidden_images[i];
    var image = images[i];
    landmarks = await get_landmarks(hidden_image);
    images_landmarks.push(landmarks);
    var left_eye = landmarks._positions.slice(36, 42);
    var right_eye = landmarks._positions.slice(42, 48);
    var left_eye_center = [0, 0];
    var right_eye_center = [0, 0];
    for (let j = 0; j < left_eye.length; j++) {
      left_eye_center[0] += left_eye[j]._x * image.width / hidden_image.width;
      left_eye_center[1] += left_eye[j]._y * image.height / hidden_image.height;
    }
    for (let j = 0; j < right_eye.length; j++) {
      right_eye_center[0] += right_eye[j]._x * image.width / hidden_image.width;
      right_eye_center[1] += right_eye[j]._y * image.height / hidden_image.height;
    }
    left_eye_center[0] /= left_eye.length;
    left_eye_center[1] /= left_eye.length;
    right_eye_center[0] /= right_eye.length;
    right_eye_center[1] /= right_eye.length;
    var eye_center = [
      (left_eye_center[0] + right_eye_center[0]) / 2,
      (left_eye_center[1] + right_eye_center[1]) / 2
    ];
    var eye_translation = [
      (left_eye_center[0] + right_eye_center[0]) / 2,
      (left_eye_center[1] + right_eye_center[1]) / 2
    ];
    var eye_distance = Math.sqrt(
      Math.pow(left_eye_center[0] - right_eye_center[0], 2) +
      Math.pow(left_eye_center[1] - right_eye_center[1], 2)
    );
    var eye_angle = Math.atan2(
      right_eye_center[1] - left_eye_center[1],
      right_eye_center[0] - left_eye_center[0]
    );
    images_centers.push(eye_center);
    images_translations.push(eye_translation);
    images_scales.push(eye_distance);
    images_rotations.push(eye_angle);
    load_bar.value = (i + 1) / hidden_images.length;
  }
  // normalization
  var mean_translation = [0, 0];
  var mean_scale = 0;
  for (let i = 0; i < images_centers.length; i++) {
    mean_translation[0] += images_translations[i][0];
    mean_translation[1] += images_translations[i][1];
    mean_scale += images_scales[i];
  }
  mean_translation[0] /= images_translations.length;
  mean_translation[1] /= images_translations.length;
  mean_scale /= images_scales.length;
  for (let i = 0; i < images_centers.length; i++) {
    images_translations[i][0] -= mean_translation[0];
    images_translations[i][1] -= mean_translation[1];
    images_scales[i] /= mean_scale;
  }
  // update interface
  load_bar.value = 1;
  circle_btn.disabled = false;
  circle_one_btn.disabled = false;
  center_btn.disabled = false;
  center_one_btn.disabled = false;
  full_load.style.display = "none";
}
