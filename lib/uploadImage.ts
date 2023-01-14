import axios from 'axios';

export const uploadToCloudinary = async (image: File) => {
  const cloudinaryUrl = 'https://api.cloudinary.com/v1_1/dhg6qcy9a/upload';
  const formData = new FormData();
  formData.append('file', image);
  formData.append('upload_preset', 'xb6hrvzg'); //replace with your preset from cloudinary
  try {
    const response = await axios.post(cloudinaryUrl, formData);
    const imageUrl = response.data.secure_url;
    return imageUrl;
  } catch (error) {
    console.log(error);
  }
};
