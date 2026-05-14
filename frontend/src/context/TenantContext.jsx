"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

const TenantContext = createContext();

const hexToRgb = (hex) => {
  if (!hex || typeof hex !== 'string') return "47, 184, 170";
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? 
    `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : 
    "47, 184, 170";
};

const injectTheme = (theme) => {
  if (!theme) return;
  const root = document.documentElement;
  const primary = theme.primaryColor || "#1a237e";
  const secondary = theme.secondaryColor || "#ffd700";
  const rgb = hexToRgb(primary);

  root.style.setProperty("--primary-color", primary);
  root.style.setProperty("--secondary-color", secondary);
  root.style.setProperty("--primary-rgb", rgb);
  root.style.setProperty("--secondary-rgb", hexToRgb(secondary));
  
  root.style.setProperty("--primary-dark-color", primary); 
  root.style.setProperty("--primary-soft-color", `rgba(${rgb}, 0.1)`);
  root.style.setProperty("--primary-glow-color", `rgba(${rgb}, 0.25)`);
};

export const TenantProvider = ({ children }) => {
  const [tenant, setTenant] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTenantConfig = async () => {
      try {
        const hostname = window.location.hostname;
        let slug = "default";
        
        if (!hostname.includes("localhost") && !hostname.match(/\d+\.\d+\.\d+\.\d+/)) {
          const parts = hostname.split(".");
          if (parts.length >= 3) {
            slug = parts[0];
          }
        }

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/tenants/config`, {
          headers: {
            "x-tenant-slug": slug
          }
        });

        if (response.ok) {
          const data = await response.json();
          setTenant(data);
          if (data.theme) injectTheme(data.theme);
        }
      } catch (error) {
        console.error("Tenant Config Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTenantConfig();
  }, []);

  const refreshTenant = async () => {
    try {
      const hostname = window.location.hostname;
      let slug = "default";
      if (!hostname.includes("localhost") && !hostname.match(/\d+\.\d+\.\d+\.\d+/)) {
        const parts = hostname.split(".");
        if (parts.length >= 3) slug = parts[0];
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/tenants/config`, {
        headers: { "x-tenant-slug": slug }
      });

      if (response.ok) {
        const data = await response.json();
        setTenant(data);
        if (data.theme) injectTheme(data.theme);
        return data;
      }
    } catch (error) {
      console.error("Refresh Tenant Error:", error);
    }
  };

  return (
    <TenantContext.Provider value={{ tenant, loading, refreshTenant }}>
      {children}
    </TenantContext.Provider>
  );
};

export const useTenant = () => {
  const context = useContext(TenantContext);
  if (!context) {
    throw new Error("useTenant must be used within a TenantProvider");
  }
  return context;
};
