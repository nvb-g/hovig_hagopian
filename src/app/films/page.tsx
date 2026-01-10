import { ALL_PROJECT_QUERY } from "@/lib/queries";
import { client } from "@/lib/sanity/client";
import AllProjects from "@/components/Projects/AllProjects";

// export const dynamic = "force-dynamic";
export const revalidate = 86400;

export default async function Home() {
  const selected = await client.fetch(ALL_PROJECT_QUERY);

  return (
    <div className={"w__all__projects"}>
      <div className="all__projects">
        <AllProjects selected={selected} />
      </div>
    </div>
  );
}
