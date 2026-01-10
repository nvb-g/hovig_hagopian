import { Fragment } from "react";
import ContactInformations from "@/components/Contact/ContactInformations";
import { client } from "@/lib/sanity/client";
import { CONTACT_QUERY } from "@/lib/queries";

// export const dynamic = "force-dynamic";
export const revalidate = 86400;

export default async function Page() {
  const data = await client.fetch(CONTACT_QUERY);
  const contact = data[0];

  return (
    <Fragment>
      <div id="contact">
        <ContactInformations data={contact} />
      </div>
      <div className="w__contact_mention">
        <a
          href={"https://www.nicolasgiannantonio.com"}
          target={"_blank"}
          className={"contact_mention_t"}
        >
          Development and Design by Nicolas Giannantonio
        </a>
      </div>
      <div className="w_h"></div>
    </Fragment>
  );
}
