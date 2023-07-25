import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export default async function Index() {
  const supabase = createServerComponentClient({ cookies });

  const { data: users } = await supabase.from("users").select("id");

  return (
    <ul className="my-auto">
      {users?.map((user) => (
        <li key={user.id}>{user.id}</li>
      ))}
    </ul>
  );
}
