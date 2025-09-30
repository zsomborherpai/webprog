function getOtosLotteryNumbers(){
    let lottoNums = [];

    for(let i = 0;i<5;i++){
        let nums = Math.random(1,99)
        lottoNums.push(nums)
    }
    return
}
const lottoNums = getOtosLotteryNumbers()
lottoNums.forEach(i => {
    console.log(lottoNums[i])
});
