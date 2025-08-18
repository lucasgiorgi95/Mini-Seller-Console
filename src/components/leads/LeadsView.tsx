import React from 'react';
import { useTranslation } from 'react-i18next';
import { Loader2, Users, Award, TrendingUp, Plus } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { useLeads } from '../../hooks/useLeads';
import { LeadsList } from './LeadsList';
import { LeadDetailPanel } from './LeadDetailPanel';

export const LeadsView: React.FC = () => {
  const { t } = useTranslation();
  const { selectedLead, setSelectedLead, isLoading } = useApp();
  const { leads, statusCounts } = useLeads();
  const totalLeads = leads.length;
  const filteredCount = statusCounts.all;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full py-20">
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-50 rounded-xl flex items-center justify-center mx-auto mb-6 border border-blue-100">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {t('loadingLeads')}
          </h3>
          <p className="text-gray-500">{t('loadingLeadsMessage')}</p>
        </div>
      </div>
    );
  }

  // Manejar la selección de un lead
  const handleSelectLead = (lead: any) => {
    setSelectedLead(lead);
  };

  return (
    <div className="h-full flex bg-gray-50 relative">
      {/* Panel de detalles del lead */}
      {selectedLead && (
        <LeadDetailPanel
          lead={selectedLead}
          onClose={() => setSelectedLead(null)}
        />
      )}
      
      {/* Contenido principal */}
      <div className={`flex-1 flex flex-col overflow-hidden ${selectedLead ? 'opacity-50 pointer-events-none' : ''}`}>
        {/* Header */}
        <div className="px-6 py-4 bg-white border-b border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900 mb-1">{t('leads')}</h1>
              <p className="text-sm text-gray-600">
                {filteredCount === totalLeads 
                  ? t('totalLeads', { count: totalLeads })
                  : t('filteredLeads', { filtered: filteredCount, total: totalLeads })
                }
              </p>
            </div>
            <div className="flex space-x-3">
             
              <button 
                className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                onClick={() => {
                  setSelectedLead({
                    id: 'new',
                    name: '',
                    company: '',
                    email: '',
                    source: 'web',
                    score: 50,
                    status: 'new',
                  });
                }}
              >
                <Plus className="h-4 w-4 mr-2" />
                {t('addLead')}
              </button>
            </div>
          </div>
          
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg p-4 border border-gray-200 hover:border-blue-200 transition-colors">
              <div className="flex items-center">
                <div className="p-2.5 rounded-lg bg-blue-50 text-blue-600 border border-blue-100">
                  <Users className="h-5 w-5" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500 mb-0.5">{t('totalLeadsTitle', 'Total de Leads')}</p>
                  <p className="text-2xl font-semibold text-gray-900">{totalLeads}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg p-4 border border-gray-200 hover:border-green-200 transition-colors">
              <div className="flex items-center">
                <div className="p-2.5 rounded-lg bg-green-50 text-green-600 border border-green-100">
                  <Award className="h-5 w-5" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500 mb-0.5">{t('qualified', 'Calificados')}</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {statusCounts.qualified || 0}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg p-4 border border-gray-200 hover:border-amber-200 transition-colors">
              <div className="flex items-center">
                <div className="p-2.5 rounded-lg bg-amber-50 text-amber-600 border border-amber-100">
                  <TrendingUp className="h-5 w-5" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500 mb-0.5">{t('averageScore', 'Puntuación Promedio')}</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {leads.length > 0 
                      ? Math.round(leads.reduce((acc, lead) => acc + lead.score, 0) / leads.length)
                      : 0}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Lista de leads */}
        <div className="flex-1 overflow-hidden">
          <LeadsList onSelectLead={handleSelectLead} />
        </div>
      </div>
    </div>
  );
};