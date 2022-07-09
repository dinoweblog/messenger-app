const errorFormat = (errorArray) => {
  return errorArray.map(({ msg, param }) => {
    return {
      message: msg,
      field: param,
    };
  });
};

module.exports = {errorFormat}
