// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract AcmeMemberNFT is
    ERC721,
    ERC721Enumerable,
    ERC721Burnable,
    Ownable
{
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIdCounter;

    uint256 public constant MAX_SUPPLY = 100;

    // Mapping to track whether an address has minted an NFT
    mapping(address => bool) private _hasMinted;

    constructor() ERC721("AcmeMemberNFT", "ACMEm") {}

    // Event emitted when an NFT is minted
    event NFTMinted(address indexed owner, uint256 tokenId);

    // Function to mint an NFTs
    function safeMint(address to) public returns (uint256) {
        // Ensure the caller hasn't already minted an NFT
        require(!_hasMinted[to], "You have already minted an NFT");

        uint256 tokenId = _tokenIdCounter.current();

        // Ensure the total supply hasn't been reached
        require(tokenId < MAX_SUPPLY, "Maximum supply reached");
        
        // Increment total supply
        _tokenIdCounter.increment();

        // Mint the NFT
        _safeMint(to, tokenId);

        // Mark the address as having minted
        _hasMinted[to] = true;

        // Emit the minted event
        emit NFTMinted(msg.sender, tokenId);

        return tokenId;
    }

    // Function to check if an address has already minted
    function hasMinted(address _address) external view returns (bool) {
        return _hasMinted[_address];
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
        override(ERC721)
    {
        super._burn(tokenId);
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
