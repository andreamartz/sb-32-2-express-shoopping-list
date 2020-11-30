/** ExpressError extends the normal JS error so we can easily
 *  add a status when we make an instance of it.
 *
 *  The error-handling middleware will return this.
 */

class ExpressError extends Error {
  constructor(msg, status) {
    super();
    this.msg = msg;
    this.status = status;
    console.error(this.stack)
  }
}

module.exports = ExpressError;