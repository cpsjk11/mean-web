import React from "react";
import { useRecoilValue } from "recoil";
import { addrState } from "../../recoil/recoil.js";
// reactstrap components
import {
  Button,
  Input,
  Card,
  CardHeader,
  CardBody,
  NavItem,
  NavLink,
  Nav,
  TabContent,
  TabPane,
  Container,
} from "reactstrap";

import {
  getKlayAmountOut,
  getMeanAmountOut,
  klayToMeanSwap,
  getDepositAmount,
  getInterest,
  getWithdrawableAmount,
  getInterestRate,
  meanDeposit,
  isAllowance,
  approveContract,
  meanWithdraw,
  meanClaim,
  eventApproveContract,
  isEventAllowance,
  eventTokenToKlay,
} from "../../scripts/BasicElementsJs.js";

// core components

function BasicElements() {
  const [swapPills, setSwapPills] = React.useState("1");
  const [stakingPills, setStakingPills] = React.useState("1");

  /* Swap */
  const [klayToMeanOutputAmount, setKlayToMeanOutputAmount] =
    React.useState("");
  const [meanToKlayOutputAmount, setMeanToKlayOutputAmount] =
    React.useState("");
  const [swapTxHistory, setSwapTxHistory] = React.useState([]);
  const [eventSwapTxHistory, setEventSwapTxHistory] = React.useState([]);
  const [isKlaySwap, setIsKlaySwap] = React.useState(false);

  const [eventMeanToKlayAmount, setEventMeanToKlayAmount] = React.useState("");

  /* Deposit */
  const [depositTxHistory, setDepositTxHistory] = React.useState([]);
  const [meanDepositAmount, setMeanDepositAmount] = React.useState(0);
  const [meanRate, setMeanRate] = React.useState(0);
  const [meanWithdrawable, setMeanWithdrawable] = React.useState(0);
  const [meanReward, setMeanReward] = React.useState(0);
  const [meanDepositValue, setMeanDepositValue] = React.useState("");
  const [meanWithDrawValue, setMeanWithDrawValue] = React.useState("");
  const [isDeposit, setIsDeposit] = React.useState(false);

  /* EventDeposit */
  const [eventDepositTxHistory, setEventDepositTxHistory] = React.useState([]);
  const [eventMeanDepositAmount, setEventMeanDepositAmount] = React.useState(0);
  const [eventMeanRate, setEventMeanRate] = React.useState(0);
  const [eventMeanWithdrawable, setEventMeanWithdrawable] = React.useState(0);
  const [eventMeanReward, setEventMeanReward] = React.useState(0);
  const [eventMeanDepositValue, setEventMeanDepositValue] = React.useState("");
  const [eventMeanWithDrawValue, setEventMeanWithDrawValue] =
    React.useState("");
  const [isEventDeposit, setIsEventDeposit] = React.useState(false);
  const [isEventSwap, setIsEventSwap] = React.useState(false);

  /* User */
  const addr = useRecoilValue(addrState);

  React.useEffect(() => {
    depositStatus();
    const intervalId = setInterval(() => {
      depositStatus();
      updateStates();
    }, 5000);

    return () => clearInterval(intervalId);
  }, []);

  React.useEffect(() => {
    updateStates();
  }, [addr]);

  async function depositStatus() {
    const newMeanDepositAmount = await getDepositAmount("deposit");
    const newMeanRate = await getInterestRate("deposit");
    const newEventMeanDepositAmount = await getDepositAmount("event");
    const newEventMeanRate = await getInterestRate("event");

    setMeanDepositAmount(newMeanDepositAmount);
    setMeanRate(newMeanRate);
    setEventMeanDepositAmount(newEventMeanDepositAmount);
    setEventMeanRate(newEventMeanRate);
  }

  async function updateStates() {
    let newIsKlaySwap;
    let newMeanWithdrawable;
    let newMeanReward;
    let newIsDeposit;

    let newEventMeanWithdrawable;
    let newEventMeanReward;
    let newIsEventDeposit;
    let newIsEventSwap;
    try {
      newMeanWithdrawable = await getWithdrawableAmount("deposit");
      newMeanReward = await getInterest("deposit");
      newIsKlaySwap = await isAllowance("klaySwap");
      newIsDeposit = await isAllowance("deposit");

      newEventMeanWithdrawable = await getWithdrawableAmount("event");
      newEventMeanReward = await getInterest("event");
      newIsEventDeposit = await isAllowance("event");
      newIsEventSwap = await isEventAllowance("eventFactory");
    } catch (error) {
      newMeanWithdrawable = 0;
      newMeanReward = 0;
      newIsKlaySwap = false;
      newIsDeposit = false;

      newEventMeanWithdrawable = 0;
      newEventMeanReward = 0;
      newIsEventDeposit = false;
      newIsEventSwap = false;
    }
    // 상태 업데이트
    setMeanWithdrawable(newMeanWithdrawable);
    setMeanReward(newMeanReward);
    setIsKlaySwap(newIsKlaySwap);
    setIsDeposit(newIsDeposit);

    setEventMeanWithdrawable(newEventMeanWithdrawable);
    setEventMeanReward(newEventMeanReward);
    setIsEventDeposit(newIsEventDeposit);
    setIsEventSwap(newIsEventSwap);
  }
  return (
    <>
      <div className="section section-basic" id="basic-elements">
        <Container>
          <h3 className="title">Swap</h3>

          <Card>
            <CardHeader>
              <Nav className="justify-content-center" role="tablist" tabs>
                <NavItem>
                  <NavLink
                    className={swapPills === "1" ? "active" : ""}
                    href="#pablo"
                    onClick={(e) => {
                      e.preventDefault();
                      setSwapPills("1");
                    }}
                  >
                    <i className="now-ui-icons shopping_cart-simple"></i>
                    Klay To Mean
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    className={swapPills === "2" ? "active" : ""}
                    href="#pablo"
                    onClick={(e) => {
                      e.preventDefault();
                      setSwapPills("2");
                    }}
                  >
                    <i className="now-ui-icons shopping_cart-simple"></i>
                    Event Mean To Klay
                  </NavLink>
                </NavItem>
              </Nav>
            </CardHeader>
            <CardBody>
              <TabContent
                className="text-center"
                activeTab={"swapPills" + swapPills}
              >
                <TabPane tabId="swapPills1">
                  <h4 style={{ textAlign: "left" }}>From</h4>
                  <div style={{ marginBottom: "30px" }}>
                    <Input
                      value={Math.floor(meanToKlayOutputAmount * 1e6) / 1e6}
                      placeholder="Input Amount"
                      type="number"
                      style={{
                        borderRadius: "0px",
                        height: "80px",
                        marginBottom: "30px",
                        fontSize: "18px",
                      }}
                      onChange={async (e) => {
                        if (Number(e.target.value) < 0) return;
                        setMeanToKlayOutputAmount(e.target.value);
                        setKlayToMeanOutputAmount(
                          await getKlayAmountOut(e.target.value)
                        );
                      }}
                    ></Input>
                    <h4 style={{ textAlign: "left" }}>To</h4>
                    <Input
                      value={Math.floor(klayToMeanOutputAmount * 1e6) / 1e6}
                      placeholder="Output Amount"
                      type="number"
                      style={{
                        borderRadius: "0px",
                        height: "80px",
                        fontSize: "18px",
                      }}
                      onChange={async (e) => {
                        if (Number(e.target.value) < 0) return;
                        setKlayToMeanOutputAmount(e.target.value);
                        setMeanToKlayOutputAmount(
                          await getMeanAmountOut(e.target.value)
                        );
                      }}
                    ></Input>
                    <br />
                    <p style={{ textAlign: "left" }}>Transaction History</p>
                    <strong style={{ textAlign: "left", fontSize: "12px" }}>
                      {swapTxHistory.map((item, index) => {
                        return (
                          <div key={index}>
                            <strong>{item}</strong>
                          </div>
                        );
                      })}
                    </strong>
                  </div>
                  <div style={{ display: "flex", justifyContent: "right" }}>
                    {!isKlaySwap && (
                      <Button
                        color="danger"
                        size="lg"
                        onClick={async () => {
                          if (addr.toLocaleLowerCase() === "login")
                            return alert("Login is required.");
                          try {
                            const txHash = await approveContract("klaySwap");
                            if (txHash) {
                              const updatedTxHistoryArray = [
                                ...swapTxHistory,
                                txHash,
                              ];
                              setSwapTxHistory(updatedTxHistoryArray);
                            }
                          } catch (error) {
                            console.error(
                              "Error adding transaction to history:",
                              error
                            );
                          }
                        }}
                      >
                        Approve
                      </Button>
                    )}
                    {isKlaySwap && (
                      <Button
                        color="info"
                        size="lg"
                        onClick={async () => {
                          if (addr.toLocaleLowerCase() === "login")
                            return alert("Login is required.");
                          try {
                            const txHash = await klayToMeanSwap(
                              meanToKlayOutputAmount,
                              klayToMeanOutputAmount
                            );
                            if (txHash) {
                              const updatedTxHistoryArray = [
                                ...swapTxHistory,
                                txHash,
                              ];
                              setSwapTxHistory(updatedTxHistoryArray);
                            }
                          } catch (error) {
                            console.error(
                              "Error adding transaction to history:",
                              error
                            );
                          }
                        }}
                      >
                        Swap
                      </Button>
                    )}
                  </div>
                </TabPane>
                <TabPane tabId="swapPills2">
                  <p style={{ fontWeight: "500" }}>
                    Open Event! Stake Mean Token and try converting 1 EMAT to 1
                    KLAY!
                  </p>
                  <h4 style={{ textAlign: "left" }}>From</h4>
                  <div style={{ marginBottom: "30px" }}>
                    <Input
                      value={eventMeanToKlayAmount}
                      placeholder="Input Amount"
                      type="number"
                      style={{
                        borderRadius: "0px",
                        height: "80px",
                        fontSize: "18px",
                        marginBottom: "30px",
                      }}
                      onChange={(e) => {
                        if (Number(e.target.value) < 0) return;
                        setEventMeanToKlayAmount(e.target.value);
                      }}
                    ></Input>
                    <h4 style={{ textAlign: "left" }}>To</h4>
                    <Input
                      value={eventMeanToKlayAmount}
                      placeholder="Output Amount"
                      type="number"
                      style={{
                        borderRadius: "0px",
                        height: "80px",
                        fontSize: "18px",
                      }}
                      onChange={(e) => {
                        if (Number(e.target.value) < 0) return;
                        setEventMeanToKlayAmount(e.target.value);
                      }}
                    ></Input>
                    <br />
                    <p style={{ textAlign: "left" }}>Transaction History</p>
                    <strong style={{ textAlign: "left", fontSize: "12px" }}>
                      {eventSwapTxHistory.map((item, index) => {
                        return (
                          <div key={index}>
                            <strong>{item}</strong>
                          </div>
                        );
                      })}
                    </strong>
                  </div>
                  <div style={{ display: "flex", justifyContent: "right" }}>
                    {!isEventSwap && (
                      <Button
                        color="danger"
                        size="lg"
                        onClick={async () => {
                          if (addr.toLocaleLowerCase() === "login")
                            return alert("Login is required.");
                          try {
                            const txHash = await eventApproveContract(
                              "eventFactory"
                            );
                            if (txHash) {
                              const updatedTxHistoryArray = [
                                ...swapTxHistory,
                                txHash,
                              ];
                              setEventSwapTxHistory(updatedTxHistoryArray);
                            }
                          } catch (error) {
                            console.error(
                              "Error adding transaction to history:",
                              error
                            );
                          }
                        }}
                      >
                        Approve
                      </Button>
                    )}
                    {isEventSwap && (
                      <Button
                        color="info"
                        size="lg"
                        onClick={async () => {
                          if (addr.toLocaleLowerCase() === "login")
                            return alert("Login is required.");
                          try {
                            const txHash = await eventTokenToKlay(
                              eventMeanToKlayAmount
                            );
                            if (txHash) {
                              const updatedTxHistoryArray = [
                                ...swapTxHistory,
                                txHash,
                              ];
                              setEventSwapTxHistory(updatedTxHistoryArray);
                            }
                          } catch (error) {
                            console.error(
                              "Error adding transaction to history:",
                              error
                            );
                          }
                        }}
                      >
                        Swap
                      </Button>
                    )}
                  </div>
                </TabPane>
              </TabContent>
            </CardBody>
          </Card>
          <h3 className="title">Staking</h3>

          <Card>
            <CardHeader>
              <Nav className="justify-content-center" role="tablist" tabs>
                <NavItem>
                  <NavLink
                    className={stakingPills === "1" ? "active" : ""}
                    href="#pablo"
                    onClick={(e) => {
                      e.preventDefault();
                      setStakingPills("1");
                    }}
                  >
                    <i className="now-ui-icons shopping_cart-simple"></i>
                    Mean Token
                  </NavLink>
                </NavItem>
                {/* <NavItem>
                  <NavLink
                    className={stakingPills === "2" ? "active" : ""}
                    href="#pablo"
                    onClick={(e) => {
                      e.preventDefault();
                      setStakingPills("2");
                    }}
                  >
                    <i className="now-ui-icons shopping_cart-simple"></i>
                    Klaytn
                  </NavLink>
                </NavItem> */}
                <NavItem>
                  <NavLink
                    className={stakingPills === "3" ? "active" : ""}
                    href="#pablo"
                    onClick={(e) => {
                      e.preventDefault();
                      setStakingPills("3");
                    }}
                  >
                    <i className="now-ui-icons shopping_cart-simple"></i>
                    Event Mean Token
                  </NavLink>
                </NavItem>
              </Nav>
            </CardHeader>
            <CardBody>
              <TabContent
                className="text-center"
                activeTab={"stakingPills" + stakingPills}
              >
                <TabPane tabId="stakingPills1">
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <h4>Mean Token (MAT)</h4>
                    <img
                      alt="..."
                      src={require("assets/img/logo/mean.png")}
                      style={{ width: "60px", height: "40px" }}
                    ></img>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <h4>TVL</h4>
                    <h4>
                      {meanDepositAmount} <span>(MAT)</span>
                    </h4>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <h4>APR</h4>
                    <h4>{meanRate}%</h4>
                  </div>
                  <h4 style={{ textAlign: "left" }}>Staking</h4>
                  <div>
                    <Input
                      value={meanDepositValue}
                      placeholder="Input Amount"
                      type="number"
                      style={{
                        borderRadius: "0px",
                        height: "80px",
                        marginBottom: "30px",
                        fontSize: "18px",
                      }}
                      onChange={(e) => {
                        if (Number(e.target.value) < 0) return;
                        setMeanDepositValue(e.target.value);
                      }}
                    ></Input>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "right",
                      }}
                    >
                      {!isDeposit && (
                        <Button
                          color="danger"
                          size="lg"
                          onClick={async () => {
                            if (addr.toLocaleLowerCase() === "login")
                              return alert("Login is required.");
                            try {
                              const txHash = await approveContract("deposit");
                              if (txHash) {
                                const updatedTxHistoryArray = [
                                  ...depositTxHistory,
                                  txHash,
                                ];
                                setDepositTxHistory(updatedTxHistoryArray);
                              }
                            } catch (error) {
                              console.error(
                                "Error adding transaction to history:",
                                error
                              );
                            }
                          }}
                        >
                          Approve
                        </Button>
                      )}
                      {isDeposit && (
                        <Button
                          color="danger"
                          size="lg"
                          onClick={async () => {
                            if (addr.toLocaleLowerCase() === "login")
                              return alert("Login is required.");
                            const txHash = await meanDeposit(
                              "deposit",
                              meanDepositValue
                            );
                            if (txHash) {
                              const updatedTxHistoryArray = [
                                ...depositTxHistory,
                                txHash,
                              ];
                              setDepositTxHistory(updatedTxHistoryArray);
                            }
                          }}
                        >
                          Staking
                        </Button>
                      )}
                    </div>
                    <h4 style={{ textAlign: "left" }}>WithDraw</h4>
                    <Input
                      value={meanWithDrawValue}
                      placeholder="Output Amount"
                      type="number"
                      style={{
                        borderRadius: "0px",
                        height: "80px",
                        marginBottom: "30px",
                        fontSize: "18px",
                      }}
                      onChange={(e) => {
                        if (Number(e.target.value) < 0) return;
                        setMeanWithDrawValue(e.target.value);
                      }}
                    ></Input>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <p style={{ fontWeight: "500" }}>
                        Withdraw : {meanWithdrawable}
                      </p>
                      <Button
                        color="info"
                        size="lg"
                        onClick={async () => {
                          if (addr.toLocaleLowerCase() === "login")
                            return alert("Login is required.");
                          const txHash = await meanWithdraw(
                            "deposit",
                            meanWithDrawValue
                          );
                          if (txHash) {
                            const updatedTxHistoryArray = [
                              ...depositTxHistory,
                              txHash,
                            ];
                            setDepositTxHistory(updatedTxHistoryArray);
                          }
                        }}
                      >
                        withdraw
                      </Button>
                    </div>
                    <h4 style={{ textAlign: "left" }}>ClaimReward</h4>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <div>
                        <p
                          style={{
                            textAlign: "left",
                            fontSize: "18px",
                            fontWeight: "500",
                          }}
                        >
                          Reward: {meanReward}
                        </p>
                      </div>
                      <Button
                        color="info"
                        size="lg"
                        onClick={async () => {
                          if (addr.toLocaleLowerCase() === "login")
                            return alert("Login is required.");
                          const txHash = await meanClaim("deposit");
                          if (txHash) {
                            const updatedTxHistoryArray = [
                              ...depositTxHistory,
                              txHash,
                            ];
                            setDepositTxHistory(updatedTxHistoryArray);
                          }
                        }}
                      >
                        Claim
                      </Button>
                    </div>
                    <div>
                      <br />
                      <p style={{ textAlign: "left" }}>Transaction History</p>
                      <strong style={{ textAlign: "left", fontSize: "12px" }}>
                        {depositTxHistory.map((item, index) => {
                          return (
                            <div key={index}>
                              <strong>{item}</strong>
                            </div>
                          );
                        })}
                      </strong>
                    </div>
                  </div>
                </TabPane>
                <TabPane tabId="stakingPills2">
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <h4>Wrapped Klay (WKLAY)</h4>
                    <img
                      alt="..."
                      src={require("assets/img/logo/klay.png")}
                      style={{ width: "50px", height: "50px" }}
                    ></img>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <h4>TVL</h4>
                    <h4>
                      4,000,000 <span>(WKLAY)</span>
                    </h4>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <h4>APR</h4>
                    <h4>10%</h4>
                  </div>
                  <h4 style={{ textAlign: "left" }}>Staking</h4>
                  <div>
                    <Input
                      defaultValue=""
                      placeholder="Input Amount"
                      type="number"
                      style={{
                        borderRadius: "0px",
                        height: "80px",
                        marginBottom: "30px",
                        fontSize: "18px",
                      }}
                    ></Input>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "right",
                      }}
                    >
                      <Button color="danger" size="lg">
                        Staking
                      </Button>
                    </div>
                    <h4 style={{ textAlign: "left" }}>WithDraw</h4>
                    <Input
                      defaultValue=""
                      placeholder="Output Amount"
                      type="number"
                      style={{
                        borderRadius: "0px",
                        height: "80px",
                        marginBottom: "30px",
                        fontSize: "18px",
                      }}
                    ></Input>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <p style={{ fontWeight: "500" }}>Withdraw : 0</p>
                      <Button color="info" size="lg">
                        withdraw
                      </Button>
                    </div>
                    <h4 style={{ textAlign: "left" }}>ClaimReward</h4>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <div>
                        <p
                          style={{
                            textAlign: "left",
                            fontSize: "18px",
                            fontWeight: "500",
                          }}
                        >
                          Reward: {meanReward}
                        </p>
                      </div>
                      <Button
                        color="info"
                        size="lg"
                        onClick={async () => {
                          if (addr.toLocaleLowerCase() === "login")
                            return alert("Login is required.");
                          await meanClaim();
                        }}
                      >
                        Claim
                      </Button>
                    </div>
                    <div>
                      <br />
                      <p style={{ textAlign: "left" }}>Transaction History</p>
                      <strong style={{ textAlign: "left", fontSize: "12px" }}>
                        {swapTxHistory.map((item, index) => {
                          return (
                            <div key={index}>
                              <strong>{item}</strong>
                            </div>
                          );
                        })}
                      </strong>
                    </div>
                  </div>
                </TabPane>
                <TabPane tabId="stakingPills3">
                  <p style={{ fontWeight: "500" }}>
                    Deposit Mean Token and receive Event Mean Token! Event Mean
                    Token has the same value as 1 KLAY. You can only get it by
                    depositing Mean Token! Feel free to deposit and take your
                    KLAY!
                  </p>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <h4>Event Mean Token (EMAT)</h4>
                    <img
                      alt="..."
                      src={require("assets/img/logo/mean.png")}
                      style={{ width: "60px", height: "40px" }}
                    ></img>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <h4>TVL</h4>
                    <h4>
                      {eventMeanDepositAmount} <span>(MAT)</span>
                    </h4>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <h4>APR</h4>
                    <h4>{eventMeanRate}%</h4>
                  </div>
                  <h4 style={{ textAlign: "left" }}>Staking</h4>
                  <div>
                    <Input
                      value={eventMeanDepositValue}
                      placeholder="Input Amount"
                      type="number"
                      style={{
                        borderRadius: "0px",
                        height: "80px",
                        fontSize: "18px",
                        marginBottom: "30px",
                      }}
                      onChange={(e) => {
                        if (Number(e.target.value) < 0) return;
                        setEventMeanDepositValue(e.target.value);
                      }}
                    ></Input>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "right",
                      }}
                    >
                      {!isEventDeposit && (
                        <Button
                          color="danger"
                          size="lg"
                          onClick={async () => {
                            if (addr.toLocaleLowerCase() === "login")
                              return alert("Login is required.");
                            try {
                              const txHash = await approveContract("event");
                              if (txHash) {
                                const updatedTxHistoryArray = [
                                  ...eventDepositTxHistory,
                                  txHash,
                                ];
                                setEventDepositTxHistory(updatedTxHistoryArray);
                              }
                            } catch (error) {
                              console.error(
                                "Error adding transaction to history:",
                                error
                              );
                            }
                          }}
                        >
                          Approve
                        </Button>
                      )}
                      {isEventDeposit && (
                        <Button
                          color="danger"
                          size="lg"
                          onClick={async () => {
                            if (addr.toLocaleLowerCase() === "login")
                              return alert("Login is required.");
                            const txHash = await meanDeposit(
                              "event",
                              eventMeanDepositValue
                            );
                            if (txHash) {
                              const updatedTxHistoryArray = [
                                ...eventDepositTxHistory,
                                txHash,
                              ];
                              setEventDepositTxHistory(updatedTxHistoryArray);
                            }
                          }}
                        >
                          Staking
                        </Button>
                      )}
                    </div>
                    <h4 style={{ textAlign: "left" }}>WithDraw</h4>
                    <Input
                      value={eventMeanWithDrawValue}
                      placeholder="Output Amount"
                      type="number"
                      style={{
                        borderRadius: "0px",
                        height: "80px",
                        marginBottom: "30px",
                        fontSize: "18px",
                      }}
                      onChange={(e) => {
                        if (Number(e.target.value) < 0) return;
                        setEventMeanWithDrawValue(e.target.value);
                      }}
                    ></Input>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <p style={{ fontWeight: "500" }}>
                        Withdraw : {eventMeanWithdrawable}
                      </p>
                      <Button
                        color="info"
                        size="lg"
                        onClick={async () => {
                          if (addr.toLocaleLowerCase() === "login")
                            return alert("Login is required.");
                          const txHash = await meanWithdraw(
                            "event",
                            eventMeanWithDrawValue
                          );
                          if (txHash) {
                            const updatedTxHistoryArray = [
                              ...eventDepositTxHistory,
                              txHash,
                            ];
                            setEventDepositTxHistory(updatedTxHistoryArray);
                          }
                        }}
                      >
                        withdraw
                      </Button>
                    </div>
                    <h4 style={{ textAlign: "left" }}>ClaimReward</h4>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <div>
                        <p
                          style={{
                            textAlign: "left",
                            fontSize: "18px",
                            fontWeight: "500",
                          }}
                        >
                          Reward: {eventMeanReward}
                        </p>
                      </div>
                      <Button
                        color="info"
                        size="lg"
                        onClick={async () => {
                          if (addr.toLocaleLowerCase() === "login")
                            return alert("Login is required.");
                          const txHash = await meanClaim("event");
                          if (txHash) {
                            const updatedTxHistoryArray = [
                              ...eventDepositTxHistory,
                              txHash,
                            ];
                            setEventDepositTxHistory(updatedTxHistoryArray);
                          }
                        }}
                      >
                        Claim
                      </Button>
                    </div>
                    <div>
                      <br />
                      <p style={{ textAlign: "left" }}>Transaction History</p>
                      <strong style={{ textAlign: "left", fontSize: "12px" }}>
                        {eventDepositTxHistory.map((item, index) => {
                          return (
                            <div key={index}>
                              <strong>{item}</strong>
                            </div>
                          );
                        })}
                      </strong>
                    </div>
                  </div>
                </TabPane>
              </TabContent>
            </CardBody>
          </Card>
        </Container>
      </div>
    </>
  );
}

export default BasicElements;
