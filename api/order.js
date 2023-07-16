const createClient = require('@supabase/supabase-js').createClient


module.exports =  (app) => {
  const ENDPOINT = process.env.SUPABASE_URL
  const API_KEY = process.env.SUPABASE_API_KEY

  const supabase = createClient(ENDPOINT, API_KEY)

  const ORDERS_BUY = 'orders_buy'
  const ORDERS_SELL = 'orders_sell'
  const TRADES = 'trades'

  const processOrder = async (isBuy, item) => {
    const { amount, price, user_id } = item

    const { data } = await supabase
      .from(isBuy ? ORDERS_SELL : ORDERS_BUY)
      .select()
      .gt('remain_amt', 0)
      .eq('price', price)

      console.log('data', data)    

      //remain_amt > 0 && price가 같은 경우
      if (data[0]) {
        const editData = data[0]

        if (editData.remain_amt >= amount) {
          await supabase
          .from(isBuy ? ORDERS_SELL : ORDERS_BUY)
          .update({ remain_amt: editData.remain_amt - amount })
          .eq('id', editData.id)

          await supabase
          .from(TRADES)
          .insert({ amount, price })
        } else {
          await supabase
          .from(isBuy ? ORDERS_SELL : ORDERS_BUY)
          .update({ remain_amt: 0 })
          .eq('id', editData.id)

          const remainer = amount - editData.remain_amt
          await supabase
          .from(isBuy ? ORDERS_BUY : ORDERS_SELL)
          .insert({ user_id, amount: remainer, price, remain_amt: remainer })

          await supabase
          .from(TRADES)
          .insert({ amount: editData.remain_amt, price })
        }
      } else {
        const { error } = await supabase
        .from(isBuy ? ORDERS_BUY : ORDERS_SELL)
        .insert({ user_id, amount, price, remain_amt: amount })
      }
  }


  app.post('/order/buy', async (req, res) => {
    const item = req.body

    try {
      await processOrder(true, item)
      res.sendStatus(200)
    } catch (error) {
      console.log('error', error)
      res.sendStatus(500)
    }
  })


  app.post('/order/sell', async (req, res) => {
    const item = req.body

    try {
      await processOrder(false, item)
      res.sendStatus(200)
    } catch (error) {
      console.log('error', error)
      res.sendStatus(500)
    }
  })

}