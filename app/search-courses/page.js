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
    const results =
      searchResults.length > 0 ? await getResults({ term, searchResults }) : [];
    return results;
  }

  if (searchParams.term) {
    const results = await search(searchParams.term);
    return (
      <ul>
        {results.map((result, index) => (
          <li key={index}>
            {result.name}, relevance: {result.relevance}
          </li>
        ))}
      </ul>
    );
  } else {
    return (
      <form>
        <label className="label" htmlFor="term">
          Search Term
        </label>
        <input className="input" id="term" name="term" type="text" />
        <button className="btn btn-blue" type="submit">
          Search Courses!
        </button>
      </form>
    );
  }
}
