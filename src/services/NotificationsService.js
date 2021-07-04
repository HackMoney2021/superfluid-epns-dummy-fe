import EPNS_ABI from "../contracts/epnscore.json";
import Web3 from "web3";

require("dotenv").config();

class NotificationsService{
    constructor(){
        this.epnsContractAddress = "0xc882dA9660d29c084345083922F8a9292E58787D";
        this.web3 = null;
        this.epnsContract = null;
    }

    /**epns config
     * 
     * Set up the web3 contract for front end interactiong
     * 
     * @returns {bool} initialised - returns true if the web3 object and contract are initialised successfully
     */
    initialise(){
        const web3 = new Web3(Web3.givenProvider || "http://localhost:8080");
        this.web3 = web3;
        this.epnsContract = new web3.eth.Contract(EPNS_ABI, this.epnsContractAddress)
        return this.web3 !== null && this.epnsContract !== null;
    }


    registerForNotifications(){
        // sanity checks
        if (this.web3 == null) throw new Error("web3 not initialised");
        if (this.epnsContract == null) throw new Error("epns contract not initialised");

        // initialisation
        const msgSender = this.web3.currentProvider.selectedAddress;
        const channelAddress = "0xa1016081D6Da53b4246178eD83922C55F7171e54";

        // make call to contract
        this.epnsContract.methods.subscribe(channelAddress)
            .send({
                from: msgSender
            })
            .then(response => console.log(response))
            .catch(err => console.log(err));

    }



    /**Send Notification 
     * 
     * @description send a notification with the payload provided
     * @param {String} address User Address
     * @param {String} title
     * @param {String} message 
     */
    sendNotification(address, title, message){
        if (this.sdk == null) throw Error("Sdk is not initialised");

        // 3 - payload type - secret
        // false - simulated - not required
        this.sdk.sendNotification(address, title, message, 3, title, message, false);
    }


}

const notificationsService = new NotificationsService();
export default notificationsService;