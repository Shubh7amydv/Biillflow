'use client';

import React, { useState } from 'react';
import { useSiteConfig } from '@/context/SiteConfigContext';
import {
  X,
  Save,
  RotateCcw,
  Download,
  Upload,
  Copy,
  Check,
  Building,
  DollarSign,
  Type,
  Mail,
  Phone,
  Layers,
  Sparkles,
  Sliders,
} from 'lucide-react';

export const EditDetailsDrawer: React.FC = () => {
  const {
    config,
    updateConfig,
    isDrawerOpen,
    setIsDrawerOpen,
    resetToDefaults,
    exportConfigJson,
    importConfigJson,
    showToast,
  } = useSiteConfig();

  const [activeTab, setActiveTab] = useState<'general' | 'hero' | 'pricing' | 'contact' | 'stats' | 'backup'>('general');
  const [copied, setCopied] = useState(false);
  const [jsonInput, setJsonInput] = useState('');

  if (!isDrawerOpen) return null;

  const handleCopyJson = () => {
    navigator.clipboard.writeText(exportConfigJson());
    setCopied(true);
    showToast('Configuration copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleImport = () => {
    if (!jsonInput.trim()) return;
    const ok = importConfigJson(jsonInput);
    if (ok) {
      setJsonInput('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/60 backdrop-blur-xs flex justify-end">
      {/* Slide-over Panel */}
      <div className="w-full max-w-xl bg-white h-full shadow-2xl flex flex-col justify-between overflow-hidden animate-in slide-in-from-right duration-300">
        {/* Drawer Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-[#0B1528] text-white">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-blue-500/20 text-[#52B6FF]">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base leading-tight">Edit Client Website Details</h3>
              <p className="text-xs text-slate-400">Customize any content, pricing, and branding live</p>
            </div>
          </div>
          <button
            onClick={() => setIsDrawerOpen(false)}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab selector */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-4 overflow-x-auto no-scrollbar gap-1 text-xs font-semibold text-slate-600">
          {[
            { id: 'general', label: 'Branding' },
            { id: 'hero', label: 'Hero & CTA' },
            { id: 'pricing', label: 'Pricing' },
            { id: 'contact', label: 'Contact Info' },
            { id: 'stats', label: 'Stats & Numbers' },
            { id: 'backup', label: 'Export / Import' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-3 px-3 border-b-2 whitespace-nowrap transition-colors cursor-pointer ${
                activeTab === tab.id
                  ? 'border-[#0055FF] text-[#0055FF] bg-white font-bold'
                  : 'border-transparent hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Form Body (Scrollable) */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6 text-sm text-slate-800">
          {/* TAB 1: BRANDING */}
          {activeTab === 'general' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Brand / Company Name
                </label>
                <input
                  type="text"
                  value={config.brandName}
                  onChange={(e) => updateConfig({ brandName: e.target.value })}
                  className="w-full p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
                  placeholder="e.g. BillFlow or Your Brand Name"
                />
                <p className="text-xs text-slate-400 mt-1">Updates the logo, headers, and footer text across the site.</p>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Brand Tagline
                </label>
                <input
                  type="text"
                  value={config.brandTagline}
                  onChange={(e) => updateConfig({ brandTagline: e.target.value })}
                  className="w-full p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Currency Symbol
                </label>
                <input
                  type="text"
                  value={config.currencySymbol}
                  onChange={(e) => updateConfig({ currencySymbol: e.target.value })}
                  className="w-24 p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none text-center font-bold"
                  placeholder="$"
                />
                <p className="text-xs text-slate-400 mt-1">Used on invoices, pricing cards, and dashboard metrics ($, €, £, CAD$, etc.)</p>
              </div>

              <div className="pt-2 border-t border-slate-200">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Top Announcement Bar
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-xs">
                    <input
                      type="checkbox"
                      checked={config.showAnnouncement}
                      onChange={(e) => updateConfig({ showAnnouncement: e.target.checked })}
                      className="rounded text-teal-600 focus:ring-teal-500"
                    />
                    <span>Show on site</span>
                  </label>
                </div>
                <input
                  type="text"
                  value={config.announcementText}
                  onChange={(e) => updateConfig({ announcementText: e.target.value })}
                  className="w-full p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none text-xs"
                />
              </div>
            </div>
          )}

          {/* TAB 2: HERO & CTA */}
          {activeTab === 'hero' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Main Hero Headline
                </label>
                <textarea
                  rows={2}
                  value={config.heroHeadline}
                  onChange={(e) => updateConfig({ heroHeadline: e.target.value })}
                  className="w-full p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none font-bold text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Hero Subheadline
                </label>
                <textarea
                  rows={3}
                  value={config.heroSubheadline}
                  onChange={(e) => updateConfig({ heroSubheadline: e.target.value })}
                  className="w-full p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none text-xs text-slate-700"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-200">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                    Primary CTA Button
                  </label>
                  <input
                    type="text"
                    value={config.primaryCtaText}
                    onChange={(e) => updateConfig({ primaryCtaText: e.target.value })}
                    className="w-full p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none text-xs font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                    Secondary CTA Button
                  </label>
                  <input
                    type="text"
                    value={config.secondaryCtaText}
                    onChange={(e) => updateConfig({ secondaryCtaText: e.target.value })}
                    className="w-full p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none text-xs"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: PRICING */}
          {activeTab === 'pricing' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                    Starter Plan (Monthly)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-xs text-slate-400">{config.currencySymbol}</span>
                    <input
                      type="number"
                      value={config.pricing.starterMonthly}
                      onChange={(e) =>
                        updateConfig({
                          pricing: { ...config.pricing, starterMonthly: Number(e.target.value) },
                        })
                      }
                      className="w-full pl-7 pr-3 py-2 rounded-lg border border-slate-300 outline-none focus:ring-2 focus:ring-teal-500 text-sm font-bold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                    Starter Plan (Annual/mo)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-xs text-slate-400">{config.currencySymbol}</span>
                    <input
                      type="number"
                      value={config.pricing.starterAnnual}
                      onChange={(e) =>
                        updateConfig({
                          pricing: { ...config.pricing, starterAnnual: Number(e.target.value) },
                        })
                      }
                      className="w-full pl-7 pr-3 py-2 rounded-lg border border-slate-300 outline-none focus:ring-2 focus:ring-teal-500 text-sm font-bold"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                    Pro Plan (Monthly)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-xs text-slate-400">{config.currencySymbol}</span>
                    <input
                      type="number"
                      value={config.pricing.proMonthly}
                      onChange={(e) =>
                        updateConfig({
                          pricing: { ...config.pricing, proMonthly: Number(e.target.value) },
                        })
                      }
                      className="w-full pl-7 pr-3 py-2 rounded-lg border border-slate-300 outline-none focus:ring-2 focus:ring-teal-500 text-sm font-bold text-[#007788]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                    Pro Plan (Annual/mo)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-xs text-slate-400">{config.currencySymbol}</span>
                    <input
                      type="number"
                      value={config.pricing.proAnnual}
                      onChange={(e) =>
                        updateConfig({
                          pricing: { ...config.pricing, proAnnual: Number(e.target.value) },
                        })
                      }
                      className="w-full pl-7 pr-3 py-2 rounded-lg border border-slate-300 outline-none focus:ring-2 focus:ring-teal-500 text-sm font-bold text-[#007788]"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                    Payroll Base ($/mo)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-xs text-slate-400">{config.currencySymbol}</span>
                    <input
                      type="number"
                      value={config.pricing.payrollMonthlyBase}
                      onChange={(e) =>
                        updateConfig({
                          pricing: { ...config.pricing, payrollMonthlyBase: Number(e.target.value) },
                        })
                      }
                      className="w-full pl-7 pr-3 py-2 rounded-lg border border-slate-300 outline-none focus:ring-2 focus:ring-teal-500 text-sm font-bold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                    Payroll Per Employee
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-xs text-slate-400">{config.currencySymbol}</span>
                    <input
                      type="number"
                      value={config.pricing.payrollPerEmployee}
                      onChange={(e) =>
                        updateConfig({
                          pricing: { ...config.pricing, payrollPerEmployee: Number(e.target.value) },
                        })
                      }
                      className="w-full pl-7 pr-3 py-2 rounded-lg border border-slate-300 outline-none focus:ring-2 focus:ring-teal-500 text-sm font-bold"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                    Card Processing Rate
                  </label>
                  <input
                    type="text"
                    value={config.pricing.cardProcessingRate}
                    onChange={(e) =>
                      updateConfig({
                        pricing: { ...config.pricing, cardProcessingRate: e.target.value },
                      })
                    }
                    className="w-full p-2 rounded-lg border border-slate-300 outline-none focus:ring-2 focus:ring-teal-500 text-xs font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                    ACH Processing Rate
                  </label>
                  <input
                    type="text"
                    value={config.pricing.achProcessingRate}
                    onChange={(e) =>
                      updateConfig({
                        pricing: { ...config.pricing, achProcessingRate: e.target.value },
                      })
                    }
                    className="w-full p-2 rounded-lg border border-slate-300 outline-none focus:ring-2 focus:ring-teal-500 text-xs font-semibold"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: CONTACT */}
          {activeTab === 'contact' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Support Email
                </label>
                <input
                  type="email"
                  value={config.supportEmail}
                  onChange={(e) => updateConfig({ supportEmail: e.target.value })}
                  className="w-full p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Support Phone
                </label>
                <input
                  type="text"
                  value={config.supportPhone}
                  onChange={(e) => updateConfig({ supportPhone: e.target.value })}
                  className="w-full p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Company Address
                </label>
                <textarea
                  rows={2}
                  value={config.companyAddress}
                  onChange={(e) => updateConfig({ companyAddress: e.target.value })}
                  className="w-full p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none text-xs"
                />
              </div>
            </div>
          )}

          {/* TAB 5: STATS */}
          {activeTab === 'stats' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                    Users Count
                  </label>
                  <input
                    type="text"
                    value={config.stats.usersCount}
                    onChange={(e) =>
                      updateConfig({ stats: { ...config.stats, usersCount: e.target.value } })
                    }
                    className="w-full p-2 rounded-lg border border-slate-300 text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                    Money Managed
                  </label>
                  <input
                    type="text"
                    value={config.stats.moneyManaged}
                    onChange={(e) =>
                      updateConfig({ stats: { ...config.stats, moneyManaged: e.target.value } })
                    }
                    className="w-full p-2 rounded-lg border border-slate-300 text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                    Average Rating
                  </label>
                  <input
                    type="text"
                    value={config.stats.averageRating}
                    onChange={(e) =>
                      updateConfig({ stats: { ...config.stats, averageRating: e.target.value } })
                    }
                    className="w-full p-2 rounded-lg border border-slate-300 text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                    Invoices Sent
                  </label>
                  <input
                    type="text"
                    value={config.stats.invoicesSent}
                    onChange={(e) =>
                      updateConfig({ stats: { ...config.stats, invoicesSent: e.target.value } })
                    }
                    className="w-full p-2 rounded-lg border border-slate-300 text-xs font-bold"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: BACKUP / JSON */}
          {activeTab === 'backup' && (
            <div className="space-y-4">
              <div>
                <h4 className="font-bold text-slate-900 text-sm">Export Configuration</h4>
                <p className="text-xs text-slate-500 mb-2">
                  Copy your customized website details into JSON to save or share with your client.
                </p>
                <button
                  onClick={handleCopyJson}
                  className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-semibold"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  {copied ? 'Copied to Clipboard!' : 'Copy Config JSON'}
                </button>
              </div>

              <div className="pt-4 border-t border-slate-200">
                <h4 className="font-bold text-slate-900 text-sm">Import Configuration</h4>
                <p className="text-xs text-slate-500 mb-2">
                  Paste previously exported JSON to instantly apply changes.
                </p>
                <textarea
                  rows={4}
                  value={jsonInput}
                  onChange={(e) => setJsonInput(e.target.value)}
                  placeholder='{"config": { ... }}'
                  className="w-full p-2 text-xs font-mono border border-slate-300 rounded-lg outline-none focus:ring-1 focus:ring-teal-500"
                />
                <button
                  onClick={handleImport}
                  disabled={!jsonInput.trim()}
                  className="mt-2 flex items-center gap-1.5 px-4 py-2 bg-[#0055FF] hover:bg-[#0044dd] text-white rounded-lg text-xs font-bold disabled:opacity-50 transition-colors cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5" />
                  Apply Imported JSON
                </button>
              </div>

              <div className="pt-4 border-t border-slate-200">
                <h4 className="font-bold text-slate-900 text-sm text-rose-700">Reset to Defaults</h4>
                <p className="text-xs text-slate-500 mb-2">
                  Revert all customized text, prices, and branding back to the original BillFlow defaults.
                </p>
                <button
                  onClick={resetToDefaults}
                  className="flex items-center gap-1.5 px-4 py-2 border border-rose-300 text-rose-700 hover:bg-rose-50 rounded-lg text-xs font-semibold cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Reset to BillFlow Defaults
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Drawer Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <button
            onClick={resetToDefaults}
            className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-rose-600 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset all
          </button>

          <button
            onClick={() => {
              setIsDrawerOpen(false);
              showToast('All changes saved and live!');
            }}
            className="flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-[#0055FF] hover:bg-[#0044dd] text-white text-xs font-bold shadow-sm transition-all cursor-pointer"
          >
            <Save className="w-4 h-4" />
            Done & Save
          </button>
        </div>
      </div>
    </div>
  );
};
