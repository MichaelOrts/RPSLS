'use client'

import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { ToggleGroup, ToggleGroupItem } from "./ui/toggle-group";
import { Button } from "./ui/button";
import { useToast } from "../hooks/use-toast";

import { createContext, useActionState, useContext, useEffect, useState } from "react";

import {  useReadContracts, useAccount, useWriteContract, useWaitForTransactionReceipt, useTransactionReceipt, useDeployContract } from "wagmi";
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
  const [lastAction, setLastAction] = useState(0);

  const { toast } = useToast();

  const { deployContract, data: deployHash, error : deployError } = useDeployContract();

  const { data: deployData } = useTransactionReceipt({hash: deployHash});

  const { data: readData, error: readError, refetch: readRefetch } = useReadContracts({
    allowFailure: false,
    contracts: [
      {
        address: contractAddress,
        abi: rpsAbi,
        functionName: 'j1',
        account: address
      },
      {
        address: contractAddress,
        abi: rpsAbi,
        functionName: 'j2',
        account: address
      },
      {
        address: contractAddress,
        abi: rpsAbi,
        functionName: 'lastAction',
        account: address
      },
      {
        address: contractAddress,
        abi: rpsAbi,
        functionName: 'stake',
        account: address
      },
      {
        address: contractAddress,
        abi: rpsAbi,
        functionName: 'c2',
        account: address
      }
    ]
  });

  const {writeContract, isSuccess : writeSuccess, error : writeError } = useWriteContract();

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

  const updateContractAddress = (newAddress) => {
    setContractAddress(newAddress);
    if(contractAddress){
      readRefetch();
    }
  }

  const play = async () => {
    await writeContract({
      address: contractAddress,
      abi: rpsAbi,
      functionName: 'play',
      value: stake,
      args: [move]
    });
  }

  const solve = async () => {
    await writeContract({
      address: contractAddress,
      abi: rpsAbi,
      functionName: 'solve',
      value: stake,
      args: [move, salt]
    });
  }

  const timeout = async () => {
    const timeoutFunction = player1 === address && 'j2Timeout' 
      || player2 === address && 'j1Timeout';
    await writeContract({
      address: contractAddress,
      abi: rpsAbi,
      functionName: timeoutFunction
    });
  }

  useEffect(() => {
    if(deployData) {
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
  }, [deployData]);

  useEffect(() => {
    if(readData){
      setPlayer1(readData[0]);
      setPlayer2(readData[1]);
      setLastAction(readData[2]);
      setStake(readData[3]);
      setSalt(0);
      if(readData[4] == 0){
        setState("Player1Done");
      }else if(stake == 0){
        setState("GameEnded");
      }else{
        setState("Player2Done");
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [readData]);

  useEffect(() => {
    if(writeSuccess) {
      toast({
        title: "Write Ok",
        className: "bg-lime-200",
        duration: 5000,
        isClosable: true
      });
      readRefetch();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [writeSuccess]);

  useEffect(() => {
    const error = deployError && 'Deployment Error'
      || readError && 'Read Contract Error'
      || writeError && 'Write Contract Error';
    const message = deployError && deployError.message
    || readError && readError.message
    || writeError && writeError.message;
    if(error){
      toast({
        title: error,
        description: message,
        className: "bg-red-200",
        duration: 5000,
        isClosable: true
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deployError, readError, writeError]);

  return (
    
    <div className="text-4xl text-bold text-center">
      <h1>Contract Address</h1>
      <Input id="contractAddress" className="bg-gray-100 my-2" value={contractAddress} onChange={ e => isAddress(e.target.value) && updateContractAddress(e.target.value)} />
      <h1>Player 1 Address</h1>
      <Label className="bg-gray-100 my-2" >{player1}</Label>
      <h1>Player 2 Address</h1>
      <Input id="player2" className="bg-gray-100 my-2" value={player2} disabled={state != "NoGame"} onChange={ e => isAddress(e.target.value) && setPlayer2(e.target.value)} />
      <h1>Value</h1>
      <Input id="stake" type="number" className="bg-gray-100 my-2" value={stake} disabled={state != "NoGame"} onChange={ e => setStake(e.target.value)} />
      <h1>Salt</h1>
      <Input id="salt" type="number" className="bg-gray-100 my-2" value={salt} disabled={state === "Player1Done"} onChange={ e => setSalt(e.target.value)} />
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
        state === "NoGame" && <Button disabled={player2 === "" || move == 0} onClick={createGame}>Create Game</Button>
        || state === "Player1Done" && <Button disabled={address != player2 || move == 0} onClick={play}>Play</Button>
        || state === "Player2Done" && <Button disabled={address != player1} onClick={solve}>Solve</Button>
      }
      {state === "Player1Done" || state === "Player2Done" && <Button disabled={false && state === "Player1Done" && address != player1 || state === "Player2Done" && address != player2 && false} onClick={timeout}>Timeout</Button>}
      <h1>{state}</h1>
      <h1>{player1}</h1>
      <h1>{player2}</h1>
      <h1>{lastAction.toString()}</h1>
      <h1>{stake.toString()}</h1>
      <h1>{contractAddress}</h1>
      <h1>{readError ? readError.message : ''}</h1>
    </div>
    
  );
}
  
export default Main;