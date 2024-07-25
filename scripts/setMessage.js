const hre = require("hardhat");
const { encryptDataField, decryptNodeReponse } = require("@swisstronik/utils");

const sendShieldedTransaction = async (signer, destination, data, value) => {
    // Get the RPC link from the network configuration
    const rpclink = hre.network.config.url;

    // Encrypt transaction data
    const [encryptedData] = await encryptDataField(rpclink, data);

    // Construct and sign transaction with encrypted data
    return await signer.sendTransaction({
        from: signer.address,
        to: destination,
        data: encryptedData,
        value,
    });

    async function main() {
        //address of the deployed contract
        const contractAddress = "0x610A36bee58f2B046D0A82b782485b27E567a507";

        //get the signer
        const [signer] = await hre.ethers.getSigners();

        //construct a contract instance
        const contractFactory = await hre.ethers.getContractFactory("Swisstronik");
        const contract = contractFactory.attach(contractAddress);
        const functionName = "setMessage";
        const messageToSet = "Hello Swisstronik!!";

        //send a shielded transaction to get a message in the contract
        const setMessageTx = await sendShieldedTransaction(signer, contractAddress, contract.interface.encodeFunctionData("setMessage", ["Hello Swisstronik!!"]), 0);
        await setMessageTx.wait();

        //return a transactionResponse object
        console.log("Transaction Receipt: ", setMessageTx);

        main().catch((error) => {
            console.error(error);
            process.exitCode = 1;
        });
    }
};