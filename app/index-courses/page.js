import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { getCourses } from "../../lib/northpass";
import { getEmbeddingsForCourses } from "../../lib/openai";
import { indexCourses } from "../../lib/database";

export default function Page() {
  async function action(data) {
    "use server";

    const { apiKey } = Object.fromEntries(data.entries());
    const supabase = createServerComponentClient({ cookies });
    const courses = await getCourses(apiKey);
    const coursesWithEmbeddings = await getEmbeddingsForCourses(courses);
    await indexCourses({ supabase, coursesWithEmbeddings });

    redirect("/");
  }

  return (
  <div className="w-full">
    <div className="page-header">
      <div className="title">Index Courses</div>
      <a href="/" className="btn btn-blue">
        Go Back
      </a>
    </div>
      <form action={action}>
        <label className="label" htmlFor="apiKey">
          Api Key
        </label>
        <input className="input" id="apiKey" name="apiKey" type="text" />
        <button className="btn btn-blue" type="submit">
          Index Courses!
        </button>
      </form>
    </div>
  );
}
