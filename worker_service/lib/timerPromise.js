exports.timerPromise = time => new Promise((resolve) => {
  setTimeout(resolve, time)
})
