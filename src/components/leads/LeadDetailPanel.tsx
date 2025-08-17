import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { X } from "lucide-react";
import { useApp, type Lead } from "../../contexts/AppContext";
import type { Opportunity } from "../../shared/types";
import { useNotifications } from "../../contexts/NotificationContext";
import { Button } from "../ui/Button";
import { Select } from "../ui/Select";
import { Badge } from "../ui/Badge";
import { Input } from "../ui/Input";
import { ConvertToOpportunityButton } from "./ConvertToOpportunityModal";

interface LeadDetailPanelProps {
  lead: Lead | null;
  onClose: () => void;
}

export const LeadDetailPanel: React.FC<LeadDetailPanelProps> = ({
  lead,
  onClose,
}) => {
  const { t } = useTranslation();
  const { updateLead, addOpportunity, addLeads } = useApp();
  const { success, error } = useNotifications();
  const [editForm, setEditForm] = useState<Partial<Lead>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [isNewLead, setIsNewLead] = useState(false);

  const statusOptions = [
    { value: "new", label: t("new") },
    { value: "contacted", label: t("contacted") },
    { value: "qualified", label: t("qualified") },
    { value: "unqualified", label: t("unqualified") },
  ];

  useEffect(() => {
    if (lead) {
      const isNew = lead.id === 'new';
      setIsNewLead(isNew);
      setEditForm({
        name: lead.name || '',
        email: lead.email || '',
        company: lead.company || '',
        status: lead.status || 'new',
        source: lead.source || 'web',
        score: lead.score || 50,
      });
      setErrors({});
    }
  }, [lead]);


  if (!lead) return null;

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSave = async () => {
    const newErrors: Record<string, string> = {};

    if (!editForm.name?.trim()) {
      newErrors.name = t("nameRequired", "Nombre es requerido");
    }

    if (!editForm.email) {
      newErrors.email = t("emailRequired", "Email es requerido");
    } else if (!validateEmail(editForm.email)) {
      newErrors.email = t("invalidEmail", "Email no válido");
    }

    if (!editForm.status) {
      newErrors.status = t("statusRequired", "Estado es requerido");
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setIsSaving(true);
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 700));

        if (isNewLead) {
          // Create new lead
          const newLead = {
            name: editForm.name || '',
            email: editForm.email || '',
            company: editForm.company || '',
            status: editForm.status as 'new' | 'contacted' | 'qualified' | 'unqualified',
            source: editForm.source as 'web' | 'social' | 'referral' | 'event' | 'other',
            score: editForm.score || 50,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
        
          await addLeads([newLead]);
          success(
            t("leadCreated", "¡Lead creado!"),
            t("leadCreatedMessage", "El lead se ha creado correctamente")
          );
          onClose();
        } else {
          // Update existing lead
          const updatedLead = {
            ...lead,
            ...editForm,
            updatedAt: new Date().toISOString(),
          };
        
          updateLead(lead.id, updatedLead);
          success(
            t("leadUpdated", "Lead actualizado"),
            t("leadUpdatedMessage", "La información del lead se actualizó correctamente")
          );
        }
      } catch (err) {
        console.error("Error saving lead:", err);
        error(
          t("saveError", "Error al guardar"),
          t("saveRetry", "No se pudieron guardar los cambios. Inténtalo de nuevo.")
        );
      } finally {
        setIsSaving(false);
      }
    } else {
      error(
        t("invalidData", "Datos inválidos"),
        t("fixErrors", "Por favor corrige los errores antes de guardar")
      );
    }
  };

  const handleCancel = () => {
    setEditForm({
      email: lead.email,
      status: lead.status,
    });
    setErrors({});
  };

  const handleConvertToOpportunity = async (opportunityData: Omit<Opportunity, 'id' | 'createdAt' | 'leadId'>) => {
    if (!lead) return;
    
    try {
      // Create opportunity with all required fields
      const newOpportunity = {
        name: opportunityData.name || `${lead.company} Opportunity`,
        stage: 'prospecting' as const, // Set default stage
        amount: opportunityData.amount || 0,
        accountName: opportunityData.accountName || lead.company,
        leadId: lead.id,
      };

      console.log('Creating opportunity:', newOpportunity);
      await addOpportunity(newOpportunity);
      
      console.log('Updating lead status to qualified');
      await updateLead(lead.id, { status: 'qualified' });
      
      success(t('leadConverted', 'Lead convertido a oportunidad exitosamente'));
      onClose();
    } catch (err) {
      console.error('Error converting lead to opportunity:', err);
      error(t('conversionError', 'Error al convertir el lead a oportunidad'));
      throw err; // Re-throw to let the button handle its own loading state
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex">
        <div
          className="absolute inset-0 backdrop-blur-sm"
          onClick={onClose}
          aria-hidden
        />

      <aside className="relative ml-auto w-full max-w-lg bg-white shadow-xl flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-blue-50">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900">
              {t("leadDetails", "Detalle del lead")}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-gray-400 hover:text-gray-500 hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
          <div className="space-y-4">
            {/* Score Card */}
            <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-200">
                <div className="p-3 bg-blue-50 rounded-lg mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="text-sm font-medium text-gray-900">Convertir a Oportunidad</p>
                      <p className="text-xs text-gray-500">Avanzar este lead a la siguiente etapa</p>
                    </div>
                  </div>
                  <ConvertToOpportunityButton 
                    lead={lead}
                    onConvert={handleConvertToOpportunity}
                  />
              </div>
            </div>

            {/* Lead Info */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                <h4 className="text-base font-medium text-gray-900">
                  {t("leadInformation", "Información del Lead")}
                </h4>
              </div>
              <div className="p-6 space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t("name", "Nombre")}
                  </label>
                  <Input
                    value={editForm.name || ""}
                    onChange={(e) =>
                      setEditForm((prev) => ({ ...prev, name: e.target.value }))
                    }
                    error={errors.name}
                    className="w-full rounded-md border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t("company", "Empresa")}
                  </label>
                  <Input
                    value={editForm.company || ""}
                    onChange={(e) =>
                      setEditForm((prev) => ({ ...prev, company: e.target.value }))
                    }
                    className="w-full rounded-md border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t("email", "Correo electrónico")}
                  </label>
                  <Input
                    value={editForm.email || ""}
                    onChange={(e) =>
                      setEditForm((prev) => ({ ...prev, email: e.target.value }))
                    }
                    error={errors.email}
                    className="w-full rounded-md border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Status Section */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                <h4 className="text-base font-medium text-gray-900">
                  {t("status", "Estado")}
                </h4>
              </div>
              <div className="p-6 space-y-4">
                <Select
                  options={statusOptions}
                  value={editForm.status || ""}
                  onChange={(e) =>
                    setEditForm((prev) => ({
                      ...prev,
                      status: e.target.value as Lead["status"],
                    }))
                  }
                  error={errors.status}
                  className="w-full"
                />
                <Badge
                  variant={editForm.status ? "default" : "secondary"}
                  size="lg"
                  className="w-full justify-center py-2.5"
                >
                  {t(editForm.status || lead.status)}
                </Badge>
                
                <ConvertToOpportunityButton 
                  lead={lead}
                  onConvert={handleConvertToOpportunity}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 bg-white flex justify-end space-x-3">
          <Button
            variant="outline"
            onClick={handleCancel}
            disabled={isSaving}
            className="px-4 py-2 text-sm font-medium"
          >
            {t("cancel", "Cancelar")}
          </Button>
          <Button
            onClick={handleSave}
            disabled={isSaving}
            loading={isSaving}
            className="px-6 py-2 text-sm font-medium"
          >
            {t("saveChanges", "Guardar cambios")}
          </Button>
        </div>
      </aside>
    </div>
    
  </>
  );
};

export default LeadDetailPanel;
