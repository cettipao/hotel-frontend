export const waait = () =>
  new Promise((res) => setTimeout(res, Math.random() * 2500));
