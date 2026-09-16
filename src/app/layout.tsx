import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = { title: "Contábil Flux", description: "Central operacional para escritórios contábeis" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="pt-BR"><body>{children}</body></html>;
}
