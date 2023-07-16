module.exports = async (app) => {
  require('./coinprice')(app);
  require('./order')(app);
  require('./orderbook')(app);
}