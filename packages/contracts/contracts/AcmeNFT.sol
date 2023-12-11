// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "./AcmeMemberNFT.sol";

contract AcmeNFT is 
    ERC721,
    ERC721Enumerable,
    ERC721URIStorage,
    ERC721Burnable,
    Ownable, 
    ReentrancyGuard 
{
    using Counters for Counters.Counter;
    using SafeMath for uint256;

    Counters.Counter private _tokenIdCounter;

    // Reference to the first NFT contract
    AcmeMemberNFT private _AcmeMemberNFTContract;

    // Maximum NFTs per transaction
    uint256 public constant MAX_NFTS_PER_TX = 5;

    // Total supply of the second NFT
    uint256 public constant MAX_SUPPLY = 40;

    // Costo di mint per i primi 15 NFT
    uint256 public constant FIRST_15_COST = 50000; // 0.00000005 ETH in Wei

    // Costo di mint per i restanti NFT
    uint256 public constant REST_OF_NFT_COST = 600000000000000; // 0.0006 ETH in Wei

    // Costo per l'opzione di acquisto di un nome personalizzato
    uint256 public constant CUSTOM_NAME_COST = 400000000000000; // 0.0004 ETH in Wei

    // Mapping to track whether an address has minted an NFT
    mapping(address => bool) private _hasMinted;

    // Mapping to track custom names for NFTs
    mapping(uint256 => string) private _customNames;

    // Event emitted when an NFT is minted
    event NFTMinted(address indexed owner, uint256 tokenId);

    // Event emitted when a custom name is purchased
    event CustomNamePurchased(uint256 tokenId, string customName);

    constructor(address acmeMemberNFTContractAddress)
        ERC721("AcmeNFT", "ACME")
    {
        // Set the reference to the first NFT contract
        _AcmeMemberNFTContract = AcmeMemberNFT(acmeMemberNFTContractAddress);
    }

    // Function to mint an NFT with optional custom name
    function safeMint(address to, string memory uri, string memory customName)
        public
        payable
        nonReentrant
        returns (uint256)
    {
        // Ensure the caller is a possessor of the first NFT
        require(
            _AcmeMemberNFTContract.hasMinted(to),
            "You must own the first NFT to mint the second NFT"
        );

        // Calculate the minting cost based on the current supply
        uint256 tokenId = _tokenIdCounter.current();
        uint256 mintCost;

        if (tokenId < 15) {
            mintCost = FIRST_15_COST;
        } else {
            mintCost = REST_OF_NFT_COST;
        }

        // If the caller has chosen a custom name, add the cost
        if (bytes(customName).length > 0) {
            mintCost = mintCost.add(CUSTOM_NAME_COST);
        }

        // Ensure the sent value is correct
        require(msg.value >= mintCost, "Insufficient funds to mint the NFT");

        // Ensure the maximum NFTs per transaction limit is not exceeded
        require(
            _tokenIdCounter.current().add(1) <= MAX_SUPPLY &&
                _tokenIdCounter.current().add(1) <= tokenId.add(MAX_NFTS_PER_TX),
            "Exceeds the maximum NFTs per transaction limit or the total supply limit"
        );

        // Mint the NFT
        _tokenIdCounter.increment();
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);

        if (bytes(customName).length > 0) {
            // Emit an event for the custom name purchase
            emit CustomNamePurchased(_tokenIdCounter.current(), customName);
        }

        // Emit the minted event
        emit NFTMinted(to, _tokenIdCounter.current());

        return tokenId;
    }

    // Function to retrieve the custom name for an NFT
    function getCustomName(uint256 tokenId) public view returns (string memory) {
        return _customNames[tokenId];
    }
    
    function getTokenByIndex(address owner, uint256 index) public view returns (uint256) {
        return tokenOfOwnerByIndex(owner, index);
    }

    // Function to purchase a custom name for an NFT
    function purchaseCustomName(uint256 tokenId, string memory customName)
        public
        payable
        nonReentrant
    {
        // Ensure the caller is the owner of the NFT
        require(_isApprovedOrOwner(msg.sender, tokenId), "You are not the owner of the NFT");

        // Ensure the custom name is not empty
        require(bytes(customName).length > 0, "Specify a custom name");

        // Ensure the sent value is correct
        require(msg.value >= CUSTOM_NAME_COST, "Insufficient funds to purchase the custom name");

        // Set the custom name for the NFT
        _customNames[tokenId] = customName;

        // Emit an event for the custom name purchase
        emit CustomNamePurchased(tokenId, customName);
    }

    // The following functions are overrides required by Solidity.

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId
    ) internal override(ERC721, ERC721Enumerable) {
        super._beforeTokenTransfer(from, to, tokenId);
    }

    function _burn(uint256 tokenId)
        internal
        override(ERC721, ERC721URIStorage)
    {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
