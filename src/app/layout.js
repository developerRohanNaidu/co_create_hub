import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "CCHI - CoCreateHub India",
  description:
    "CoCreateHub India (CCHI) — a community-driven platform for students, developers, and professionals to collaborate, showcase projects, and build together.",
  icons: {
    icon: "/favicon.png", // 👈 place your logo here (in /public folder)
  },
  openGraph: {
    title: "CCHI - CoCreateHub India",
    description:
      "Explore innovative student and developer projects at CoCreateHub India. Connect, collaborate, and grow together.",
    url: "https://www.cocreatehubindia.com",
    siteName: "CCHI - CoCreateHub India",
    images: [
      {
        url: "/favicon.png", // 👈 or replace with a banner image for link previews
        width: 512,
        height: 512,
        alt: "CCHI - CoCreateHub India",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "CCHI - CoCreateHub India",
    description:
      "Join CCHI - the collaborative platform for innovators and developers in India.",
    images: ["/favicon.png"],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
