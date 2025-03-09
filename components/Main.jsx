'use client'

import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { ToggleGroup, ToggleGroupItem } from "./ui/toggle-group";
import { Button } from "./ui/button";
import { useToast } from "../hooks/use-toast";

import { createContext, useActionState, useContext, useEffect, useState } from "react";

import {  useReadContract, useAccount, useWriteContract, useWaitForTransactionReceipt, useTransactionReceipt, useDeployContract } from "wagmi";
import { getTransaction, getTransactionReceipt } from '@wagmi/core';

import { rpsAbi } from "@/constant/rps_abi";
import { rpsBytecode } from "@/constant/rps_bytecode";
import { keccak256, toHex, numberToHex, concatHex } from "viem";

const Main = () => {

  const { address, chain } = useAccount();

  const [player1, setPlayer1] = useState(address);
  const [player2, setPlayer2] = useState('');
  const [stake, setStake] = useState(0);
  const [salt, setSalt] = useState(0);
  const [move, setMove] = useState(0);
  const [state, setState] = useState('NoGame');
  const [contractAddress, setContractAddress] = useState();

  

  //const {data: hash, error, setIsPending, writeContract } = useWriteContract();

  const { toast } = useToast();

  const { deployContract, data: deployHash } = useDeployContract({
    mutation: {
      onError: (error) => {
        toast({
          title: "Deployment error",
          description: error.message,
          status: error,
          className: "bg-red-200",
          duration: 5000,
          isClosable: true
        });
      }
    }
 });

 const { isSuccess, data: deployData  } = useTransactionReceipt({hash: deployHash});

  const isAddress = (str) => {
    return new RegExp("0x[a-fA-F0-9]{40}$").test(str);
  }

  const createGame = async () => {
    await deployContract({
      abi: rpsAbi,
      bytecode: rpsBytecode,
      value: stake,
      args: [keccak256(concatHex([numberToHex(move, {size: 1}), numberToHex(salt, {size: 32})])), player2]
    });
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
    setSalt(0);
    setState("NoGame");
  }

  useEffect(() => {
    if(isSuccess) {
      setPlayer1(address);
      setState("Player1Done");
      setSalt(0);
      setContractAddress(deployData.contractAddress);
      toast({
        title: "Deployment Ok",
        description: "game created on : " + deployData.contractAddress,
        className: "bg-lime-200",
        duration: 5000,
        isClosable: true
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess]);

  return (
    
    <div className="text-4xl text-bold text-center">
      <h1>Player 1 Address</h1>
      <Label className="bg-gray-100 my-2" >{player1}</Label>
      <h1>Player 2 Address</h1>
      <Input id="player2" className="bg-gray-100 my-2" value={player2} disabled={state != "NoGame"} onChange={ e => isAddress(e.target.value) && setPlayer2(e.target.value)} />
      <h1>Value</h1>
      <Input id="stake" type="number" className="bg-gray-100 my-2" value={stake} disabled={state != "NoGame"} onChange={ e => setStake(e.target.value)} />
      <h1>Salt</h1>
      <Input id="salt" type="number" className="bg-gray-100 my-2" value={salt} disabled={state != "NoGame"} onChange={ e => setSalt(e.target.value)} />
      <h1>Move</h1>
      <ToggleGroup className="my-2" type="single" size="lg" onValueChange={e => {if (e) setMove(e)}} >
        <ToggleGroupItem value={1}>Rock</ToggleGroupItem>
        <ToggleGroupItem value={2}>Paper</ToggleGroupItem>
        <ToggleGroupItem value={3}>Scissors</ToggleGroupItem>
        <ToggleGroupItem value={4}>Spock</ToggleGroupItem>
        <ToggleGroupItem value={5}>Lizard</ToggleGroupItem>
      </ToggleGroup>
      <h1>{move}</h1>
      {
        state === "NoGame" && <Button disabled={player2 === "" || move === "Null"} onClick={createGame}>Create Game</Button>
        || state === "Player1Done" && <Button disabled={address != player2 || move === "Null"} onClick={play}>Play</Button>
        || state === "Player2Done" && <Button disabled={address != player1} onClick={solve}>Solve</Button>
      }
      {/*state != "NoGame" &&*/ <Button disabled={false && state === "Player1Done" && address != player1 || state === "Player2Done" && address != player2 && false} onClick={timeout}>Timeout</Button>}
      <h1>{state}</h1>
      <h1>{player1}</h1>
      <h1>{contractAddress}</h1>
      <h1>{deployHash}</h1>
    </div>
    
  );
}
  
export default Main;