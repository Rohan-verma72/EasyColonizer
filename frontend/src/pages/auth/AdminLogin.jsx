"use client";

import { useEffect } from "react";

export default function LegacyAdminLoginPage() {
  useEffect(() => {
    window.location.replace("/login");
  }, []);

  return (
    <main className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="text-center">
        <h1 className="h4 fw-bold mb-2">Redirecting to login...</h1>
        <p className="text-muted mb-0">Please wait a moment.</p>
      </div>
    </main>
  );
}
