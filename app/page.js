import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { getCourses } from "../lib/northpass";
import { getEmbeddingsForCourses } from "../lib/openai";
import { indexCourses } from "../lib/database";

export default async function Index() {
  const apiKey = cookies().get("apiKey")?.value;

  async function handleSettingApiKey(data) {
    "use server";
    const { apiKey } = Object.fromEntries(data);
    cookies().set("apiKey", apiKey);
  }

  async function handleLogout() {
    "use server";
    cookies().set("apiKey", null);
  }

  async function handleCourseIndexing() {
    "use server";

    const supabase = createServerComponentClient({ cookies });
    const courses = await getCourses(apiKey);
    const coursesWithEmbeddings = await getEmbeddingsForCourses(courses);
    await indexCourses({ apiKey, supabase, coursesWithEmbeddings });

    redirect("/");
  }

  return (
    <div>
      <div className="homepage-title">AI Enhanced Search</div>

      {apiKey ? (
        <div className="homepage-buttons-container">
          <form action={handleCourseIndexing}>
            <button className="btn btn-blue mr-4" type="submit">
              Index Courses
            </button>
          </form>
          <a href="/search-courses" className="btn btn-blue mr-4">
            Search Courses
          </a>
          <form action={handleLogout}>
            <button className="btn btn-blue" type="submit">
              Log out
            </button>
          </form>
        </div>
      ) : (
        <form action={handleSettingApiKey}>
          <label className="label" htmlFor="apiKey">
            Please enter your API Key:
          </label>
          <input className="input" id="apiKey" name="apiKey" type="text" />
          <button className="btn btn-blue" type="submit">
            Submit
          </button>
        </form>
      )}
    </div>
  );
}
