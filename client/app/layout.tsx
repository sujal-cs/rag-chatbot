  import type { Metadata } from "next";
  import { Geist, Roboto_Mono } from "next/font/google";
  import "./globals.css";
  import { ClerkProvider, SignUp, SignedIn, SignedOut } from "@clerk/nextjs";
  import UploadedPDFs from "./components/UploadedPDF";
  import Navbar from "./components/Navbar";

  const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
  });

  const robotMono = Roboto_Mono({
    variable: "--font-roboto-mono",
    subsets: ["latin"]
  })

  export const metadata: Metadata = {
    title: "RAG-ChatBot",
    description: "A chat application where you can upload your Documents and ask relevant questions. Infinite context window!!",
  };

  export default function RootLayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    return (
      <ClerkProvider>
        <html lang="en">
          <body
            className={`${robotMono.variable} ${geistSans.variable} antialiased bg-neutral-950 text-slate-300`}
          >
            {/* Navbar */}
            <Navbar />

            {/* If user is signed in then */}
            <SignedIn>
              <section>{children}</section>
            </SignedIn>

            {/* If user is signed out then */}
            <SignedOut>
              <div className="flex justify-center items-center flex-col gap-3">
                <h1 className="text-4xl font-bold ">
                  Please, Sign In or create account to continue!!
                </h1>
                <SignUp routing="hash" signInUrl="/sign-in" />
              </div>
            </SignedOut>

          </body>
        </html>
      </ClerkProvider>
    );
  }
