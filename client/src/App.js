import React,{useState, useEffect , Component } from "react";
import { Puff } from 'react-loading-icons'
import Web3 from 'web3';

import Header from './components/Header';
import Main from './components/Main';

import ArtifyContract from "./contracts/Artify.json";


function App() {
  const [state,setState]=useState({
    account:'',
    artifyContractInstance:'',
    images:[],
    loading:false,
    imageCount:0
  });

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
      setState((prevState)=>{
        return {...prevState,account:accounts[0]};
      });

      //NetworkID of network on which smartcontract deployed
      const networkId = await web3.eth.net.getId();
      const networkData = ArtifyContract.networks[networkId];

      if(networkData){

        const artify = new web3.eth.Contract(ArtifyContract.abi,networkData.address);
        setState((prevState)=>{
          return {...prevState,artifyContractInstance:artify};
        });

        const imageCount=await artify.methods.imageCount().call();
        setState((prevState)=>{
          return {...prevState,imageCount:imageCount};
        });

      }else{
        window.alert(`Contract not deployed on ${networkId}`);
      }
    }
    loadDataFromBlockchain();
  },[]);

  return (
    <div>
      <Header account={state.account}/>
      {
        state.loading?
        <div id="loader" className="text-center mt-5">
          <Puff stroke="#00ff00"  />
        </div>:
        <Main/>
      }
    </div>
    
  )
}
export default App;
