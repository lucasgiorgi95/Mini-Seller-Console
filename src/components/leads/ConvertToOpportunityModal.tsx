import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '../ui/Button';
import { Loader2 } from 'lucide-react';
import type { Lead, Opportunity } from '../../shared/types';

interface ConvertToOpportunityButtonProps {
  lead: Lead;
  onConvert: (opportunity: Omit<Opportunity, 'id' | 'createdAt' | 'leadId'>) => Promise<void>;
}

export const ConvertToOpportunityButton: React.FC<ConvertToOpportunityButtonProps> = ({
  lead,
  onConvert,
}) => {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);

  const handleConvert = async () => {
    setIsLoading(true);
    try {
      const opportunityData = {
        name: `${lead.company} Opportunity`,
        stage: 'prospecting' as const,
        amount: 0,
        accountName: lead.company,
      };
      await onConvert(opportunityData);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      type="button"
      onClick={handleConvert}
      disabled={isLoading}
      className="w-full sm:w-auto"
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          {t('converting', 'Convirtiendo...')}
        </>
      ) : (
        t('convertToOpportunity', 'Convertir a Oportunidad')
      )}
    </Button>
  );
};

export default ConvertToOpportunityButton;
