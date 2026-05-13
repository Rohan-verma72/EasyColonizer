
export const demoProperties = [
  {
    _id: "demo-lakeview-heights",
    title: "Lakeview Heights",
    project: "Lakeview Heights",
    location: "Kolar Road, Bhopal",
    type: "Flat",
    price: 4250000,
    area: 1180,
    status: "Available",
    possessionStatus: "Ready to Move",
    reraId: "P-BPL-24-1042",
    images: [
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=90&w=1400",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&q=90&w=1400",
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&q=90&w=1400",
    ],
    amenities: { gym: true, pool: true, parking: true, security: true, park: true },
    features: ["Gated community", "Clubhouse and gym", "Covered parking", "24x7 security"],
    description: "A well-connected premium apartment project with modern amenities.",
  },
  {
    _id: "demo-green-valley-plots",
    title: "Green Valley Plots",
    project: "Green Valley",
    location: "Raisen Road, Bhopal",
    type: "Plot",
    price: 1850000,
    area: 1000,
    status: "Available",
    possessionStatus: "Immediate Registry",
    reraId: "P-BPL-24-2190",
    images: [
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=90&w=1400",
    ],
    amenities: { gym: false, pool: false, parking: true, security: true, park: true },
    features: ["Wide internal roads", "Street lighting"],
    description: "Investment-friendly residential plots.",
  }
];

export const demoInventory = [
  { _id: "u-a101", phase: "Phase 1", block: "A", floor: 1, unitNumber: "A101", status: "Available", size: 1200, price: 2500000 },
  { _id: "u-a102", phase: "Phase 1", block: "A", floor: 1, unitNumber: "A102", status: "Booked", size: 1200, price: 2500000, customerName: "Rahul", customerPhone: "9876543210" },
  { _id: "u-b101", phase: "Phase 1", block: "B", floor: 1, unitNumber: "B101", status: "Sold", size: 1500, price: 3000000, customerName: "Amit", customerPhone: "9988776655" },
];

export const demoLeads = [
  { _id: "l1", name: "Rahul Sharma", phone: "9876543210", status: "New", email: "rahul@example.com", createdAt: new Date(Date.now() - 86400000 * 2).toISOString() },
  { _id: "l2", name: "Priya Singh", phone: "9988776655", status: "Contacted", email: "priya@example.com", createdAt: new Date(Date.now() - 3600000 * 5).toISOString() }
];

export const demoUsers = [
  { _id: "s1", name: "Admin", username: "admin", role: "admin" },
  { _id: "s2", name: "Sales", username: "sales", role: "sales" }
];

export const demoVisits = [
  { _id: "v1", customerName: "Rajesh", customerPhone: "9876543210", propertyId: { title: "Lakeview Heights" }, visitDate: new Date(), visitTime: "10:00 AM", status: "Confirmed" }
];
