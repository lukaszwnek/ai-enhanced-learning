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

export const getEmbeddingForTerm = async (term) => {
  return openai
    .createEmbedding({
      model: "text-embedding-ada-002",
      input: [term],
    })
    .then((response) => response.data.data.map((item) => item.embedding)[0]);
};

export const getResults = async ({ term, searchResults }) => {
  const prompt = `
      You are a search engine for courses in a Learning Management System. You are given the following search term: ${term}.
      You are searching through the following courses:

      ${searchResults.map(
        (result, index) =>
          `\n${index + 1}. Course name: ${result.name}. Course description: ${
            result.description
          }.`
      )}

      Return the list of courses but only for courses that are relevant to the search term. Don't include irrelevant courses.
      It's possible that multiple courses are relevant.
      Return the relevant courses as a JSON array with the following structure: [{ "name": "string", "relevance": "float"}].
      Don't prepend the word Answer to the response.
    `;

  const completionResponse = await openai.createCompletion({
    model: "text-davinci-003",
    prompt,
    max_tokens: 512,
    temperature: 0,
  });

  const {
    choices: [{ text }],
  } = completionResponse.data;

  return JSON.parse(text);
};
