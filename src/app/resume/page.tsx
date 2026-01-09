import ResumeSection from "@/app/resume/ResumeSection";
import { RESUME_QUERY } from "@/lib/queries";
import { client } from "@/lib/sanity/client";

export const revalidate = 3600;

export default async function Page() {
  const data = await client.fetch(RESUME_QUERY);
  const sections = data[0].informations;

  return (
    <div id={"resume"}>
      {sections.map(
        (
          section: {
            title_section: string;
            resume: [{ title: string; subtitle: string }];
          },
          index: number,
        ) => (
          <ResumeSection
            key={index}
            content={section.resume}
            title={section.title_section}
          />
        ),
      )}
    </div>
  );
}
