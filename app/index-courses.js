import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { getCourses } from "../lib/northpass";
import { getEmbeddingsForCourses } from "../lib/openai";
import { indexCourses } from "../lib/database";

export default async function IndexCourses() {
  const supabase = createServerComponentClient({ cookies });

  const apiKey = null;
  const courses = await getCourses(apiKey);
  const coursesWithEmbeddings = await getEmbeddingsForCourses(courses);

  await indexCourses({ supabase, coursesWithEmbeddings });

  // console.log(embeddings)

  return null;
}
