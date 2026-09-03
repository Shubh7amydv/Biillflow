'use client';

import React, { useState } from 'react';
import { useSiteConfig } from '@/context/SiteConfigContext';
import {
  FileText,
  CreditCard,
  ShoppingCart,
  Receipt,
  Scale,
  Building2,
  Users,
  BarChart3,
  UserCheck,
  Gift,
  Plus,
  Play,
  Sliders,
  AlertTriangle,
  ChevronDown,
  ArrowUpRight,
  TrendingUp,
  FileSpreadsheet,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';

interface WaveDashboardSandboxProps {
  onActionClick?: (actionName: string) => void;
}

export const WaveDashboardSandbox: React.FC<WaveDashboardSandboxProps> = ({ onActionClick }) => {
  const { config, showToast } = useSiteConfig();
  const [activeSidebar, setActiveSidebar] = useState<string>('Dashboard');
  const [expenseRange, setExpenseRange] = useState<string>('Year to date');
  const [cashflowRange, setCashflowRange] = useState<string>('Last 30 days');
  const [hoveredSlice, setHoveredSlice] = useState<string | null>(null);
  const [simulatedAction, setSimulatedAction] = useState<string | null>(null);

  const handleAction = (name: string) => {
    setSimulatedAction(name);
    showToast(`Opened: ${name}`);
    if (onActionClick) onActionClick(name);
    setTimeout(() => setSimulatedAction(null), 2000);
  };

  // Slices from Image 2
  const expenseCategories = [
    { label: 'Payroll', pct: 27, color: '#F5B82E', amount: '$12,150' },
    { label: 'Office Supplies', pct: 23, color: '#FA6800', amount: '$10,350' },
    { label: 'Marketing', pct: 16, color: '#8A3FFC', amount: '$7,200' },
    { label: 'Cash on hand', pct: 14, color: '#FA75C2', amount: '$6,300' },
    { label: 'Uncategorized', pct: 12, color: '#52B6FF', amount: '$5,400', warning: true },
    { label: 'Other', pct: 8, color: '#A0AEC0', amount: '$3,600' },
  ];

  // Cashflow daily bars from Image 2
  const cashflowData = [
    { day: 'Apr 2', inflow: 28, outflow: -15, net: 13 },
    { day: 'Apr 3', inflow: 34, outflow: -12, net: 22 },
    { day: 'Apr 4', inflow: 25, outflow: -20, net: 5 },
    { day: 'Apr 5', inflow: 29, outflow: -14, net: 15 },
    { day: 'Apr 6', inflow: 36, outflow: -22, net: 14 },
    { day: 'Apr 7', inflow: 22, outflow: -18, net: 4 },
    { day: 'Apr 8', inflow: 31, outflow: -16, net: 15 },
    { day: 'Apr 9', inflow: 39, outflow: -11, net: 28 },
    { day: 'Apr 10', inflow: 27, outflow: -24, net: 3 },
    { day: 'Apr 11', inflow: 35, outflow: -17, net: 18 },
    { day: 'Apr 12', inflow: 32, outflow: -13, net: 19 },
  ];

  return (
    <div className="w-full bg-white rounded-2xl shadow-2xl border border-slate-200/90 overflow-hidden text-slate-800 font-sans select-none transition-all duration-300">
      {/* BillFlow Mockup App Header */}
      <div className="bg-white border-b border-slate-200/80 px-4 py-2.5 flex items-center justify-between">
        {/* Brand / Create New */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-slate-900 font-bold tracking-tight text-sm">
            <span className="text-[#0055FF] text-base font-black">//</span>
            <span>{config.brandName.toLowerCase()}</span>
          </div>
          <button
            onClick={() => handleAction('Create New')}
            className="flex items-center gap-1 bg-[#0055FF] hover:bg-[#0044dd] text-white text-xs font-semibold px-3 py-1 rounded-full shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create new</span>
          </button>
        </div>

        {/* Right workspace profile badge */}
        <div className="flex items-center gap-2 text-xs">
          <button
            onClick={() => handleAction('Settings')}
            className="p-1 text-slate-400 hover:text-slate-600 rounded hover:bg-slate-100 transition-colors"
            title="Options"
          >
            <Sliders className="w-3.5 h-3.5" />
          </button>
          <div className="flex items-center gap-1.5 pl-2 border-l border-slate-200">
            <span className="font-semibold text-slate-800 text-xs">Goodwood Designs</span>
            <span className="bg-[#0055FF] text-white text-[10px] font-bold px-1.5 py-0.5 rounded leading-none">
              PRO
            </span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </div>
        </div>
      </div>

      {/* Main App Workspace (Sidebar + Dashboard Canvas) */}
      <div className="flex min-h-[500px]">
        {/* Mockup Left Sidebar (Collapsible on mobile) */}
        <div className="w-44 bg-slate-50/70 border-r border-slate-200/70 p-3 hidden sm:flex flex-col justify-between text-xs text-slate-600">
          <div className="space-y-1">
            {[
              { id: 'Dashboard', icon: BarChart3, active: true },
              { id: 'Invoices', icon: CreditCard },
              { id: 'Clients', icon: Users },
              { id: 'New Invoice', icon: Receipt },
              { id: 'Reports', icon: FileSpreadsheet },
              { id: 'Settings', icon: UserCheck },
              { id: 'Help', icon: Gift, badge: 'FAQ' },
            ].map((item) => {
              const Icon = item.icon;
              const isActive = activeSidebar === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveSidebar(item.id);
                    handleAction(item.id);
                  }}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-blue-100/70 text-[#0055FF] font-bold'
                      : 'hover:bg-slate-100/80 text-slate-600'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-[#0055FF]' : 'text-slate-400'}`} />
                    <span className="truncate">{item.id}</span>
                  </div>
                  {item.badge && (
                    <span className="bg-emerald-100 text-emerald-700 text-[9px] font-bold px-1.5 py-0.2 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Bottom play video button like Image 2 */}
          <div className="pt-3 border-t border-slate-200/60">
            <button
              onClick={() => handleAction('Tutorial Video')}
              className="w-7 h-7 rounded-full bg-slate-700 hover:bg-slate-900 text-white flex items-center justify-center transition-colors shadow-xs"
              title="Watch walkthrough"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
            </button>
          </div>
        </div>

        {/* Mockup Dashboard Main View */}
        <div className="flex-1 p-4 sm:p-6 bg-white overflow-hidden">
          {/* Greeting from Image 2 */}
          <div className="mb-4">
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 tracking-tight">
              Good morning, Erica
            </h2>
          </div>

          {/* Quick Action Buttons Row from Image 2 */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-6">
            <button
              onClick={() => handleAction('Create estimate')}
              className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-emerald-50/80 hover:bg-emerald-100 border border-emerald-200/60 text-emerald-900 text-xs font-semibold transition-all hover:shadow-xs cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5 text-emerald-700" />
              <span>Create estimate</span>
            </button>

            <button
              onClick={() => handleAction('Create invoice')}
              className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-sky-50/80 hover:bg-sky-100 border border-sky-200/60 text-sky-900 text-xs font-semibold transition-all hover:shadow-xs cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5 text-sky-700" />
              <span>Create invoice</span>
            </button>

            <button
              onClick={() => handleAction('Add transaction')}
              className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-purple-50/80 hover:bg-purple-100 border border-purple-200/60 text-purple-900 text-xs font-semibold transition-all hover:shadow-xs cursor-pointer"
            >
              <TrendingUp className="w-3.5 h-3.5 text-purple-700" />
              <span>Add transaction</span>
            </button>

            <button
              onClick={() => handleAction('Add bill')}
              className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-amber-50/80 hover:bg-amber-100 border border-amber-200/60 text-amber-900 text-xs font-semibold transition-all hover:shadow-xs cursor-pointer"
            >
              <Receipt className="w-3.5 h-3.5 text-amber-700" />
              <span>Add bill</span>
            </button>
          </div>

          {/* Section Header: Insights for you */}
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-serif font-bold text-slate-900">
              Insights for you
            </h3>
            <button
              onClick={() => handleAction('Customize Insights')}
              className="flex items-center gap-1 text-xs text-[#0055FF] hover:text-[#0044cc] font-medium border border-blue-200 rounded-lg px-2.5 py-1 hover:bg-blue-50/50 transition-colors"
            >
              <Sliders className="w-3 h-3" />
              <span>Customize</span>
            </button>
          </div>

          {/* 2 Main Visual Cards: Expenses Breakdown & Cashflow */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
            {/* CARD 1: Expenses Breakdown Donut Chart */}
            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-slate-900">Expenses breakdown</span>
                  <button
                    onClick={() => handleAction('Expenses report')}
                    className="text-[11px] text-[#0055FF] hover:underline font-semibold"
                  >
                    View report
                  </button>
                </div>
                <select
                  value={expenseRange}
                  onChange={(e) => setExpenseRange(e.target.value)}
                  className="text-xs bg-slate-50 border border-slate-200 rounded-md px-2 py-1 outline-none text-slate-700 cursor-pointer"
                >
                  <option>Year to date</option>
                  <option>Last quarter</option>
                  <option>This month</option>
                </select>
              </div>

              {/* Donut Chart & Legend Side by Side */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center pt-2">
                {/* SVG Donut */}
                <div className="relative flex items-center justify-center">
                  <svg className="w-36 h-36 transform -rotate-90" viewBox="0 0 100 100">
                    {/* Donut slices using stroke-dasharray */}
                    {/* Circle perimeter = 2 * PI * r = 2 * 3.14159 * 38 ≈ 238.76 */}
                    <circle
                      cx="50"
                      cy="50"
                      r="36"
                      fill="transparent"
                      stroke="#F5B82E"
                      strokeWidth="18"
                      strokeDasharray="64.5 238.76"
                      strokeDashoffset="0"
                      className="cursor-pointer hover:opacity-85 transition-opacity"
                      onMouseEnter={() => setHoveredSlice('Payroll (27%)')}
                      onMouseLeave={() => setHoveredSlice(null)}
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="36"
                      fill="transparent"
                      stroke="#FA6800"
                      strokeWidth="18"
                      strokeDasharray="54.9 238.76"
                      strokeDashoffset="-64.5"
                      className="cursor-pointer hover:opacity-85 transition-opacity"
                      onMouseEnter={() => setHoveredSlice('Office Supplies (23%)')}
                      onMouseLeave={() => setHoveredSlice(null)}
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="36"
                      fill="transparent"
                      stroke="#8A3FFC"
                      strokeWidth="18"
                      strokeDasharray="38.2 238.76"
                      strokeDashoffset="-119.4"
                      className="cursor-pointer hover:opacity-85 transition-opacity"
                      onMouseEnter={() => setHoveredSlice('Marketing (16%)')}
                      onMouseLeave={() => setHoveredSlice(null)}
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="36"
                      fill="transparent"
                      stroke="#FA75C2"
                      strokeWidth="18"
                      strokeDasharray="33.4 238.76"
                      strokeDashoffset="-157.6"
                      className="cursor-pointer hover:opacity-85 transition-opacity"
                      onMouseEnter={() => setHoveredSlice('Cash on hand (14%)')}
                      onMouseLeave={() => setHoveredSlice(null)}
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="36"
                      fill="transparent"
                      stroke="#52B6FF"
                      strokeWidth="18"
                      strokeDasharray="28.6 238.76"
                      strokeDashoffset="-191.0"
                      className="cursor-pointer hover:opacity-85 transition-opacity"
                      onMouseEnter={() => setHoveredSlice('Uncategorized (12%)')}
                      onMouseLeave={() => setHoveredSlice(null)}
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="36"
                      fill="transparent"
                      stroke="#A0AEC0"
                      strokeWidth="18"
                      strokeDasharray="19.1 238.76"
                      strokeDashoffset="-219.6"
                      className="cursor-pointer hover:opacity-85 transition-opacity"
                      onMouseEnter={() => setHoveredSlice('Other (8%)')}
                      onMouseLeave={() => setHoveredSlice(null)}
                    />
                  </svg>
                  {/* Donut Center */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
                    <span className="text-[10px] text-slate-400 font-medium">Total</span>
                    <span className="text-xs font-extrabold text-slate-900">$45,000</span>
                  </div>
                </div>

                {/* Slices Legend from Image 2 */}
                <div className="space-y-1 text-[11px] text-slate-600">
                  {expenseCategories.map((cat) => (
                    <div
                      key={cat.label}
                      onMouseEnter={() => setHoveredSlice(`${cat.label} (${cat.pct}%)`)}
                      onMouseLeave={() => setHoveredSlice(null)}
                      className="flex items-center justify-between hover:bg-slate-50 px-1 py-0.5 rounded cursor-pointer transition-colors"
                    >
                      <div className="flex items-center gap-1.5 truncate">
                        <span
                          className="w-2.5 h-2.5 rounded-xs shrink-0"
                          style={{ backgroundColor: cat.color }}
                        />
                        <span className="truncate">{cat.pct}% {cat.label}</span>
                        {cat.warning && (
                          <AlertTriangle className="w-3 h-3 text-amber-500 shrink-0" />
                        )}
                      </div>
                      <span className="font-semibold text-slate-800 text-[10px] shrink-0">{cat.amount}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* CARD 2: Cashflow Bar & Net Line Chart */}
            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-slate-900">Cashflow</span>
                  <button
                    onClick={() => handleAction('Cashflow report')}
                    className="text-[11px] text-[#0055FF] hover:underline font-semibold"
                  >
                    View report
                  </button>
                </div>
                <select
                  value={cashflowRange}
                  onChange={(e) => setCashflowRange(e.target.value)}
                  className="text-xs bg-slate-50 border border-slate-200 rounded-md px-2 py-1 outline-none text-slate-700 cursor-pointer"
                >
                  <option>Last 30 days</option>
                  <option>This quarter</option>
                  <option>Year to date</option>
                </select>
              </div>

              {/* Legend row */}
              <div className="flex items-center gap-4 text-[10px] text-slate-600 mb-2">
                <div className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-xs bg-[#00A86B]" />
                  <span>Inflow</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-xs border border-slate-400 bg-white" />
                  <span>Outflow</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500 border border-slate-900" />
                  <span>Net change</span>
                </div>
              </div>

              {/* Bar & Trendline Visual */}
              <div className="relative h-28 w-full flex items-end justify-between pt-4 border-b border-slate-200 pb-1">
                {/* Horizontal zero axis */}
                <div className="absolute top-1/2 left-0 right-0 border-t border-slate-200 pointer-events-none" />

                {cashflowData.map((d, idx) => (
                  <div
                    key={d.day}
                    className="flex flex-col items-center flex-1 h-full justify-center relative group cursor-pointer"
                  >
                    {/* Inflow bar (above) */}
                    <div className="w-2 sm:w-3 bg-[#00A86B] rounded-t-xs transition-all group-hover:opacity-80" style={{ height: `${d.inflow}%` }} />
                    {/* Outflow bar (below) */}
                    <div className="w-2 sm:w-3 bg-slate-200 border-x border-b border-slate-300 rounded-b-xs" style={{ height: `${Math.abs(d.outflow)}%` }} />

                    {/* Net change dot */}
                    <div
                      className="absolute w-2 h-2 rounded-full bg-amber-400 border border-slate-900 z-10 transition-transform group-hover:scale-125"
                      style={{ top: `${50 - d.net * 0.8}%` }}
                    />

                    {/* Hover tooltip */}
                    <div className="absolute bottom-full mb-2 hidden group-hover:flex flex-col bg-slate-900 text-white text-[9px] p-1.5 rounded shadow-lg pointer-events-none z-20 whitespace-nowrap">
                      <span className="font-bold">{d.day}</span>
                      <span>Inflow: +${d.inflow * 100}</span>
                      <span>Outflow: -${Math.abs(d.outflow) * 100}</span>
                      <span className="text-amber-300">Net: +${d.net * 100}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Date labels */}
              <div className="flex items-center justify-between text-[9px] text-slate-400 pt-1">
                <span>Apr 2</span>
                <span>Apr 5</span>
                <span>Apr 8</span>
                <span>Apr 12</span>
              </div>
            </div>
          </div>

          {/* Bottom peeks: Connected accounts & Profit & Loss from Image 2 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 flex items-center justify-between">
              <div>
                <div className="font-bold text-xs text-slate-900">Connected accounts (2)</div>
                <div className="text-[11px] text-slate-500">Chase Checking •••• 4120 ($18,420.50)</div>
              </div>
              <button
                onClick={() => handleAction('Connected Accounts')}
                className="text-xs text-[#0055FF] hover:underline font-semibold"
              >
                View all
              </button>
            </div>

            <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 flex items-center justify-between">
              <div>
                <div className="font-bold text-xs text-slate-900">Profit & Loss</div>
                <div className="text-[11px] text-emerald-600 font-semibold">Net Profit: +$24,310 (Year to date)</div>
              </div>
              <button
                onClick={() => handleAction('Profit & Loss Report')}
                className="text-xs text-[#0055FF] hover:underline font-semibold"
              >
                View report
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
