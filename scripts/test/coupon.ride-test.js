const wvs = 10 ** 8;
const callScriptFee = 0.005 * wvs;
const setScriptFee = 0.01 * wvs;

describe('coupon test suite', function () {

    this.timeout(100000);

    before(async function () {
        await setupAccounts({owner: setScriptFee + callScriptFee});
        const script = compile(file('coupon.ride'));
        const ssTx = setScript({script}, accounts.owner);
        await broadcast(ssTx);
        await waitForTx(ssTx.id);
        const dataTx = data({data: [{key: 'item_A_coupon_price', type: 'integer', value: 0.001 * wvs}], additionalFee: 400000}, accounts.owner);
        await broadcast(dataTx);
        await waitForTx(dataTx.id);
    });
    
    it('can purchase couponA', async function () {
        const buyTx = invokeScript({
            dApp: address(accounts.owner),
            call: {function: 'purchase'},
            payment: [{amount: 0.001 * wvs, assetId: null}]
        }, accounts.wallet);
        await broadcast(buyTx);
        await waitForTx(buyTx.id);
        const newData = await accountData(address(accounts.owner));
        expect(newData['status:purchase_item_A_customer_' + address(accounts.wallet)].value).to.equal('confirmed');
        expect(newData['price:purchase_item_A_customer_' + address(accounts.wallet)].value).to.equal(0.001 * wvs);
    });

    it('should revert if price too low', async function () {
        const buyTx = invokeScript({
            dApp: address(accounts.owner),
            call: {function: 'purchase'},
            payment: [{amount: 0.0001 * wvs, assetId: null}]
        }, accounts.wallet);
        expect(broadcast(buyTx)).to.be.rejected;
    });

    it('should revert if price too high', async function () {
        const buyTx = invokeScript({
            dApp: address(accounts.owner),
            call: {function: 'purchase'},
            payment: [{amount: 0.01 * wvs, assetId: null}]
        }, accounts.wallet);
        expect(broadcast(buyTx)).to.be.rejected;
    });
})
