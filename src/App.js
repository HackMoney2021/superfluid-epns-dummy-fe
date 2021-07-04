import "./App.css";
import React, { useState } from "react";
import Web3 from "web3";
import { Button, Tooltip, OverlayTrigger } from "react-bootstrap";

// services
import NotificationsService from "./services/NotificationsService";

function App() {
  const [displayAddress, setDisplayAddress] = useState("Not Connected");
  const [wrongNetwork, setWrongNetwork] = useState("");
  const ropstenChainID = "0x3";
  // const [channelAddress, setChannelAddress] = useState("");

  React.useEffect(() => {
    connectWallet();
  }, []);

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

  const renderTooltip = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      Click to receive stream updates via EPNS
    </Tooltip>
  );

  return (
    <div className="App d-flex justify-content-center align-items-center">
      <div className="col">
        <div className="pb-4 d-flex justify-content-center">
          <h4>{wrongNetwork}</h4>
        </div>
        <div className="pb-4 d-flex justify-content-center">
          <div>Address: {displayAddress}</div>
        </div>
        <div className="d-flex justify-content-center">
          <OverlayTrigger
            placement="top"
            delay={{ show: 250, hide: 400 }}
            overlay={renderTooltip}
          >
            <Button
              className="btn"
              variant="outline-dark"
              onClick={addToChannel}
            >
              Notify Me
            </Button>
          </OverlayTrigger>
        </div>
      </div>
    </div>
  );
}

export default App;
