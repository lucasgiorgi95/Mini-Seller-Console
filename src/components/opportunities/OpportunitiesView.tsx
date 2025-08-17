import React from 'react';
import { useTranslation } from 'react-i18next';
import { Loader2, Plus, DollarSign, Target, TrendingUp } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';

export const OpportunitiesView: React.FC = () => {
  const { t } = useTranslation();
  const { opportunities, isLoading } = useApp();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full py-20">
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-50 rounded-xl flex items-center justify-center mx-auto mb-6 border border-blue-100">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {t('loadingOpportunities')}
          </h3>
          <p className="text-gray-500">{t('loadingOpportunitiesMessage')}</p>
        </div>
      </div>
    );
  }

  const totalValue = opportunities?.reduce((acc, opp) => acc + (opp.amount || 0), 0) || 0;
  const opportunityCount = opportunities?.length || 0;

  return (
    <div className="h-full flex bg-gray-50">
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 bg-white border-b border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900 mb-1">{t('opportunities')}</h1>
              <p className="text-sm text-gray-600">
                {t('activeOpportunities', { count: opportunities?.length || 0 })}
              </p>
            </div>
            <button className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors">
              <Plus className="h-4 w-4 mr-2" />
              {t('addOpportunity')}
            </button>
          </div>
          
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg p-4 border border-gray-200 hover:border-blue-200 transition-colors">
              <div className="flex items-center">
                <div className="p-2.5 rounded-lg bg-green-50 text-green-600 border border-green-100">
                  <DollarSign className="h-5 w-5" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500 mb-0.5">{t('totalValue')}</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    ${totalValue.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg p-4 border border-gray-200 hover:border-blue-200 transition-colors">
              <div className="flex items-center">
                <div className="p-2.5 rounded-lg bg-blue-50 text-blue-600 border border-blue-100">
                  <Target className="h-5 w-5" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500 mb-0.5">{t('opportunityCount')}</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {opportunityCount}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg p-4 border border-gray-200 hover:border-blue-200 transition-colors">
              <div className="flex items-center">
                <div className="p-2.5 rounded-lg bg-amber-50 text-amber-600 border border-amber-100">
                  <TrendingUp className="h-5 w-5" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500 mb-0.5">{t('pipelineValue')}</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    ${totalValue.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Opportunities List */}
        <div className="flex-1 overflow-auto p-6">
          {opportunities?.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-lg border border-gray-200">
              <div className="max-w-md mx-auto">
                <div className="w-16 h-16 bg-blue-50 rounded-xl flex items-center justify-center mx-auto mb-6 border border-blue-100">
                  <Target className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {t('noOpportunities')}
                </h3>
                <p className="text-gray-500 mb-6">
                  {t('noOpportunitiesMessage')}
                </p>
              </div>
            </div>
          ) : (
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Nombre
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Cuenta
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Etapa
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Monto
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Fecha
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {opportunities.map((opp) => (
                      <tr key={opp.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{opp.name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{opp.accountName}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            opp.stage === 'closed-won' ? 'bg-green-100 text-green-800' :
                            opp.stage === 'closed-lost' ? 'bg-red-100 text-red-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {t(opp.stage, opp.stage)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          ${opp.amount?.toLocaleString() || '0'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(opp.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
