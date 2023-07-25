import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { getCourses } from "../lib/northpass";

export default async function Index() {
  const supabase = createServerComponentClient({ cookies });

  const { data: users } = await supabase.from("users").select("api_key");
  const { api_key: apiKey } = users[0];

  const courses = await getCourses(apiKey);

  console.log(courses)

  return (
    <ul className="my-auto">
      {users?.map((user) => (
        <li key={user.id}>{user.id}</li>
      ))}
    </ul>
  );
}
