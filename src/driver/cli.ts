process.stdin.on("data", async function (chuck) {
  console.log(chuck.toString());
});
