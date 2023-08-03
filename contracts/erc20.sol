// SPDX-License-Identifier: GPL-3.0


pragma solidity ^0.8.17;

contract ERC20TOKEN {
    string public  name = "EthTK";
    string public symbol = 'ETK';
    uint public  decimals = 10000;
    event Approval(address indexed tokenOwner,address indexed spender ,uint tokens);
    event Transfer(address indexed spender, address indexed to , uint value);    

    

    mapping(address=>uint) balances;
    mapping(address=>mapping(address =>uint)) allowed;

    uint totalSupply_ =10000;
    address admin;
    
    constructor()  {
         balances[msg.sender]= totalSupply_;
         admin = msg.sender;

    }

    function totalSupply() public  view returns(uint){
        return totalSupply_;

    }

    function balanceOf(address tokenOwner) public  view returns(uint){
        return balances[tokenOwner];
    }

    function transfer(address sender,address receiver,uint numTokens) public  returns(bool){
        require(numTokens <= balances[sender]);
        balances[sender] -=numTokens;
        balances[receiver] += numTokens;
        emit Transfer(sender,receiver,numTokens);
        return true;
    }

    modifier onlyAdmin{
        require(msg.sender == admin , "only admin can run this function");
        _;
    }

    function mint(uint _qty) public  returns(uint){
        totalSupply_ += _qty;
        balances[msg.sender] += _qty;
        return totalSupply_; 
    }

    function burn(uint _qty) public  onlyAdmin returns(uint){
        totalSupply_ -= _qty;
        balances[msg.sender] -= _qty;
        return totalSupply_; 
    }

    function allowence(address _owner,address _spender) public view returns(uint){
        return allowed[_owner][_spender];
    }

    function approve(address _owner,address _spender,uint _value) public returns(uint){
        allowed[_owner][_spender] =_value;
        emit Approval(_owner,_spender,_value);
        return _value;
    }


    //spender will run transfer from function
    function transferFrom(address _from,address _to,uint _value) public returns (bool){
        uint allow = allowed[_from][msg.sender];
        require(balances[_from]>=_value && allow>=_value);
        balances[_to] += _value;
        balances[_from] -= _value;
        allowed[_from][msg.sender] -= _value; 
         
         return true;
    }
}