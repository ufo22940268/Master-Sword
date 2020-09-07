describe('house robber', () => {

    const expectations = [
        [
            // [1, 2, 5], 11, 3,
            [2], 3, -1
        ]
    ];

    const infi = Math.pow(2, 32) - 1
    //@ts-ignore
    let coinChange = (coins, amount) => {
        let mat = new Array(amount + 1).fill(infi);
        mat[0] = 0
        for (let v = 1; v <= amount; v++) {
            for (let j = 0; j < coins.length; j++) {

                let alt = infi;
                if (v < coins[j]) {
                    alt = infi;
                } else {
                    alt = mat[v - coins[j]] + 1;
                }

                mat[v] = Math.min(mat[v], alt);
            }
        }
        return mat[amount] != infi ? mat[amount] : -1
    };

    it('sum the maximum', async () => {
        let exp = expectations[1];
        //@ts-ignore
        expect(coinChange(exp[0], exp[1])).toEqual(exp[2]);
    });
});
