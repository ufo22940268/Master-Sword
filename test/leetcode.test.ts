describe('house robber', () => {

  const expectations = [
    [[1, 2, 3, 1], 4],
    [[2, 7, 9, 3, 1], 12],
    [1],
  ];

  //@ts-ignore
  let rob = (nums) => {
    if (nums.length == 1) return nums[0]
    let ar = new Array(2).fill(0).map(() => new Array(nums.length).fill(0));
    ar[0][0] = 0;
    ar[1][0] = nums[0];
    let max = 0;
    for (let i = 1; i < nums.length; i++) {
      ar[0][i] = Math.max(ar[0][i - 1], ar[1][i - 1]);
      ar[1][i] = Math.max(ar[0][i - 1] + nums[i]);
      max = Math.max(max, ar[0][i], ar[1][i]);
    }
    return max;
  };

  it('sum the maximum', async () => {
    expect(rob(expectations[0][0])).toEqual(expectations[0][1]);
    expect(rob(expectations[1][0])).toEqual(expectations[1][1]);
    expect(rob(expectations[2][0])).toEqual(expectations[2][1]);
    // expectations.forEach(exp => {
    //   expect(rob(exp[0])).toEqual(exp[1]);
    // });
  });
});
