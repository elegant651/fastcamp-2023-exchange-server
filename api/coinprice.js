const axios = require('axios');

module.exports =  (app) => {

  const HOST = 'https://rest.coinapi.io'
  const API_KEY = process.env.COIN_API_KEY

  // BTC, ETH, XRP, SOL, NEAR
  app.get('/coin/list', (req, res) => {
    return res.json({
      list: [
        {
          id: 0,
          ticker: 'BTC',
          symbol_id: 'BITSTAMP_SPOT_BTC_USDC',
          price: 30000
        },
        {
          id: 1,
          ticker: 'SOL',
          symbol_id: 'BITSTAMP_SPOT_SOL_USD',
          price: 10000
        },
        {
          id: 2,
          ticker: 'NEAR',
          symbol_id: 'BITSTAMP_SPOT_NEAR_USD',
          price: 1000
        },
        {
          id: 3,
          ticker: 'ETH',
          symbol_id: 'BITSTAMP_SPOT_ETH_USDC',
          price: 10000
        },
        {
          id: 4,
          ticker: 'XRP',
          symbol_id: 'BITSTAMP_SPOT_XRP_USDT',
          price: 100
        }
      ]
    })
  })

  app.get('/coin/quotes', async (req, res) => {

    try {
      const response = await axios.get(`${HOST}/v1/quotes/current?filter_symbol_id=BITSTAMP_SPOT_BTC_USDC;BITSTAMP_SPOT_ETH_USDC;BITSTAMP_SPOT_XRP_USDT;BITSTAMP_SPOT_SOL_USD;BITSTAMP_SPOT_NEAR_USD;`, {
        headers: {
          'X-CoinAPI-Key': API_KEY
        }
      })
      console.log('response', response.data)

      return res.json({
        flag: true,
        data: response.data
      })
    } catch (error) {
      console.log('error', error)
      return res.json({
        flag: false,
        error: error
      })
    }    
  })

  app.get('/coin/history/:symbol/:period', async (req, res) => {
    const symbol_id = req.params.symbol
    const period_id = req.params.period

    if (!symbol_id) return;

    try {
      const response = await axios.get(`${HOST}/v1/ohlcv/${symbol_id}/history?period_id=${period_id}&time_start=2023-01-01T00:00:00&limit=50`, {
        headers: {
          'X-CoinAPI-Key': API_KEY
        }
      })
      console.log('response', response.data)

      return res.json({
        flag: true,
        data: response.data
      })
    } catch (e) {
      return res.json({
        flag: false,
        error: e
      })
    }
  })

}