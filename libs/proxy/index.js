export const formatProxy = arr => {
  const formattedProxy = [];

  if (arr.length > 0) {
    for (let i = 0; i < arr.length; i++) {
      const splitProxy = arr[i].split(':');

      if (splitProxy.length > 0) {
        formattedProxy.push(
          `http://${splitProxy[2]}:${splitProxy[3]}@${splitProxy[0]}:${splitProxy[1]}`
        );
      } else {
        formattedProxy.push(`http://${splitProxy[0]}:${splitProxy[1]}`);
      }
    }

    return formattedProxy;
  }
};

export const getRandomProxy = arr => {
  if (arr.length > 0) {
    return arr[Math.floor(Math.random() * arr.length)];
  } else {
    return null;
  }
};
