const { ethers } = require("hardhat");
const { expect } = require("chai");
const { time } = require('@nomicfoundation/hardhat-network-helpers');


describe('ERC20TOKEN Or Staking', function () {
  let ERC20Token;
  let erc20Token;
  let owner;
  let spender;
  const approvalAmount = 500;
  let Staking;
  let stoke;

  const amountToStake = 100;
 
  beforeEach(async function () {
    ERC20Token = await hre.ethers.getContractFactory('ERC20TOKEN');
    Staking = await hre.ethers.getContractFactory('StakingContract');
    erc20Token = await ERC20Token.deploy();
    stoke = await Staking.deploy(erc20Token.address);
    [owner, spender, addr, addr2] = await ethers.getSigners();
    // console.log("Contract deployed to: ", owner.address);
  });
  it('should approve allowance for spender', async function () {
    const appr = await erc20Token.approve(owner.address, spender.address, approvalAmount, { from: owner.address });
    const allowance = await erc20Token.allowence(owner.address, spender.address);
    expect(allowance).to.equal(approvalAmount);
  });
  it("should return the correct allowance", async function () {
    const allowanceValue = 100// Adjust according to your needs
    await erc20Token.approve(owner.address, spender.address, allowanceValue);

    // Call the allowance function
    const returnedAllowance = await erc20Token.allowence(owner.address, spender.address);

    // Assertions
    expect(returnedAllowance).to.equal(allowanceValue);
  });
  it("owner can transfer the token", async function () {
    const _amount = 1000;
    await erc20Token.transfer(owner.address, stoke.address, _amount);
    expect(await erc20Token.balanceOf(stoke.address)).to.equal(_amount);
  });
  it("Should checking staking the fixed amount", async function () {
    let isFixed = true;
    const _amount = 1000;
    const duration = 100;
    const stakingType = "fixed_stake";
    await erc20Token.transfer(owner.address, addr.address, _amount);
    await stoke.connect(addr).staking(amountToStake, duration, stakingType, isFixed);

    const stakingDetails = await stoke.getStaking_Detail(addr.address);

    expect(stakingDetails.amount).to.equal(amountToStake);
  });
  it("Should checking staking the type", async function () {
    let isFixed = true;
    const _amount = 1000;
    const stakingType = "fixed_stake";
    const duration = 100;
    await erc20Token.transfer(owner.address, addr.address, _amount);
    await stoke.connect(addr).staking(amountToStake, duration, stakingType, isFixed);
    const stakingDetails = await stoke.getStaking_Detail(addr.address);
    expect(stakingDetails.staking_type).to.equal(stakingType);
  });
  it("Should checking staking the fixed duration", async function () {
    let isFixed = true;
    const _amount = 1000;
    const stakingType = "fixed_stake";
    const duration = 100;
    await erc20Token.transfer(owner.address, addr.address, _amount);
    await stoke.connect(addr).staking(amountToStake, duration, stakingType, isFixed);
    const stakingDetails = await stoke.getStaking_Detail(addr.address);
    expect(stakingDetails.time).to.be.above(duration);

  });
  it("Should checking staking the fixed amount", async function () {
    let isFixed = true;
    const _amount = 1000;
    const stakingType = "fixed_stake";
    const duration = 100;
    await erc20Token.transfer(owner.address, addr.address, _amount);
    await stoke.connect(addr).staking(amountToStake, duration, stakingType, isFixed);

    const stakingDetails = await stoke.getStaking_Detail(addr.address);

    expect(stakingDetails.isFixed).to.equal(isFixed);


  });
  it("should allow staking Unfixed_stake amount", async () => {
    const _amount = 1000;
    const stakingType = "Unfixed_stake";
    const duration = 100;
    let isFixed = false;
    await erc20Token.transfer(owner.address, addr.address, _amount);
    // await expect(stoke.staking(amountToStake, 0, stakingType, true));
    await stoke.connect(addr).staking(amountToStake, 0, stakingType, isFixed);

    const stakingDetails = await stoke.getStaking_Detail(addr.address);
    expect(stakingDetails.amount).to.equal(amountToStake);

  });
  it("should allow staking Unfixed_stake type", async () => {
    const _amount = 1000;
    const stakingType = "Unfixed_stake";
    let isFixed = false;
    await erc20Token.transfer(owner.address, addr.address, _amount);

    await stoke.connect(addr).staking(amountToStake, 0, stakingType, isFixed);
    const stakingDetails = await stoke.getStaking_Detail(addr.address);
    expect(stakingDetails.staking_type).to.equal(stakingType);
  });
  it("should allow staking Unfixed_stake staked or not", async () => {
    const _amount = 1000;
    const stakingType = "Unfixed_stake";
    let isFixed= false;
    await erc20Token.transfer(owner.address, addr.address, _amount);

    await stoke.connect(addr).staking(amountToStake, 0, stakingType, isFixed);
    const stakingDetails = await stoke.getStaking_Detail(addr.address);
    expect(stakingDetails.isFixed).to.equal(isFixed);
  });
  it("should allow staking Unfixed_stake duration", async () => {
    const _amount = 1000;
    let isFixed= false;
    const stakingType = "Unfixed_stake";
    await erc20Token.transfer(owner.address, addr.address, _amount);
    await stoke.connect(addr).staking(amountToStake, 0, stakingType, isFixed);
    const stakingDetails = await stoke.getStaking_Detail(addr.address);
    expect(stakingDetails.time).to.above(0);

  });

  it("should unstake unfixed duration", async function () {
    const amount = 1000;
    const stakingType = "Unfixed_stake";
    let isFixed= false;
    await erc20Token.connect(owner).mint(amount);
    await erc20Token.transfer(owner.address, stoke.address, amount);
    await erc20Token.connect(addr).mint(amount);
    await erc20Token.connect(addr).approve(owner.address, stoke.address, amount);
    await stoke.connect(addr).staking(amountToStake, 0, stakingType, isFixed);
    const stakingDetails = await stoke.staking_detail(addr.address);

    expect(await stakingDetails.isFixed).to.be.false;

    expect(stoke.connect(stoke.address).UnStaking(addr.address));
  });
  it("should after unstake complete fixed duration", async function () {
    const amount = 1000;
    const duration = 100;
    const stakingType = "fixed_stake";
    let isFixed= false;

    await erc20Token.connect(owner).mint(amount);
    await erc20Token.transfer(owner.address, stoke.address, amount);
    await erc20Token.connect(addr).mint(amount);
    await erc20Token.connect(addr).approve(owner.address, stoke.address, amount);
    await stoke.connect(addr).staking(amountToStake, duration, stakingType, isFixed);
    const stakingDetails = await stoke.staking_detail(addr.address);
    expect(await stakingDetails.isFixed).to.be.false;
    expect(await stakingDetails.time).to.above(duration);
    expect(stoke.connect(stoke.address).UnStaking(addr.address));
  });
  it("should  before unstake incomplete fixed duration", async function () {
    const amount = 1000;
    const duration = 100;
    const stakingType = "fixed_stake";
    let isFixed= false;

    await erc20Token.connect(owner).mint(amount);
    await erc20Token.transfer(owner.address, stoke.address, amount);
    await erc20Token.connect(addr).mint(amount);
    await erc20Token.connect(addr).approve(owner.address, stoke.address, amount);
    await stoke.connect(addr).staking(amountToStake, duration, stakingType, isFixed);
    const stakingDetails = await stoke.staking_detail(addr.address);
    expect(await stakingDetails.isFixed).to.be.false;
    const currentTime = Math.floor(Date.now() / 1000);

    const elapsedTime = currentTime - stakingDetails.time.toNumber();
    expect(elapsedTime).to.lessThan(duration);

    expect(stoke.connect(stoke.address).UnStaking(addr.address));
  });


});
