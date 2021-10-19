import React,{useState, useEffect , Component } from "react";
import Web3 from 'web3';

import Header from './components/Header';
import ArtifyContract from "./contracts/Artify.json";


function App() {
  const [state,setState]=useState({});

  useEffect(() => {
    async function loadWeb3(){
      if(window.ethereum){
        window.web3 = new Web3(window.ethereum);
        await window.ethereum.enable();
      }else if(window.web3){
        window.web3 = new Web3(window.web3.currentProvider);
      }else{
        window.alert('Non Ethereum Browser Detected');
      }
    }
    loadWeb3();
  },[]);
  useEffect(() => {
    async function loadDataFromBlockchain(){
      const web3=window.web3;
      //Loading account from metamask
      const accounts=await web3.eth.getAccounts();
      setState( {account:accounts[0]});
    }
    loadDataFromBlockchain();
  },[]);

  return (
    <Header account={state.account}>
    </Header>
  )
}
export default App;
