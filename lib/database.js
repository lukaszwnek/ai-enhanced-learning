export const indexCourses = async ({
  apiKey,
  supabase,
  coursesWithEmbeddings,
}) => {
  await supabase.from("schools").insert({ api_key: apiKey });
  const {
    data: [{ id: schoolId }],
  } = await supabase.from("schools").select().eq("api_key", apiKey);

  const coursesToIndex = coursesWithEmbeddings.map((course) => ({
    ...course,
    school_id: schoolId,
  }));

  await supabase.from("courses").delete().neq("id", 0);
  return supabase.from("courses").insert(coursesToIndex);
};

export const searchCourses = async ({ supabase, embedding }) => {
  const { data: courses } = await supabase.rpc("match_courses", {
    query_embedding: embedding,
    match_threshold: 0.75,
    match_count: 2,
  });

  return courses.reduce((acc, course) => ({ ...acc, [course.id]: course }), {});
};
