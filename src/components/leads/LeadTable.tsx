import React from "react";
import { useTranslation } from "react-i18next";
import {
  Mail,
  Building,
  Star,
  TrendingUp,
  User,
  Globe,
  Target,
  Zap,
  Award,
  Eye,
} from "lucide-react";
import { Badge } from "../ui/Badge";
import { useApp, type Lead } from "../../contexts/AppContext";

interface LeadTableProps {
  leads: Lead[];
}

export const LeadTable: React.FC<LeadTableProps> = ({ leads }) => {
  const { t } = useTranslation();
  const { setSelectedLead } = useApp();

  const getStatusVariant = (status: Lead["status"]) => {
    switch (status) {
      case "new":
        return "default";
      case "contacted":
        return "warning";
      case "qualified":
        return "success";
      case "unqualified":
        return "error";
      default:
        return "secondary";
    }
  };

  const getScoreIcon = (score: number) => {
    if (score >= 90) return <Award className="w-4 h-4" />;
    if (score >= 80) return <TrendingUp className="w-4 h-4" />;
    if (score >= 60) return <Target className="w-4 h-4" />;
    return <Zap className="w-4 h-4" />;
  };

  const getSourceIcon = (source: string) => {
    switch (source) {
      case "website":
        return <Globe className="w-3 h-3 text-primary" />;
      case "referral":
        return <User className="w-3 h-3 text-success" />;
      case "social_media":
        return <Star className="w-3 h-3 text-warning" />;
      case "email_campaign":
        return <Mail className="w-3 h-3 text-secondary" />;
      case "trade_show":
        return <Building className="w-3 h-3 text-error" />;
      default:
        return <Globe className="w-3 h-3 text-text-muted" />;
    }
  };

  if (leads.length === 0) {
    return (
      <div className="text-center py-24">
        <div className="max-w-md mx-auto">
          <div className="w-16 h-16 bg-blue-50 rounded-xl flex items-center justify-center mx-auto mb-6 border border-blue-100">
            <Target className="w-8 h-8 text-blue-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {t("noLeadsFound")}
          </h3>
          <p className="text-gray-500">
            Intenta ajustar los filtros de búsqueda para encontrar leads
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span>{t("name")}</span>
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                <div className="flex items-center gap-2">
                  <Building className="w-4 h-4" />
                  <span>{t("company")}</span>
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  <span>{t("email")}</span>
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  <span>{t("score")}</span>
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-200 uppercase tracking-wider">
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4" />
                  <span className="text-gray-100 dark:text-gray-200">{t("status")}</span>
                </div>
              </th>
              <th className="px-6 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {leads.map((lead, index) => (
              <tr
                key={lead.id}
                onClick={() => setSelectedLead(lead)}
                className="cursor-pointer transition-all duration-200 hover:bg-gray-50 group"
                style={{ animationDelay: `${index * 30}ms` }}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                      <User className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                        {lead.name}
                      </div>
                      <div className="text-xs flex items-center gap-1.5 mt-1 text-gray-500">
                        {getSourceIcon(lead.source)}
                        <span className="capitalize">{lead.source.replace("_", " ")}</span>
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-purple-50 dark:bg-purple-900/30 flex items-center justify-center">
                      <Building className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                    </div>
                    <span className="text-gray-900 dark:text-white font-medium">
                      {lead.company}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-orange-50 dark:bg-orange-900/30 flex items-center justify-center">
                      <Mail className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                    </div>
                    <span className="text-gray-600 dark:text-gray-300 font-normal">{lead.email}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        lead.score >= 80 
                          ? 'bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400' 
                          : lead.score >= 60 
                            ? 'bg-yellow-50 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400' 
                            : 'bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400'
                      }`}>
                        {getScoreIcon(lead.score)}
                      </div>
                      <span className={`font-semibold ${
                        lead.score >= 80 
                          ? 'text-green-600 dark:text-green-400' 
                          : lead.score >= 60 
                            ? 'text-yellow-600 dark:text-yellow-400' 
                            : 'text-red-600 dark:text-red-400'
                      }`}>
                        {lead.score}
                      </span>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      lead.status === 'qualified' 
                        ? 'bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400' 
                        : lead.status === 'contacted' 
                          ? 'bg-yellow-50 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400' 
                          : lead.status === 'new'
                            ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                            : 'bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400'
                    }`}>
                      <Target className="w-4 h-4" />
                    </div>
                    <Badge
                      variant={getStatusVariant(lead.status)}
                      size="lg"
                      dot={true}
                      className="animate-scale-in font-bold text-white"
                    >
                      {t(lead.status)}
                    </Badge>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <button 
                    className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedLead(lead);
                    }}
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-3 p-4">
        {leads.map((lead, index) => (
          <div
            key={lead.id}
            onClick={() => setSelectedLead(lead)}
            className="bg-white rounded-xl p-4 border border-gray-200 cursor-pointer transition-all duration-200 hover:border-blue-200 hover:shadow-md"
            style={{ animationDelay: `${index * 30}ms` }}
          >
            {/* Header */}
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                  <User className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">
                    {lead.name}
                  </h3>
                  <div className="flex items-center text-xs text-gray-600 mt-0.5">
                    <Building className="w-3.5 h-3.5 mr-1.5 text-gray-400" />
                    {lead.company}
                  </div>
                </div>
              </div>

              {/* Score */}
              <div className="flex items-center gap-2">
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                  lead.score >= 80 
                    ? 'bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400' 
                    : lead.score >= 60 
                      ? 'bg-yellow-50 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400' 
                      : 'bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400'
                }`}>
                  {getScoreIcon(lead.score)}
                </div>
                <span className={`font-semibold ${
                  lead.score >= 80 
                    ? 'text-green-600 dark:text-green-400' 
                    : lead.score >= 60 
                      ? 'text-yellow-600 dark:text-yellow-400' 
                      : 'text-red-600 dark:text-red-400'
                }`}>
                  {lead.score}
                </span>
              </div>
            </div>

            {/* Email */}
            <div className="flex items-center gap-2 mb-4 px-3 py-2 bg-gray-50 rounded-lg text-sm">
              <Mail className="w-4 h-4 text-gray-400" />
              <span className="text-gray-600 truncate">{lead.email}</span>
            </div>

            {/* Footer */}
            <div className="flex justify-between items-center pt-3 border-t border-gray-100">
              <Badge
                variant={getStatusVariant(lead.status)}
                dot={true}
                size="sm"
                className="text-xs text-white"
              >
                {t(lead.status)}
              </Badge>

              <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 px-2 py-1 rounded-lg">
                {getSourceIcon(lead.source)}
                <span className="capitalize">{lead.source.replace("_", " ")}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LeadTable;