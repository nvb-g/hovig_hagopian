import type {Metadata} from "next";
import "../styles/main.scss";

import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import Reperes from "@/components/Utils/Reperes";
import {CONTACT_QUERY, META_QUERY, TITLE_QUERY} from "@/lib/queries";
import {client} from "@/lib/sanity/client";
import Loader from "@/components/Loader";
import {ReactLenis} from "lenis/react";
import {unstable_cache} from "next/cache";

const getMetadata = unstable_cache(
    async () => client.fetch(META_QUERY),
    ["meta"],
    {revalidate: 86400}
);

const getNavData = unstable_cache(
    async () => {
        const [navTitles, contactData] = await Promise.all([
            client.fetch(TITLE_QUERY),
            client.fetch(CONTACT_QUERY),
        ]);
        return {navTitles, contact: contactData[0].contact_hovig};
    },
    ["nav-data"],
    {revalidate: 86400}
);

export async function generateMetadata(): Promise<Metadata> {
    const meta = await getMetadata();

    return {
        title: meta[0].title,
        description: meta[0].description,
        openGraph: {
            type: "website",
            url: meta[0].url,
            title: meta[0].title,
            description: meta[0].description,
            images: [
                {
                    url: meta[0].meta_image.asset.url,
                    alt: meta[0].title,
                },
            ],
        },
    };
}

export default async function RootLayout({
                                             children,
                                         }: Readonly<{
    children: React.ReactNode;
}>) {
    const {navTitles, contact} = await getNavData();

    return (
        <html lang="en">
        <body>
        <Loader/>
        <Reperes/>
        <Navigation contactInfo={contact} navTitles={navTitles}/>
        <ReactLenis
            root
            options={{
                lerp: 0.3,
                duration: 0.4,
            }}
        >
            <div id="App">
                <main>{children}</main>
                <Footer/>
            </div>
        </ReactLenis>
        </body>
        </html>
    );
}
