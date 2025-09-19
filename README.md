# Poängsystem för medlemmar – Sepolia Smart Contract

Detta projekt är en inlämningsuppgift för kursen Blockchainutveckling 2025. Projektet implementerar ett smart kontrakt i Solidity som fungerar som ett poängsystem för medlemmar, med möjlighet att byta in poäng mot belöningar.

## Vald uppgift

**Tema:** Poängsystem för medlemmar

- Vem som helst kan gå med som medlem.
- Medlemmar kan tjäna in poäng och se sitt poängsaldo.
- Poäng kan överföras mellan medlemmar.
- En administratör kan tilldela poäng.
- Poäng kan bytas in mot belöningar (t.ex. T-shirt eller VIP-status).

## Grundläggande krav (G)
- Minst en struct eller enum
- Minst en mapping eller array
- En constructor
- Minst en custom modifier
- Minst ett event för att logga viktiga händelser
- Tester som täcker grundläggande funktionalitet
- Test coverage på minst 40%

## För högre betyg (VG)
- Minst ett custom error, samt minst en require, en assert och en revert
- Fallback och/eller receive-funktion
- Kontraktet distribuerat och verifierat på Sepolia/Etherscan:
https://sepolia.etherscan.io/address/0x741254509b3E8f4318aE01C5775F53c25fAe5dF1#code 
- Test coverage på minst 90%
- Minst tre gasoptimeringar/säkerhetsåtgärder (se nedan)

## Gasoptimeringar och säkerhetsåtgärder
1. **Exempel:** Använder custom errors istället för string-meddelanden för att spara gas.
2. **Exempel:** Internal functions för återanvändning och minskad kodupprepning.
3. **Exempel:** Checks-Effects-Interactions-mönster för att undvika reentrancy.


## Installation och användning

1. Klona repot:
   ```sh
   git clone https://github.com/Gl373/sepolia_smartcontract.git
   cd sepolia_smartcontract
   ```
2. Installera dependencies:
   ```sh
   npm install
   ```
3. Kör tester:
   ```sh
   npx hardhat test
   ```
4. Kör test coverage:
   ```sh
   npx hardhat test --coverage
   ```

## Deployment

För att deploya till Sepolia:
1. Sätt din privata nyckel i miljövariabeln `SEPOLIA_PRIVATE_KEY`.
2. Kör:
   ```sh
   npx hardhat ignition deploy --network sepolia ignition/modules/PointsToReward.ts
   ```



---

