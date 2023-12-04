import fs from "fs";
import { config, ethers } from "hardhat";

async function acmeContractsDeploy() {
  const AcmeMemberNFT = await (
    await ethers.getContractFactory("AcmeMemberNFT")
  ).deploy();
  await AcmeMemberNFT.deployed();

  console.log("AcmeMemberNFT deployed to:", AcmeMemberNFT.address);

  const AcmeNFT = await (
    await ethers.getContractFactory("AcmeNFT")
  ).deploy(AcmeMemberNFT.address);
  AcmeNFT;
  await AcmeNFT.deployed();

  console.log("AcmeNFT deployed to:", AcmeNFT.address);

  saveFrontendFiles(
    AcmeMemberNFT.address,
    "AcmeMemberNFT",
    AcmeNFT.address,
    "AcmeNFT"
  );
}

async function main() {
  await acmeContractsDeploy();
}

function saveFrontendFiles(
  contractAddress: string,
  contractName: string,
  nftContractAddress: string,
  nftContractName: string
) {
  fs.writeFileSync(
    `${config.paths.artifacts}/contracts/contractAddress.ts`,
    `export const ${contractName} = '${contractAddress}'\nexport const ${nftContractName} = '${nftContractAddress}'\n`
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
