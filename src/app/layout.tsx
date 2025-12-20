import type { Metadata } from "next";
import { Oswald, Kanit } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

// Configure fonts
const oswald = Oswald({
  subsets: ["latin"],
  variable: "--font-oswald",
  display: 'swap',
});

const kanit = Kanit({
  weight: ['300', '400', '500', '700', '900'],
  subsets: ["latin", "thai"],
  variable: "--font-kanit",
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: "Tire Select - Premium Tires at Best Prices",
    template: "%s | Tire Select",
  },
  description: "Find the best tires for your car. Huge selection of Apollo, Bridgestone, Michelin and more. Fast delivery and expert advice. Shop now!",
  keywords: ["tires", "tyres", "car tires", "apollo", "bridgestone", "thailand tire shop", "buy tires online"],
  openGraph: {
    type: "website",
    locale: "th_TH",
    url: "https://shop-apollo.vercel.app",
    title: "Tire Select - Your Trusted Tire Partner",
    description: "Premium tires, great prices, fast delivery.",
    siteName: "Tire Select",
  },
  twitter: {
    card: "summary_large_image",
    title: "Tire Select",
    description: "Premium tires at best prices.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${kanit.variable} ${oswald.variable} antialiased min-h-screen flex flex-col bg-cream-50 text-charcoal-900 font-sans`}>
        <Header />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
