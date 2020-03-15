module.exports = {
    // check if the value of a variable equals to a value
    ifeq: function(a, b, options) {
      if (a === b) {
        return options.fn(this);
        }
      return options.inverse(this);
    }
}