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

  await supabase.from("courses").delete().eq("school_id", schoolId);
  return supabase.from("courses").insert(coursesToIndex);
};

export const searchCourses = async ({ apiKey, supabase, embedding }) => {
  const { data: courses } = await supabase.rpc("match_courses", {
    school_api_key: apiKey,
    query_embedding: embedding,
    match_threshold: 0.75,
    match_count: 2,
  });

  return courses.reduce((acc, course) => ({ ...acc, [course.id]: course }), {});
};
