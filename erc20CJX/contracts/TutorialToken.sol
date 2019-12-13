pragma solidity ^0.5.0;

//https://www.trufflesuite.com/tutorials/robust-smart-contracts-with-openzeppelin

import "openzeppelin-solidity/contracts/token/ERC20/ERC20Mintable.sol";

contract TutorialToken is ERC20Mintable {
    string public name = "CJXToken";
    string public symbol = "CJX";
    uint8 public decimals = 4;
    uint public INITIAL_SUPPLY = 100000000000000;

    constructor() public {
        _mint(msg.sender, INITIAL_SUPPLY);
    }

    function burn(uint256 amount) public {
        _burn(_msgSender(), amount);
    }

    function burnFrom(address account, uint256 amount) public {
        _burnFrom(account, amount);
    }

}
