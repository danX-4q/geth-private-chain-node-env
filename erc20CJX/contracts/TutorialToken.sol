pragma solidity ^0.5.0;

//https://www.trufflesuite.com/tutorials/robust-smart-contracts-with-openzeppelin

//import "openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";
import "openzeppelin-solidity/contracts/token/ERC20/ERC20Mintable.sol";
import "openzeppelin-solidity/contracts/token/ERC20/ERC20Burnable.sol";

contract TutorialToken is ERC20Mintable,ERC20Burnable {
    string public name = "CJXToken";
    string public symbol = "CJX";
    uint8 public decimals = 4;
    uint public INITIAL_SUPPLY = 10000000000;

    constructor() public {
        _mint(msg.sender, INITIAL_SUPPLY);
    }

}
