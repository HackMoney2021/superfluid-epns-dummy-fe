import "./App.css";
import { useState } from "react";
import Web3 from "web3";
import Button from "react-bootstrap/Button";

// services
import NotificationsService from "./services/NotificationsService";

function App() {
  const [displayAddress, setDisplayAddress] = useState("Not Connected");
  const [wrongNetwork, setWrongNetwork] = useState("");
  const ropstenChainID = "0x3";

  const connectWallet = async () => {
    const web3 = new Web3(Web3.givenProvider || "http://localhost:8080");
    const network = await web3.eth.net.getNetworkType();
    if (network === "ropsten") setWrongNetwork("");
    else setWrongNetwork("Unsupported network, please connect to Ropsten");
    const accounts = await web3.eth.getAccounts();
    setDisplayAddress(accounts[0]);

    // initialise notifications service
    NotificationsService.initialise();
  };

  const addToChannel = () => {
    console.log("Added to channel");
    // two ways to sub to channel:
    //    direct -> user opts in via on-chain event
    //    indirect -> channel can sub user (via address) on thei behalf
    //        (not ideal as if user unsubs they cannt be indirectly added again)

    NotificationsService.registerForNotifications();
  };

  if (window.ethereum) {
    window.ethereum.on("accountsChanged", (accounts) => {
      setDisplayAddress(accounts[0]);
    });
    window.ethereum.on("chainChanged", (chainID) => {
      if (chainID === ropstenChainID) setWrongNetwork("");
      else setWrongNetwork("Unsupported network, please connect to Ropsten");
    });
  }

  return (
    <div className="App d-flex justify-content-center align-items-center">
      <div className="col container">
        <div className="row d-flex justify-content-center">
          <div className="col-4 d-flex justify-content-end">
            <Button variant="light" onClick={connectWallet}>
              Connect Wallet
            </Button>
          </div>
          <div className="col-4">
            <Button variant="light" onClick={addToChannel}>
              Notify Me
            </Button>
          </div>
        </div>
        <div className="pt-4 d-flex justify-content-center">
          <div>Address: {displayAddress}</div>
        </div>
        <div className="pt-4 d-flex justify-content-center">
          <h4>{wrongNetwork}</h4>
        </div>
      </div>
    </div>
  );
}

export default App;
