export const getCourses = async (apiKey) => {
  const options = {
    method: "GET",
    headers: { accept: "application/json", "X-Api-Key": apiKey },
  };

  return fetch(
    "https://api.northpass.com/v2/courses?filter[status][in][]=live&limit=100",
    options
  )
    .then((response) => response.json())
    .then((response) => {
      return response.data.map((item) => {
        return {
          name: item.attributes.name,
          description: item.attributes.short_description,
          image_url: item.attributes.list_image_url
        }
      })
    })
    .catch((err) => console.error(err));
};
