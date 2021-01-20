const wvs = 10 ** 8;
const callScriptFee = 0.005 * wvs;
const setScriptFee = 0.01 * wvs;

describe('coupon multi test suite', function () {

    this.timeout(100000);

    before(async function () {
        await setupAccounts({owner: setScriptFee + callScriptFee});
        const script = compile(file('coupon-multi.ride'));
        const ssTx = setScript({script}, accounts.owner);
        await broadcast(ssTx);
        await waitForTx(ssTx.id);
        const dataTx = data({data: [
          {key: 'item_001_price', type: 'integer', value: 0.001 * wvs},
          {key: 'item_002_price', type: 'integer', value: 0.002 * wvs}
        ], additionalFee: 400000}, accounts.owner);
        await broadcast(dataTx);
        await waitForTx(dataTx.id);
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
