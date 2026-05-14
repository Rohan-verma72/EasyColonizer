"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

const TenantContext = createContext();

export const TenantProvider = ({ children }) => {
  const [tenant, setTenant] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTenantConfig = async () => {
      try {
        // Detect slug from hostname
        const hostname = window.location.hostname;
        let slug = "default";
        
        // Example: mytenant.easycolonizer.com -> slug = 'mytenant'
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
          
          // Inject dynamic theme
          if (data.theme) {
            const root = document.documentElement;
            const primary = data.theme.primaryColor || "#1a237e";
            const secondary = data.theme.secondaryColor || "#ffd700";
            
            root.style.setProperty("--primary-color", primary);
            root.style.setProperty("--secondary-color", secondary);
            
            // RGB for shadows and overlays
            root.style.setProperty("--primary-rgb", hexToRgb(primary));
            root.style.setProperty("--secondary-rgb", hexToRgb(secondary));
            
            // Helper variables
            root.style.setProperty("--primary-dark-color", primary); 
            root.style.setProperty("--primary-soft-color", `${primary}15`);
            root.style.setProperty("--primary-glow-color", `${primary}40`);
          }
        }
      } catch (error) {
        console.error("Tenant Config Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTenantConfig();
  }, []);

  const hexToRgb = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? 
      `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : 
      "47, 184, 170";
  };

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
        
        // Refresh CSS variables
        if (data.theme) {
          const root = document.documentElement;
          const primary = data.theme.primaryColor || "#1a237e";
          const secondary = data.theme.secondaryColor || "#ffd700";
          
          root.style.setProperty("--primary-color", primary);
          root.style.setProperty("--secondary-color", secondary);
          
          // RGB for shadows and overlays
          root.style.setProperty("--primary-rgb", hexToRgb(primary));
          root.style.setProperty("--secondary-rgb", hexToRgb(secondary));
          
          // Helper variables
          root.style.setProperty("--primary-dark-color", primary); 
          root.style.setProperty("--primary-soft-color", `${primary}15`);
          root.style.setProperty("--primary-glow-color", `${primary}40`);
        }
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
