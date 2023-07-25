// import { cookies } from "next/headers";
import { redirect } from "next/navigation";
// import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
// import { getCourses } from "../../lib/northpass";
import { getEmbeddingForTerm } from "../../lib/openai";
// import { indexCourses } from "../../lib/database";

export default function Page() {
  async function action(data) {
    "use server";

    const { term } = Object.fromEntries(data.entries());
    const termEmbedding = await getEmbeddingForTerm(term);

    console.log(termEmbedding);

    redirect("/");
  }

  return (
    <form action={action}>
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
