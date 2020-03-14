pragma solidity ^0.5.0;

//https://www.trufflesuite.com/tutorials/robust-smart-contracts-with-openzeppelin

import "openzeppelin-solidity/contracts/token/ERC20/ERC20Mintable.sol";
import "openzeppelin-solidity/contracts/math/SafeMath.sol";

contract TutorialToken is ERC20Mintable {
    using SafeMath for uint256;
    ////////////////////////////////////////

    string public name = "TimeLockTransferToken";
    string public symbol = "TLT";
    uint8 public decimals = 4;
    uint public INITIAL_SUPPLY = 100000000000000;

    ////////////////////////////////////////

    struct RWIndex {
        uint256    rIndex;
        uint256    wIndex;
    }

    struct LockItem {
        uint256 releaseTime;
        uint256 amount;
        address from;
    }

    mapping(address => LockItem[]) private  _timelocks;
    mapping(address => RWIndex) private     _itemindex;
    mapping(address => uint256) private     _locked_balance;

    ////////////////////////////////////////

    event TimeLock(address from, uint256 releaseTime, uint256 amount, address to);
    event Unlock(address from, uint256 releaseTime, uint256 amount, address to);

    ////////////////////////////////////////
    ////////////////////////////////////////
    ////////////////////////////////////////

    constructor() public {
        _mint(msg.sender, INITIAL_SUPPLY);
    }

    function burn(uint256 amount) public {
        _burn(_msgSender(), amount);
    }

    function burnFrom(address account, uint256 amount) public {
        _burnFrom(account, amount);
    }

    ////////////////////////////////////////
    ////////////////////////////////////////
    ////////////////////////////////////////

    /*
     *  调用者锁定账上余额，指定在某个时间之后某账户(也可以是自己)才可以获取到该笔余额
     *  1) 多次调用时，releaseTime必须有序递增。此约束条件目的是简化合约的gas消耗量。
     *  2) balanceOf查询的余额不包含锁定期内的。
     *  3) 已过锁定期的余额，必须由自己或他人调用unlock解锁。
     */
    function timelock(uint256 releaseTime, uint256 amount, address to) public returns (bool) {
        require(releaseTime >= block.timestamp, "timelock: releaseTime must >= block.timestamp");
        require(amount > 0, "timelock: amount must >= 0");
        //////////
        address from = msg.sender;
        _transfer(from, address(this), amount);
        //////////
        RWIndex memory rwIndex = _itemindex[to];
        require(rwIndex.wIndex >= rwIndex.rIndex, "timelock: rwIndex.wIndex must >= rwIndex.rIndex");
        if(rwIndex.wIndex > rwIndex.rIndex) {
            LockItem memory lastItem = _timelocks[to][rwIndex.wIndex - 1];
            require(releaseTime > lastItem.releaseTime, "timelock: current releaseTime must > last item's releaseTime");
        }
        _timelocks[to].push(LockItem(releaseTime, amount, from));
        _itemindex[to].wIndex++;
        _locked_balance[to] = _locked_balance[to].add(amount);
        //////////
        emit TimeLock(from, releaseTime, amount, to);
        return (true);  //like erc20::transfer
    }

    /*
     *  领取某账户(调用者或他人)最多一笔的当前已解锁资产。
     *  谨慎地与tryUnlock配合使用:
     *    unlock交易发出但未被执行时，tryUnlock还是仍然读取到旧数据。
     *    建议通过getRWIndex观察rIndex，它有变化时再重复调用tryUnlock。
     */
    function unlock(address account) public returns (bool) {
        RWIndex memory rwIndex = _itemindex[account];
        require(rwIndex.wIndex > rwIndex.rIndex, "timelock: rwIndex.wIndex must > rwIndex.rIndex");
        //////////
        LockItem memory firstItem = _timelocks[account][rwIndex.rIndex];
        require(block.timestamp >= firstItem.releaseTime, "unlock: block.timestamp must >= firstItem.releaseTime");
        uint256 amount = firstItem.amount;
        _transfer(address(this), account, amount);
        _itemindex[account].rIndex++;
        _locked_balance[account] = _locked_balance[account].sub(amount, "unlock: locked balance must >= amount to be unlocked");
        //////////
        emit Unlock(firstItem.from, firstItem.releaseTime, firstItem.amount, account);
        return (true);  //like erc20::transfer
    }

    ////////////////////
    ////////////////////
    ////////////////////

    /*
     *  读取某账户的锁定队列游标
     */
    function getRWIndex(address account) public view returns (uint256 rIndex, uint256 wIndex) {
        RWIndex memory rwIndex = _itemindex[account];
        return (rwIndex.rIndex, rwIndex.wIndex);
    }

    /*
     *  读取某账户的某条锁定信息，不管它是否解锁
     */
    function getLockItem(address account, uint256 index) public view returns (uint256 releaseTime, uint256 amount, address from) {
        RWIndex memory rwIndex = _itemindex[account];
        if(index < rwIndex.wIndex) {
            LockItem memory item = _timelocks[account][index];
            return (item.releaseTime, item.amount, item.from);
        } else {
            return (0, 0, address(0));
        }
    }

    /*
     *  读取某账户的某条未解锁的锁定信息
     */
    function getLockingItem(address account, uint256 index) public view returns (uint256 releaseTime, uint256 amount, address from) {
        RWIndex memory rwIndex = _itemindex[account];
        if(rwIndex.rIndex <= index && index < rwIndex.wIndex) {
            LockItem memory item = _timelocks[account][index];
            return (item.releaseTime, item.amount, item.from);
        } else {
            return (0, 0, address(0));
        }
    }

    ////////////////////
    ////////////////////
    ////////////////////

    /*
     *  以当前的链上时间戳，尝试某账户是否存在待解锁的锁定信息
     *    参阅unlock的说明。
     */
    function tryUnlock(address account) public view returns (bool success) {
        RWIndex memory rwIndex = _itemindex[account];
        if(rwIndex.wIndex <= rwIndex.rIndex) {
            return (false);
        }
        LockItem memory firstItem = _timelocks[account][rwIndex.rIndex];
        return (block.timestamp >= firstItem.releaseTime);
    }

    /*
     *  查询某账户(调用者或他人)待解锁的余额总数
     */
    function lockedBalanceOf(address account) public view returns (uint256 balance) {
        return _locked_balance[account];
    }
}
