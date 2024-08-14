import { Blockchain, registerCompiledContract, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { Cell, toNano } from '@ton/core';
import { Counter } from '../wrappers/Counter';
import '@ton/test-utils';
import { doCompile } from '@ton/blueprint';

describe('Counter', () => {
    let code: Cell;

    beforeAll(async () => {
        code = registerCompiledContract(await doCompile('Counter', {
            debugInfo: true,
        }));
    });

    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let counter: SandboxContract<Counter>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        counter = blockchain.openContract(
            Counter.createFromConfig(
                {
                    id: 0,
                    counter: 0,
                },
                code
            )
        );

        deployer = await blockchain.treasury('deployer');

        const deployResult = await counter.sendDeploy(deployer.getSender(), toNano('0.05'));

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: counter.address,
            deploy: true,
            success: true,
        });
    });

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and counter are ready to use
    });

    it('should increase counter', async () => {
        const increaser = await blockchain.treasury('increaser');

        blockchain.debug = true;

        await counter.sendIncrease(increaser.getSender(), {
            increaseBy: 123,
            value: toNano('0.05'),
        });

        blockchain.debug = false;
    }, 60 * 60 * 1000); // set big timeout to allow for debug session

    it('should sum', async () => {
        (await blockchain.getContract(counter.address)).setDebug(true);

        const result = await counter.getSum(5, 8);

        console.log('Result:', result);

        (await blockchain.getContract(counter.address)).setDebug(false);
    }, 60 * 60 * 1000); // set big timeout to allow for debug session
});
