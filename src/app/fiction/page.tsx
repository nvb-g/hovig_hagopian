import Projects from "@/components/Projects/Projects";
import { PROJECTS_QUERY } from "@/lib/queries";
import { client } from "@/lib/sanity/client";
import { extractVimeoIdAndToken, getVideoLink } from "@/lib/vimeo";

export const revalidate = 3600;
// export const dynamic = "force-dynamic";

export default async function Home() {
  const selected = await client.fetch(PROJECTS_QUERY, {
    projects: "fiction",
  });
  const projects = selected[0].projects || [];

  await Promise.all(
    projects.map(
      async (project: {
        project: {
          hover_video: string;
        };
      }) => {
        const vimeoInfo = extractVimeoIdAndToken(project.project.hover_video);
        const link = await getVideoLink(vimeoInfo.videoId, vimeoInfo.token);

        const video720p =
          link?.play?.progressive.find(
            (video: { rendition: string; link: string }) =>
              video.rendition === "720p",
          ) || link?.play?.progressive[0];

        project.project.hover_video = video720p?.link;
      },
    ),
  );

  return (
    <div>
      <Projects data={projects} name={selected[0].title || "Selected"} />
    </div>
  );
}
