"use client";

import dynamic from "next/dynamic";

const ClientApp = dynamic(
  () => import("../../App.jsx"),
  {
    ssr: false,
    loading: () => (
      <div className="min-vh-100 d-flex align-items-center justify-content-center bg-white text-dark">
        Loading...
      </div>
    ),
  }
);

export default function Page() {
  return <ClientApp />;
}