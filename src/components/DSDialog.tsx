import React from "react";
import { useTranslation } from "next-i18next";
import { FaDiscord, FaGithub, FaTwitter } from "react-icons/fa";
import Dialog from "./Dialog";

export default function DSDialog({
  show,
  close,
}: {
  show: boolean;
  close: () => void;
}) {
  const [ t ] = useTranslation();
  return (
    <Dialog header={`${t('Configure Data Sources')}`} isShown={show} close={close}>
      <div className="text-md relative flex-auto p-2 leading-relaxed">
        <div>
          {t('This platform supports the following data sources. Please select and configure.')}
          <ul className="ml-5 list-inside list-disc">
            <li style={{ color: 'white', fontSize: '22px' }}>🌐 Snowflake</li>
            <li style={{ color: 'white', fontSize: '22px' }}>🌐 Redshift</li>
            <li style={{ color: 'white', fontSize: '22px' }}>🌐 BigQuery</li>
            <li style={{ color: 'white', fontSize: '22px' }}>🌐 Databricks Lakehouse</li>
            <li style={{ color: 'white', fontSize: '22px' }}>🌐 Azure Synapse</li>
            <li style={{ color: 'white', fontSize: '22px' }}>🌐 Oracle Exadata</li>
            <li style={{ color: 'white', fontSize: '22px' }}>🌐 IBM Netezza</li>
            <li style={{ color: 'white', fontSize: '22px' }}>🌐 SAP Datasphere</li>
            <li style={{ color: 'white', fontSize: '22px' }}>🌐 Teradata Vantage</li>
          </ul>
          <br />
        </div>
      </div>
    </Dialog>
  );
}
