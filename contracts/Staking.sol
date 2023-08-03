// SPDX-License-Identifier: MIT
// compiler version must be greater than or equal to 0.8.17 and less than 0.9.0
pragma solidity ^0.8.17;
import "./erc20.sol";

contract StakingContract {
  ERC20TOKEN tokenContract;
    
    struct Staking {
        uint256 amount;
        uint256 time;
        string staking_type;
        bool isFixed;
        address owner;
        bool claim;
      }
      
  uint256 penaltyPercentage=3;
  uint256 fixedInterestRate=6;
  uint256 UnfixedInterestRate=3;
  uint256 expiryTime=block.timestamp+60;
  uint256 Interest;
      
    mapping(address => Staking) public staking_detail;
    event TokenStaked(address user, uint256 amount, uint256 time);
    // event UnstakeToken(address user);
        constructor(ERC20TOKEN _tokenContract){
            tokenContract=_tokenContract;
         }

     function staking(uint256 _amount, uint256 _duration , string memory _staking_type, bool _isFixed) public{
     require(tokenContract.balanceOf(msg.sender) >= _amount, "balance is <= token");
          if (keccak256(abi.encodePacked(_staking_type))==keccak256(abi.encodePacked("fixed_stake"))){
               require(_amount > 0, "token is <= 0");
               staking_detail[msg.sender].amount = _amount;
               staking_detail[msg.sender].staking_type= _staking_type;
               staking_detail[msg.sender].time = expiryTime+_duration;
               staking_detail[msg.sender].owner=msg.sender;
               staking_detail[msg.sender].isFixed=_isFixed; 
                staking_detail[msg.sender].claim= false;
            tokenContract.transfer(msg.sender, address(this) , _amount);
            emit TokenStaked(msg.sender, _amount, block.timestamp);
          }  
          else if (keccak256(abi.encodePacked(_staking_type))==keccak256(abi.encodePacked("Unfixed_stake"))){
              require(_amount > 0, "token is <= 0");
              staking_detail[msg.sender].amount = _amount;
              staking_detail[msg.sender].staking_type= _staking_type;
              staking_detail[msg.sender].owner=msg.sender;
              staking_detail[msg.sender].isFixed=_isFixed;
              staking_detail[msg.sender].claim= false;
              staking_detail[msg.sender].time = expiryTime;
              tokenContract.transfer(msg.sender, address(this),_amount); 
              emit TokenStaked(msg.sender, _amount , block.timestamp);   
   }
        }
      function UnStaking(address user) public{
       require(msg.sender==staking_detail[msg.sender].owner,"invalid user");

          if(staking_detail[user].isFixed==true){
            if(staking_detail[user].time>block.timestamp){
             
             Interest=(staking_detail[user].amount*fixedInterestRate)/100;
             uint256 penaltyAmount=(staking_detail[user].amount*penaltyPercentage)/100;
             staking_detail[user].amount=staking_detail[user].amount+Interest-penaltyAmount;
              tokenContract.transfer(address(this), user,  staking_detail[user].amount);
              delete staking_detail[user];
              staking_detail[user].claim=true;

            }
            else if(staking_detail[user].time<=block.timestamp){
              Interest=(staking_detail[user].amount*fixedInterestRate)/100;
              staking_detail[user].amount=staking_detail[user].amount+Interest;
              tokenContract.transfer(address(this), user,  staking_detail[user].amount);
               delete staking_detail[user];
               staking_detail[user].claim=true;
            }
          }
          else if(staking_detail[user].isFixed==false){
             Interest=(staking_detail[user].amount*UnfixedInterestRate)/100;
             staking_detail[user].amount=staking_detail[user].amount+Interest;
             tokenContract.transfer(address(this), user,  staking_detail[user].amount);
              delete staking_detail[user];
              staking_detail[user].claim=true;
          }
          
      }
        function claimedRewards(address _address) public view returns (uint256) {
         if (staking_detail[_address].isFixed == true) {
          if (block.timestamp > staking_detail[_address].time) {
            return staking_detail[_address].amount + Interest;
        } else {
          uint256 penaltyAmount=(staking_detail[_address].amount*penaltyPercentage)/100;

            return staking_detail[_address].amount+Interest-penaltyAmount;
        }
    } else {
        return staking_detail[_address].amount + Interest;
    }
}
   function unclaimedRewards(address _address) public view returns(uint256) {
         if (staking_detail[_address].isFixed == true) {
         if(staking_detail[_address].claim== true){
            return 0;
        } else {
            return Interest;
        }
      } 
      else{
        if(staking_detail[_address].claim== true){
        return 0;
        }
        else {
          return Interest;
        }
      }
  }
    
   function getStaking_Detail(address _addresss) public view returns(Staking memory){
    return staking_detail[_addresss];
   }
}
