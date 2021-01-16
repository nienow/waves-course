const wvs = 10 ** 8;
const aliceSeed = 'stone fork prize prefer slot lonely ancient excite session obscure wreck purchase pool rib mosquito';
const bobSeed = 'text marble eight pass catalog echo tumble olympic express few allow fluid setup morning cotton';
const cooperSeed = 'blush fix purity hand despair victory sick citizen mechanic soon child witness letter wash sibling';

const setScriptFee = 0.01 * wvs;
const transferFee = 0.005 * wvs;
const transferAmount = 0.001 * wvs;
const destBalance = 0.001 * wvs;

describe('account test suite', function () {

    this.timeout(100000);

    before(async function () {
        const totalNeeded = (transferFee + transferAmount) * 4 + setScriptFee;
        await setupAccounts({multi: totalNeeded, dest1: destBalance, dest2: destBalance, dest3: destBalance});
        const script = compile(file('account.ride'));
        const ssTx = setScript({script}, accounts.multi);
        await broadcast(ssTx);
        await waitForTx(ssTx.id);
    });
    
    it('can withdraw with alice and bob', async function () {
        const destAddress = address(accounts.dest1);
        let tx = transfer({recipient: destAddress, amount: 0.001 * wvs, additionalFee: 400000, senderPublicKey: publicKey(accounts.multi)}, aliceSeed);
        tx = transfer(tx, bobSeed);
        await broadcast(tx);
        await waitForTx(tx.id);
        const newBal = await balance(destAddress);
        expect(newBal).to.equal(destBalance + transferAmount);
    });

    it('can withdraw with alice and cooper', async function () {
        const destAddress = address(accounts.dest2);
        let tx = transfer({recipient: destAddress, amount: 0.001 * wvs, additionalFee: 400000, senderPublicKey: publicKey(accounts.multi)}, aliceSeed);
        tx = transfer(tx, cooperSeed);
        await broadcast(tx);
        await waitForTx(tx.id);
        const newBal = await balance(destAddress);
        expect(newBal).to.equal(destBalance + transferAmount);
    });

    it('can withdraw with bob and cooper', async function () {
        const destAddress = address(accounts.dest3);
        let tx = transfer({recipient: destAddress, amount: 0.001 * wvs, additionalFee: 400000, senderPublicKey: publicKey(accounts.multi)}, bobSeed);
        tx = transfer(tx, cooperSeed);
        await broadcast(tx);
        await waitForTx(tx.id);
        const newBal = await balance(destAddress);
        expect(newBal).to.equal(destBalance + transferAmount);
    });

    it('can cannot withdraw with only 1 signature', async function () {
        const destAddress = address(accounts.dest1);
        const tx = transfer({recipient: destAddress, amount: 0.001 * wvs, additionalFee: 400000, senderPublicKey: publicKey(accounts.multi)}, aliceSeed);
        expect(broadcast(tx)).to.be.rejected;
        const tx2 = transfer({recipient: destAddress, amount: 0.001 * wvs, additionalFee: 400000, senderPublicKey: publicKey(accounts.multi)}, bobSeed);
        expect(broadcast(tx2)).to.be.rejected;
        const tx3 = transfer({recipient: destAddress, amount: 0.001 * wvs, additionalFee: 400000, senderPublicKey: publicKey(accounts.multi)}, cooperSeed);
        expect(broadcast(tx3)).to.be.rejected;
    });
})
