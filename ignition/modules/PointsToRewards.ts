import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("PointsToRewardsModule", (m) => {
  const pointsToRewards = m.contract("PointsToRewards");

  return { pointsToRewards };
});