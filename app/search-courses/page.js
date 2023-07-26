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
    return results.map((result) => {
      return {
        ...result,
        image_url: searchResults.find(e =>
          e.id == result.id
        ).image_url
      }
    });
  }

  if (searchParams.term) {
    const results = await search(searchParams.term);
    return (
			<div className="w-full">
				<div className="page-header">
					<div className="title">Search Results</div>
					<a href="/" className="btn btn-blue">
						Go Back
					</a>
				</div>
				<ul className="courses-row">
					{results.map((result, index) => (
						<li key={index} className="course-card">
							<img src={result.image_url} />
							<div className="course-content">
								<div className="course-title">{result.name}</div>
								<div className="course-revelance">
									Relevance: {result.relevance}
								</div>
							</div>
						</li>
					))}
				</ul>
			</div>
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
