export const uploadImageToCloud = async (file) => {
  const response = await api[POST](`/api/storage/uploadFile`, file);
  return response.data.url;
};
