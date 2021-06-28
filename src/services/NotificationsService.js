import NotificationHelper from "@epnsproject/backend-sdk";
import { ExceptionHandler } from "winston";
import EPNS_ABI from "../contracts/epnscore.json";

require("dotenv").config();

class NotificationsService{
    constructor(){
        this.epnsHelper = null;
        this.epnsContractAddress = "0xc882dA9660d29c084345083922F8a9292E58787D";
        this.sdk = null;
    }

    /**epns config
     * 
     * follow the steps on the epns github repo for inisialising their sdk kit
     * 
     * potential problems: the network tab within epnsSettings are not defined - it may not be a string
     */
    initialise(){
        const infuraSettings = {
            projectID: process.env.infura_proj_id,
            projectSecret: process.env.infura_proj_secret
        };

        const settings = {
            infura: infuraSettings
        };

        const epnsSettings = {
            network: "ropsten",
            contractAddress: this.epnsContractAddress,
            contractABI: EPNS_ABI
        }

        // create an instance of the epns helper
        this.sdk = NotificationHelper("ropsten", process.env.notif_priv_key, settings, epnsSettings);
        
        // return true if sdk initialises correctly
        return this.sdk !== null ? true : false;
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