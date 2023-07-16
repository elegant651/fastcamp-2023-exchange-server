const createClient = require('@supabase/supabase-js').createClient


module.exports =  (app) => {
  const ENDPOINT = process.env.SUPABASE_URL
  const API_KEY = process.env.SUPABASE_API_KEY

  const supabase = createClient(ENDPOINT, API_KEY)

  app.get('/orderbook/buy', async (req, res) => {
    try {
      const { data } = await supabase
      .from('orders_buy')
      .select()
      .gt('remain_amt', 0)
      .order('price', { ascending: false })
      .limit(10)

      return res.json({
        flag: true,
        data
      })
    } catch (e) {
      return res.json({
        flag: false,
        error: e
      })
    }
  })

  app.get('/orderbook/sell', async (req, res) => {
    try {
      const { data } = await supabase
      .from('orders_sell')
      .select()
      .gt('remain_amt', 0)
      .order('price', { ascending: true })
      .limit(10)

      return res.json({
        flag: true,
        data
      })
    } catch (e) {
      return res.json({
        flag: false,
        error: e
      })
    }
  })

  app.get('/trades', async (req, res) => {
    try {
      const { data } = await supabase
      .from('trades')
      .select()
      .order('id', { ascending: false })
      .limit(50)

      return res.json({
        flag: true,
        data
      })
    } catch (e) {
      return res.json({
        flag: false,
        error: e
      })
    }
  })
}