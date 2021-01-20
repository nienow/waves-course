const wvs = 10 ** 8;
const callScriptFee = 0.005 * wvs;
const setScriptFee = 0.01 * wvs;
const transferFee = 0.005 * wvs;
const transferAmount = 0.001 * wvs;
const destBalance = 0.001 * wvs;

const aliceSeed = 'stone fork prize prefer slot lonely ancient excite session obscure wreck purchase pool rib mosquito';
const bobSeed = 'text marble eight pass catalog echo tumble olympic express few allow fluid setup morning cotton';
const cooperSeed = 'blush fix purity hand despair victory sick citizen mechanic soon child witness letter wash sibling';

describe('coupon test suite', function () {

    this.timeout(100000);

    before(async function () {
        const totalNeeded = (transferFee + transferAmount) * 4 + setScriptFee + callScriptFee;
        await setupAccounts({owner: totalNeeded, dest1: destBalance, dest2: destBalance, dest3: destBalance});
        const script = compile(file('coupon.ride'));
        const ssTx = setScript({script}, accounts.owner);
        await broadcast(ssTx);
        await waitForTx(ssTx.id);
        let dataTx = data({data: [
          {key: 'item_001_price', type: 'integer', value: 0.001 * wvs},
          {key: 'item_002_price', type: 'integer', value: 0.002 * wvs}
        ], additionalFee: 400000, senderPublicKey: publicKey(accounts.owner)}, aliceSeed);
        dataTx = data(dataTx, bobSeed);
        await broadcast(dataTx);
        await waitForTx(dataTx.id);
    });

    it('can withdraw with alice and bob', async function () {
        const destAddress = address(accounts.dest1);
        let tx = transfer({recipient: destAddress, amount: 0.001 * wvs, additionalFee: 400000, senderPublicKey: publicKey(accounts.owner)}, aliceSeed);
        tx = transfer(tx, bobSeed);
        await broadcast(tx);
        await waitForTx(tx.id);
        const newBal = await balance(destAddress);
        expect(newBal).to.equal(destBalance + transferAmount);
    });

    it('can withdraw with alice and cooper', async function () {
        const destAddress = address(accounts.dest2);
        let tx = transfer({recipient: destAddress, amount: 0.001 * wvs, additionalFee: 400000, senderPublicKey: publicKey(accounts.owner)}, aliceSeed);
        tx = transfer(tx, cooperSeed);
        await broadcast(tx);
        await waitForTx(tx.id);
        const newBal = await balance(destAddress);
        expect(newBal).to.equal(destBalance + transferAmount);
    });

    it('can withdraw with bob and cooper', async function () {
        const destAddress = address(accounts.dest3);
        let tx = transfer({recipient: destAddress, amount: 0.001 * wvs, additionalFee: 400000, senderPublicKey: publicKey(accounts.owner)}, bobSeed);
        tx = transfer(tx, cooperSeed);
        await broadcast(tx);
        await waitForTx(tx.id);
        const newBal = await balance(destAddress);
        expect(newBal).to.equal(destBalance + transferAmount);
    });

    it('cannot withdraw with only 1 signature', async function () {
        const destAddress = address(accounts.dest1);
        const tx = transfer({recipient: destAddress, amount: 0.001 * wvs, additionalFee: 400000, senderPublicKey: publicKey(accounts.owner)}, aliceSeed);
        expect(broadcast(tx)).to.be.rejected;
        const tx2 = transfer({recipient: destAddress, amount: 0.001 * wvs, additionalFee: 400000, senderPublicKey: publicKey(accounts.owner)}, bobSeed);
        expect(broadcast(tx2)).to.be.rejected;
        const tx3 = transfer({recipient: destAddress, amount: 0.001 * wvs, additionalFee: 400000, senderPublicKey: publicKey(accounts.owner)}, cooperSeed);
        expect(broadcast(tx3)).to.be.rejected;
    });
    
    it('can purchase multiple coupons', async function () {
        const buyTx = invokeScript({
            dApp: address(accounts.owner),
            call: {function: 'purchase', args: [{type: 'string', value: '001'}]},
            payment: [{amount: 0.001 * wvs, assetId: null}]
        }, accounts.wallet);
        await broadcast(buyTx);
        await waitForTx(buyTx.id);
        const buyTx2 = invokeScript({
            dApp: address(accounts.owner),
            call: {function: 'purchase', args: [{type: 'string', value: '002'}]},
            payment: [{amount: 0.002 * wvs, assetId: null}]
        }, accounts.wallet);
        await broadcast(buyTx2);
        await waitForTx(buyTx2.id);
        const newData = await accountData(address(accounts.owner));
        expect(newData['status:purchase_item_001_customer_' + address(accounts.wallet)].value).to.equal('confirmed');
        expect(newData['price:purchase_item_001_customer_' + address(accounts.wallet)].value).to.equal(0.001 * wvs);
        expect(newData['status:purchase_item_002_customer_' + address(accounts.wallet)].value).to.equal('confirmed');
        expect(newData['price:purchase_item_002_customer_' + address(accounts.wallet)].value).to.equal(0.002 * wvs);
    });

    it('should revert if price too low', async function () {
        const buyTx = invokeScript({
            dApp: address(accounts.owner),
            call: {function: 'purchase', args: [{type: 'string', value: '001'}]},
            payment: [{amount: 0.0001 * wvs, assetId: null}]
        }, accounts.wallet);
        expect(broadcast(buyTx)).to.be.rejected;
    });

    it('should revert if price too high', async function () {
        const buyTx = invokeScript({
            dApp: address(accounts.owner),
            call: {function: 'purchase', args: [{type: 'string', value: '001'}]},
            payment: [{amount: 0.01 * wvs, assetId: null}]
        }, accounts.wallet);
        expect(broadcast(buyTx)).to.be.rejected;
    });
})
