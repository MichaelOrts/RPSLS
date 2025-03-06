'use client'

import { Bold, Italic, Underline } from "lucide-react"

import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { ToggleGroup, ToggleGroupItem } from "./ui/toggle-group";
import { Button } from "./ui/button";

import { useEffect, useState } from "react";

import {  useReadContract, useAccount, useWriteContract, useWaitForTransactionReceipt } from "wagmi";

const Main = () => {

  const [player1, setPlayer1] = useState('');
  const [player2, setPlayer2] = useState('');
  const [move, setMove] = useState('Null');
  const [state, setState] = useState('NoGame');

  const { address, chain } = useAccount();

  const isAddress = (str) => {
    return new RegExp("0x[a-fA-F0-9]{40}$").test(str);
  }

  const handleToggleChange = (newMove) => {
    setMove(newMove);
  }

  const createGame = () => {
    //TODO

    setPlayer1(address);
    setState("Player1Done");
  }

  const play = () => {
    setMove("test");

    setState("Player2Done");
  }

  const solve = () => {
    setMove("test");

    setState("NoGame");
  }

  const timeout = () => {
    setMove("test");

    setState("NoGame");
  }

  return (
    <div className="text-4xl text-bold text-center">
      <h1>Player 2 Address</h1>
      <Input id="player2" className="bg-gray-100 my-2" value={player2} disabled={state != "NoGame"} onChange={ e => isAddress(e.target.value) && setPlayer2(e.target.value)} />
      <h1>Move</h1>
      <ToggleGroup className="my-2" type="single" size="lg" onValueChange={e => {if (e) handleToggleChange(e)}} >
        <ToggleGroupItem value="Rock">Rock</ToggleGroupItem>
        <ToggleGroupItem value="Paper">Paper</ToggleGroupItem>
        <ToggleGroupItem value="Scissors">Scissors</ToggleGroupItem>
        <ToggleGroupItem value="Spock">Spock</ToggleGroupItem>
        <ToggleGroupItem value="Lizard">Lizard</ToggleGroupItem>
      </ToggleGroup>
      <h1>{move}</h1>
      {
        state === "NoGame" && <Button disabled={player2 === "" || move === "Null"} onClick={createGame}>Create Game</Button>
        || state === "Player1Done" && <Button disabled={address != player2 || move === "Null"} onClick={play}>Play</Button>
        || state === "Player2Done" && <Button disabled={address != player1} onClick={solve}>Solve</Button>
      }
      {state != "NoGame" && <Button disabled={state === "Player1Done" && address != player1 || state === "Player2Done" && address != player2} onClick={timeout}>Timeout</Button>}
    </div>
  );
}
  
export default Main;