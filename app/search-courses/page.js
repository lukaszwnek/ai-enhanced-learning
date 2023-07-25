import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { getEmbeddingForTerm } from "../../lib/openai";
import { searchCourses } from "../../lib/database";

export default async function Page({ searchParams }) {
  async function search(term) {
    "use server";

    const supabase = createServerComponentClient({ cookies });
    const embedding = await getEmbeddingForTerm(term);
    const results = await searchCourses({ supabase, embedding });
    return results;
  }

  if (searchParams.term) {
    const results = await search(searchParams.term);
    return (
      <ul>
        {results.map((result) => (
          <li key={result.id}>
            {result.name}, value: {result.similarity}
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
