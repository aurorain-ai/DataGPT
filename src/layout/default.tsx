// home default layout
import { type ReactNode } from "react";
import Head from "next/head";
import DottedGridBackground from "../components/DottedGridBackground";
import clsx from "clsx";
import { useTranslation } from 'react-i18next';

interface LayoutProps {
  children: ReactNode;
  className?: string;
  centered?: boolean;
}

const DefaultLayout = (props: LayoutProps) => {
  const [ t ] = useTranslation();
  const description =
    t('AI copilot for data analytics, data engineering, and ML science.');
  return (
    <div
      className={clsx(
        "flex flex-col bg-gradient-to-b from-[#2B2B2B] to-[#1F1F1F]",
        props.centered && "items-center justify-center"
      )}
    >
      <Head>
        <title>DataGPT</title>
        <meta name="description" content={description} />
        <meta name="twitter:site" content="@luhuihu" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="DataGPT" />
        <meta name="twitter:description" content={description} />
        <meta
          name="twitter:image"
          content="https://github.com/aurorain-ai/DataGPT/blob/3a1afa1fefa5784a41243e2ebfc5c0971cd842f7/public/DataGPT.png"
        />
        <meta name="twitter:image:width" content="1280" />
        <meta name="twitter:image:height" content="640" />
        <meta
          property="og:title"
          content="DataGPT: Unifying big data and large ML models 🤖"
        />
        <meta
          property="og:description"
          content="AI copilot for data analytics, data engineering, and ML science."
        />
        <meta property="og:url" content="https://agentgpt.reworkd.ai/" />
        <meta
          property="og:image"
          content="https://github.com/aurorain-ai/DataGPT/blob/3a1afa1fefa5784a41243e2ebfc5c0971cd842f7/public/DataGPT.png"
        />
        <meta property="og:image:width" content="1280" />
        <meta property="og:image:height" content="640" />
        <meta property="og:type" content="website" />
        <meta
          name="google-site-verification"
          content="sG4QDkC8g2oxKSopgJdIe2hQ_SaJDaEaBjwCXZNkNWA"
        />
        <link rel="icon" href="/day1.ico" />
      </Head>
      <DottedGridBackground
        className={clsx("min-w-screen min-h-screen", props.className)}
      >
        {props.children}
      </DottedGridBackground>
    </div>
  );
};

export default DefaultLayout;
