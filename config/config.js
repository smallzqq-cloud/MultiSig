const { ethers, network } = require("hardhat");
const fs = require('fs');
const config = {
    signers: ["0x5EfAC4Bc165338F511F2eb4411E393AF25D37b23", "0x57eD5c3B5ce571f612E9A81BCf59e476A8A88902", "0x2380C75132cD23feb8ADE113e7cB0Ef8f3BA8ae3"],
    pawnTokenName: "Pawnfi Token",
    pawnTokenSymbol: "PAWN",
    pawnTokenTotalSupply: ethers.utils.parseEther("100000000"),
    signer: "0x5EfAC4Bc165338F511F2eb4411E393AF25D37b23",
    constant: getJson("../config/constant.json"),
    helperFile: "../config/" + getPrefixes() + "helper_"+ network.name +".json",
    tokenFile: "../config/" + getPrefixes() + "tokens_"+ network.name +".json",
    tokenInfos: getJson("../config/" + getPrefixes() + "tokens_"+ network.name +".json")
}

function getPrefixes() {
    const env = process.env.NODE_ENV;
    if(env == "dev") {
        return "dev_";
    }
    return "";
}

function readFileSync(filename) {
    let rawdata = fs.readFileSync(filename, "utf-8");
    return rawdata;
}

function getJson(filename) {
    let rawdata = readFileSync(filename);
    let json = JSON.parse(rawdata);
    return json;
}

module.exports = config;