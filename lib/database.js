export const indexCourses = async ({ supabase, coursesWithEmbeddings }) => {
  await supabase.from("courses").delete().neq("id", 0);
  return supabase.from("courses").insert(coursesWithEmbeddings);
};
