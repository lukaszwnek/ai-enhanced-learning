import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { getResults, getEmbeddingForTerm } from "../../lib/openai";
import { searchCourses } from "../../lib/database";

export default async function Page({ searchParams }) {
  async function search(term) {
    "use server";

    const supabase = createServerComponentClient({ cookies });
    const embedding = await getEmbeddingForTerm(term);
    const searchResults = await searchCourses({ supabase, embedding });
    const results = await getResults({ term, searchResults });
    return results;
  }

  if (searchParams.term) {
    const results = await search(searchParams.term);
    return (
      <div className="w-full">
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
      <div className="w-full">
				<div className="page-header">
					<div className="title">Search Courses</div>
					<a href="/" className="btn btn-blue">
						Go Back
					</a>
				</div>
      <form>
        <label className="label" htmlFor="term">
          Search Term
        </label>
        <input className="input" id="term" name="term" type="text" />
        <button className="btn btn-blue" type="submit">
          Search Courses!
        </button>
        </form>
      </div>
    );
  }
}
