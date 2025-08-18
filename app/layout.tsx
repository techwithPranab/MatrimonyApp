import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { ClientProviders } from "@/components/client-providers";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "MatrimonyWeb - Find Your Perfect Life Partner",
  description: "India's most trusted matrimony platform. Connect with verified profiles, find your perfect match with advanced AI-powered compatibility matching.",
  keywords: ["matrimony", "marriage", "wedding", "life partner", "Indian matrimony", "shaadi"],
  authors: [{ name: "MatrimonyWeb" }],
  creator: "MatrimonyWeb",
  metadataBase: new URL(process.env.NEXTAUTH_URL || "http://localhost:3000"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    title: "MatrimonyWeb - Find Your Perfect Life Partner",
    description: "India's most trusted matrimony platform with AI-powered matching",
    siteName: "MatrimonyWeb",
  },
  twitter: {
    card: "summary_large_image",
    title: "MatrimonyWeb - Find Your Perfect Life Partner",
    description: "India's most trusted matrimony platform with AI-powered matching",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <ClientProviders session={session}>
          {children}
        </ClientProviders>
      </body>
    </html>
  );
}
