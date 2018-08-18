const andify = ([first = '', ...rest]) => {
  if (rest.length === 0) {
    return first;
  }
  if (rest.length === 1) {
    return `${first} and ${rest[0]}`;
  }
  return `${first}, ${andify(rest)}`;
};

module.exports = andify;
