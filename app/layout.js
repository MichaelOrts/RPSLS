import CustomRainbowKitProvider from "./CustomRainbowKitProvider";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster"
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Rock Paper Scissors Lizard and Spock game",
  description: "A Dapps to play Rock, paper and scissors game with additional lizard and spock weapons.",
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
          <div className="flex flex-col flex-grow min-h-screen bg-gray-300">
            <Header />
            <main className="flex flex-col justify-center">
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
