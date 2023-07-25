export const indexCourses = async ({ supabase, coursesWithEmbeddings }) => {
  await supabase.from("courses").delete().neq("id", 0);
  return supabase.from("courses").insert(coursesWithEmbeddings);
};

export const searchCourses = async ({ supabase, embedding }) => {
  const { data: courses } = await supabase.rpc("match_courses", {
    query_embedding: embedding,
    match_threshold: 0,
    match_count: 10,
  });

  return courses;
};
