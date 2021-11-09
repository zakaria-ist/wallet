const resetTimeout = () => {
  //clear all auto refresh
  let timeoutLast = setTimeout(() => {}, 0);
  while (timeoutLast--) {
    clearTimeout(timeoutLast);
  }
}

export default resetTimeout;
