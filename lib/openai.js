import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export const getEmbeddingsForCourses = async (courses) => {
  return openai
    .createEmbedding({
      model: "text-embedding-ada-002",
      input: courses.map((course) => `${course.name} ${course.description}`),
    })
    .then((response) =>
      response.data.data.map((item) => ({
        name: courses[item.index].name,
        description: courses[item.index].description,
        image_url: courses[item.index].image_url,
        embedding: item.embedding,
      }))
    );
};
