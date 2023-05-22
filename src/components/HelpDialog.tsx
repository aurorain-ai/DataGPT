import React from "react";
import { useTranslation } from "next-i18next";
import { FaDiscord, FaGithub, FaTwitter } from "react-icons/fa";
import Dialog from "./Dialog";

export default function HelpDialog({
  show,
  close,
}: {
  show: boolean;
  close: () => void;
}) {
  const [ t ] = useTranslation();
  return (
    <Dialog header={`${t('Welcome To DataGPT')} 🚀`} isShown={show} close={close}>
      <div className="text-md relative flex-auto p-2 leading-relaxed">
        <p>
          <strong>DataGPT</strong> {t(' is a platform unifying Big Data and Large ML models, one platform for all data platforms and large ML models, and an AI copilot for data analytics, data engineering, and ML science. 🤖')}
        </p>
        <div>
          <br />
          {t('This platform is currently in stealth mode, we are actively working on:')}
          <ul className="ml-5 list-inside list-disc">
            <li>{`${t('ONE_PLATFORM')} 🌐`}</li>
            <li>{`${t('AI_ENHANCED_DA')} 👨‍👩‍👦`}</li>
            <li>{`${t('VECTORDB_CACHING')} 🧠`}</li>
          </ul>
          <br />
          <p className="mt-2">{t('Follow the journey below:')}</p>
        </div>
        <div className="mt-4 flex w-full items-center justify-center gap-5">
        <div
            className="cursor-pointer rounded-full bg-black/30 p-3 hover:bg-black/70"
            onClick={() =>
              window.open("https://github.com/aurorain-ai/DataGPT", "_blank")
            }
          >
            <FaGithub size={30} />
          </div>
          <div
            className="cursor-pointer rounded-full bg-black/30 p-3 hover:bg-black/70"
            onClick={() =>
              window.open("https://discord.gg/aurorain", "_blank")
            }
          >
            <FaDiscord size={30} />
          </div>
          <div
            className="cursor-pointer rounded-full bg-black/30 p-3 hover:bg-black/70"
            onClick={() =>
              window.open(
                "https://twitter.com/aurorain-ai",
                "_blank"
              )
            }
          >
            <FaTwitter size={30} />
          </div>
        </div>
      </div>
    </Dialog>
  );
}
