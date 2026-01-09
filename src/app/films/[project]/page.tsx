import FilmControls from "@/components/Project/FilmControls";
import GalleryProject from "@/components/Project/GalleryProject";
import { client } from "@/lib/sanity/client";
import { PROJECT_QUERY } from "@/lib/queries";
import { extractVimeoIdAndToken, getVideoLink } from "@/lib/vimeo";
import React from "react";

type PageProps = {
  params: Promise<{ project: string }>;
};

// export const dynamic = "force-dynamic";
export const revalidate = 3600;

export default async function Page({ params }: PageProps) {
  const projectName = (await params).project;
  const data = await client.fetch(PROJECT_QUERY, { slug: projectName });
  const project = await data[0];

  const extractVimeoUrl = extractVimeoIdAndToken(project?.vimeoSrc) as {
    videoId: string;
    token: string;
  };

  const vimeoData = await getVideoLink(
    extractVimeoUrl.videoId,
    extractVimeoUrl.token,
  );

  const video720p =
    vimeoData?.play?.progressive.find(
      (video: { rendition: string; link: string }) =>
        video.rendition === "720p",
    ) || vimeoData?.play?.progressive[0];
  project.vimeoSrc = video720p?.link;

  const filmLinkVideo = {
    hls: vimeoData?.play?.hls.link,
    mp4: video720p?.link,
  };

  return (
    <div id={"film"}>
      {project && (
        <React.Fragment>
          <FilmControls
            title={project.title}
            informations={project.informations}
            vimeoLink={filmLinkVideo}
            videoZoom={project.video_zoom}
            coverImageUrl={project.coverImageUrl}
          />
          {project.video_informations && (
            <div className="w__film_informations">
              {project.video_informations.map(
                (
                  information: {
                    title: string;
                    description: string;
                  },
                  index: number,
                ) => (
                  <FilmDescription informations={information} key={index} />
                ),
              )}
            </div>
          )}

          <GalleryProject images={project.images} />
        </React.Fragment>
      )}
    </div>
  );
}

const FilmDescription = ({
  informations,
}: {
  informations: {
    title: string;
    description: string;
  };
}) => {
  return (
    <div className={"film_informations"}>
      <div className={"w__film_description_t"}>
        <h2>{informations.title}</h2>
      </div>
      <div className={"w__film_description_d"}>
        <p>{informations.description}</p>
      </div>
    </div>
  );
};
