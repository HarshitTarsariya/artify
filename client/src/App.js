import React,{useState, useEffect , Component } from "react";
import { Puff } from 'react-loading-icons'
import Web3 from 'web3';

import Header from './components/Header';
import Main from './components/Main';

import ArtifyContract from "./contracts/Artify.json";

const ipfsClient = require('ipfs-http-client');
const ipfs = ipfsClient({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' });

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

      // Load images
      for (var i = 1; i <= imageCount; i++) {
        const image = await artify.methods.images(i).call();
        setState((prevState)=>{
          return {...prevState,images:[...prevState.images,image]};
        });
      }
      // Sort images. Show highest tipped images first
      setState((prevState)=>{
        return {...prevState,images: prevState.images.sort((a,b) => b.tipAmount - a.tipAmount )};
      });

      setState((prevState)=>{
        return {...prevState,loading: false};
      });
    }else{
      window.alert(`Contract not deployed on ${networkId}`);
    }
  }
  useEffect(() => {
    loadDataFromBlockchain();
  },[]);

  const captureFile = event => {

    event.preventDefault()
    const file = event.target.files[0]
    const reader = new window.FileReader()
    reader.readAsArrayBuffer(file)

    reader.onloadend = () => {
      setState((prevState)=>{
        return {...prevState,buffer: Buffer(reader.result)};
      });
    }
  }

  const uploadImage = async description => {
    console.log("Uploading File to IPFS")
    
    //adding file to the IPFS
    for await (const file of await ipfs.add(state.buffer)) {
      console.log("DONE");
      setState((prevState)=>{
        return {...prevState,loading: true};
      });
      state.artifyContractInstance.methods.uploadImage(file.path, description).send({ from: state.account }).on('transactionHash', (hash) => {
        setState((prevState)=>{
          return {...prevState,loading: false};
        });
      })
      console.log("HERE");
      loadDataFromBlockchain();
    }
  }
  
  const tipImageOwner=(id, tipAmount)=> {
    setState((prevState)=>{
      return {...prevState,loading: true};
    });
    state.artifyContractInstance.methods.tipImageOwner(id).send({ from: state.account, value: tipAmount }).on('transactionHash', (hash) => {
      setState((prevState)=>{
        return {...prevState,loading: false};
      });
    })
  }

  return (
    <div className="container h-500 d-flex justify-content-center">
      <Header account={state.account}/>
      {
        state.loading?
        <div id="loader" className="text-center mt-5">
          <Puff stroke="#00ff00"  />
        </div>:
        <Main 
          captureFile={captureFile}
          uploadImage={uploadImage}
          images={state.images}
          tipImageOwner={tipImageOwner}
        />
      }
    </div>
    
  )
}
export default App;
