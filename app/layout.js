import CustomRainbowKitProvider from "./CustomRainbowKitProvider";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster"
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Frontend Template",
  description: "Template for frontend projects generated from nextjs with tailwind, shadcn and Viem , Wagmi, RainbowKit for web3.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
        <link rel="icon" href="/favicon.ico" sizes="any" type="image/ico" />
      </head>
      <body className={`${inter.className} flex flex-col min-h-screen`}>
        <CustomRainbowKitProvider>
          <div className="flex flex-col flex-grow min-h-screen">
            <Header />
            <main className="flex flex-col flex-grow items-center justify-center bg-gray-100">
              {children}
            </main>
            <Footer />
          </div>
        </CustomRainbowKitProvider>
        <Toaster />
      </body>
    </html>
  );
}
