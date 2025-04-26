"use client"

import { SignUpButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { Github, Database, User, GithubIcon } from "lucide-react";
import NavButton from "./NavButton";
import Image from "next/image";


const Navbar = () => {

  return (
    <div className="p-1 m-1 font-bold text-xl border-b-2 border-gray-800">
      <div className="flex justify-between items-center m-2">
        <section className="flex items-center justify-center gap-1.5">
          <Image
            src={"/icon.png"}
            height={50}
            width={50}
            alt="rag-icon"
            className="rounded-xl"
          />
          <span className="border-l-2 pl-2 border-gray-700">RAG-Chatbot</span>
        </section>

        <section className="flex justify-between items-center gap-4">
          <NavButton
            href="http://localhost:6333/dashboard"
            label="Database"
            icon={Database}
          />

          <NavButton
            href="https://github.com/sujal-cs"
            label="GitHub"
            icon={GithubIcon}
          />

            {/* if user is signed In*/}
          <section className="flex justify-between items-center gap-4">
            <SignedIn>
              <div>
                <UserButton
                  appearance={{
                    elements: {
                      userButtonAvatarBox: {
                        width: "60px",
                        height: "60px",
                        border: "2px solid #1e2939",
                      },
                    },
                  }}
                />
              </div>
            </SignedIn>

            {/* if user is signed In*/}
            <SignedOut>
              <div className="flex items-center gap-1.5">
                <SignUpButton>Sign-In here</SignUpButton>
                <User />
              </div>
            </SignedOut>
          </section>
        </section>
      </div>
    </div>
  );
}

export default Navbar
