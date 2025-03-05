'use client'

import Main from "@/components/Main"
import NotConnected from "@/components/NotConnected";

import { useAccount } from "wagmi";

export default function Home() {

  const { isConnected } = useAccount()

  return (
    <>
      { isConnected ? (
        <Main />
      ) : (
        <NotConnected />
      )}
    </>
  );
}
