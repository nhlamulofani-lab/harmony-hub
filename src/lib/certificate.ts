import { jsPDF } from "jspdf";

export type CertificateInput = {
  studentName: string;
  instrument: string;
  level: string; // "Beginner" | "Intermediate" | "Advanced" | "Complete Course"
  completionDate: Date;
  certificateNumber: string;
};

export function generateCertificate(input: CertificateInput): void {
  const doc = new jsPDF({ orientation: "landscape", unit: "pt", format: "a4" });
  const w = doc.internal.pageSize.getWidth();
  const h = doc.internal.pageSize.getHeight();

  // Background
  doc.setFillColor(15, 15, 20);
  doc.rect(0, 0, w, h, "F");

  // Outer border
  doc.setDrawColor(160, 120, 255);
  doc.setLineWidth(3);
  doc.rect(24, 24, w - 48, h - 48);
  // Inner border
  doc.setDrawColor(90, 60, 180);
  doc.setLineWidth(1);
  doc.rect(38, 38, w - 76, h - 76);

  // Header
  doc.setTextColor(200, 180, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text("NFS MUSIC ACADEMY", w / 2, 90, { align: "center" });

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(42);
  doc.text("Certificate of Completion", w / 2, 150, { align: "center" });

  doc.setDrawColor(160, 120, 255);
  doc.setLineWidth(1);
  doc.line(w / 2 - 120, 165, w / 2 + 120, 165);

  // Body
  doc.setFont("helvetica", "normal");
  doc.setFontSize(14);
  doc.setTextColor(220, 220, 230);
  doc.text("This certifies that", w / 2, 210, { align: "center" });

  doc.setFont("helvetica", "bold");
  doc.setFontSize(34);
  doc.setTextColor(255, 255, 255);
  doc.text(input.studentName || "Student", w / 2, 260, { align: "center" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(14);
  doc.setTextColor(220, 220, 230);
  doc.text("has successfully completed", w / 2, 300, { align: "center" });

  doc.setFont("helvetica", "bold");
  doc.setFontSize(24);
  doc.setTextColor(200, 180, 255);
  doc.text(`${input.instrument} — ${input.level}`, w / 2, 340, { align: "center" });

  // Footer
  const dateStr = input.completionDate.toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.setTextColor(180, 180, 200);
  doc.text(`Awarded on ${dateStr}`, w / 2, h - 130, { align: "center" });
  doc.text(`Certificate No. ${input.certificateNumber}`, w / 2, h - 112, { align: "center" });

  // Signature block
  const sigY = h - 80;
  doc.setDrawColor(200, 180, 255);
  doc.line(w / 2 - 130, sigY, w / 2 + 130, sigY);
  doc.setFontSize(12);
  doc.setTextColor(220, 220, 230);
  doc.text("Nhlamulo Fani Sibuyi — Founder & Director", w / 2, sigY + 18, { align: "center" });

  const safeName = (input.studentName || "student").replace(/[^a-z0-9]+/gi, "-").toLowerCase();
  doc.save(`nfs-certificate-${safeName}-${input.instrument.toLowerCase()}-${input.level.toLowerCase()}.pdf`);
}

export function makeCertificateNumber(userId: string, instrumentSlug: string, level: string): string {
  const seed = `${userId}-${instrumentSlug}-${level}`;
  let h = 2166136261 >>> 0;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  const n = (h >>> 0).toString(36).toUpperCase().padStart(7, "0").slice(0, 7);
  return `NFS-${n}`;
}
