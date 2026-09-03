'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { SiteConfig, Testimonial } from '../types';
import { defaultSiteConfig, defaultTestimonials } from '../data/defaultWaveData';

interface SiteConfigContextType {
  config: SiteConfig;
  testimonials: Testimonial[];
  isEditMode: boolean;
  setIsEditMode: (val: boolean) => void;
  isDrawerOpen: boolean;
  setIsDrawerOpen: (val: boolean) => void;
  updateConfig: (partial: Partial<SiteConfig>) => void;
  updateTestimonial: (id: string, partial: Partial<Testimonial>) => void;
  resetToDefaults: () => void;
  exportConfigJson: () => string;
  importConfigJson: (json: string) => boolean;
  toastMessage: string | null;
  showToast: (msg: string) => void;
}

const SiteConfigContext = createContext<SiteConfigContextType | undefined>(undefined);

const STORAGE_KEY_CONFIG = 'billflow_custom_site_config_v1';
const STORAGE_KEY_TESTIMONIALS = 'billflow_custom_testimonials_v1';

export const SiteConfigProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [config, setConfig] = useState<SiteConfig>(defaultSiteConfig);
  const [testimonials, setTestimonials] = useState<Testimonial[]>(defaultTestimonials);

  // Load from localStorage on client side safely
  useEffect(() => {
    try {
      const savedConfig = localStorage.getItem(STORAGE_KEY_CONFIG);
      if (savedConfig) {
        setConfig({ ...defaultSiteConfig, ...JSON.parse(savedConfig) });
      }
    } catch {
      // ignore
    }

    try {
      const savedTestimonials = localStorage.getItem(STORAGE_KEY_TESTIMONIALS);
      if (savedTestimonials) {
        setTestimonials(JSON.parse(savedTestimonials));
      }
    } catch {
      // ignore
    }
  }, []);

  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((current) => (current === msg ? null : current));
    }, 3500);
  };

  const updateConfig = (partial: Partial<SiteConfig>) => {
    setConfig((prev) => {
      const updated = { ...prev, ...partial };
      try {
        localStorage.setItem(STORAGE_KEY_CONFIG, JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
    showToast('Changes saved successfully!');
  };

  const updateTestimonial = (id: string, partial: Partial<Testimonial>) => {
    setTestimonials((prev) => {
      const updated = prev.map((t) => (t.id === id ? { ...t, ...partial } : t));
      try {
        localStorage.setItem(STORAGE_KEY_TESTIMONIALS, JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
    showToast('Testimonial updated!');
  };

  const resetToDefaults = () => {
    try {
      localStorage.removeItem(STORAGE_KEY_CONFIG);
      localStorage.removeItem(STORAGE_KEY_TESTIMONIALS);
    } catch {
      // ignore
    }
    setConfig(defaultSiteConfig);
    setTestimonials(defaultTestimonials);
    showToast('Reset back to BillFlow defaults.');
  };

  const exportConfigJson = () => {
    return JSON.stringify({ config, testimonials }, null, 2);
  };

  const importConfigJson = (json: string): boolean => {
    try {
      const parsed = JSON.parse(json);
      if (parsed.config) {
        setConfig({ ...defaultSiteConfig, ...parsed.config });
        localStorage.setItem(STORAGE_KEY_CONFIG, JSON.stringify(parsed.config));
      }
      if (parsed.testimonials && Array.isArray(parsed.testimonials)) {
        setTestimonials(parsed.testimonials);
        localStorage.setItem(STORAGE_KEY_TESTIMONIALS, JSON.stringify(parsed.testimonials));
      }
      showToast('Configuration loaded successfully!');
      return true;
    } catch {
      showToast('Error importing JSON. Please check formatting.');
      return false;
    }
  };

  return (
    <SiteConfigContext.Provider
      value={{
        config,
        testimonials,
        isEditMode,
        setIsEditMode,
        isDrawerOpen,
        setIsDrawerOpen,
        updateConfig,
        updateTestimonial,
        resetToDefaults,
        exportConfigJson,
        importConfigJson,
        toastMessage,
        showToast,
      }}
    >
      {children}
    </SiteConfigContext.Provider>
  );
};

export const useSiteConfig = () => {
  const context = useContext(SiteConfigContext);
  if (!context) {
    return {
      config: defaultSiteConfig,
      testimonials: defaultTestimonials,
      isEditMode: false,
      setIsEditMode: () => {},
      isDrawerOpen: false,
      setIsDrawerOpen: () => {},
      updateConfig: () => {},
      updateTestimonial: () => {},
      resetToDefaults: () => {},
      exportConfigJson: () => '',
      importConfigJson: () => false,
      toastMessage: null,
      showToast: () => {},
    };
  }
  return context;
};
