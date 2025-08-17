import React from 'react';
import { useTranslation } from 'react-i18next';
import { Building, Star } from 'lucide-react';
import { type Lead } from '../../contexts/AppContext';
import { Badge } from '../ui/Badge';

interface LeadRowProps {
  lead: Lead;
  onClick: () => void;
}

export const LeadRow: React.FC<LeadRowProps> = ({ lead, onClick }) => {
  const { t } = useTranslation();

  const getStatusVariant = (status: Lead['status']) => {
    switch (status) {
      case 'new': return 'default';
      case 'contacted': return 'warning';
      case 'qualified': return 'success';
      case 'unqualified': return 'error';
      default: return 'secondary';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-success';
    if (score >= 60) return 'text-warning';
    return 'text-error';
  };

  return (
    <tr
      onClick={onClick}
      className="hover:bg-gray-50 cursor-pointer transition-colors border-b border-gray-100 last:border-none"
    >
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="flex-shrink-0 h-10 w-10 rounded-lg bg-blue-50 flex items-center justify-center border border-blue-100">
            <span className="text-blue-600 font-semibold text-sm">
              {lead.name.split(' ').map(n => n[0]).join('').toUpperCase()}
            </span>
          </div>
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900 group-hover:text-blue-600">{lead.name}</div>
            <div className="text-sm text-gray-500 flex items-center sm:hidden mt-1.5">
              <Building className="w-3.5 h-3.5 mr-1.5 text-gray-400" />
              {lead.company}
            </div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 hidden sm:table-cell">
        <div className="text-sm text-gray-700 flex items-center">
          <Building className="w-3.5 h-3.5 mr-2 text-gray-400" />
          {lead.company}
        </div>
      </td>
      <td className="px-6 py-4 hidden lg:table-cell">
        <div className="text-sm text-gray-600">{lead.email}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center bg-gray-50 rounded-full px-3 py-1 w-fit">
          <Star className={`w-4 h-4 mr-1.5 ${getScoreColor(lead.score)}`} />
          <span className={`text-sm font-medium ${getScoreColor(lead.score)}`}>
            {lead.score}
          </span>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <Badge 
          variant={getStatusVariant(lead.status)} 
          className="capitalize px-3 py-1"
        >
          {t(lead.status) || lead.status}
        </Badge>
      </td>
    </tr>
  );
};