import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { getResults, getEmbeddingForTerm } from "../../lib/openai";
import { searchCourses } from "../../lib/database";

export default async function Page({ searchParams }) {
  const apiKey = cookies().get("apiKey")?.value;

  async function search(term) {
    "use server";

    const supabase = createServerComponentClient({ cookies });
    const embedding = await getEmbeddingForTerm(term);
    const searchResults = await searchCourses({ apiKey, supabase, embedding });
    const results = await getResults({ term, searchResults });
    return results;
  }

  if (searchParams.term) {
    const results = await search(searchParams.term);
    return (
      <div>
        <div className="page-header">
          <div className="title">Search Results</div>
          <a href="/search-courses" className="btn btn-blue">
            Go Back
          </a>
        </div>
        <ul className="courses-row">
          {results.map((result, index) => (
            <li key={index} className="course-card">
              <img src={result.image_url} />
              <div className="course-content">
                <div className="course-title">{result.name}</div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    );
  } else {
    return (
      <div className="container">
        <form>
          <label className="label" htmlFor="term">
            What are you looking for?
          </label>
          <input className="input" id="term" name="term" type="text" />
          <button className="btn btn-blue" type="submit">
            Search Courses
          </button>
        </form>
      </div>
    );
  }
}
