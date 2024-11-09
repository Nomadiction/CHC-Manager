const axios = require('axios');

exports.getCryptoPrices = async (req, res) => {
  try {
    const symbols = [
      'BTCUSDT', 'ETHUSDT', 'TONUSDT', 
      'DOGEUSDT', 'PEPEUSDT', 'SHIBUSDT', 
      'SOLUSDT', 'ADAUSDT', 'XRPUSDT', 
      'DOTUSDT', 'UNIUSDT', 'LTCUSDT', 
      'BNBUSDT', 'DOGSUSDT'
    ];
    const prices = {};

    // Параллельные запросы к Binance API
    const requests = symbols.map(symbol => 
      axios.get(`https://api.binance.com/api/v3/ticker/24hr?symbol=${symbol}`)
    );

    const responses = await Promise.all(requests);

    responses.forEach((response, index) => {
      const symbol = symbols[index];
      const data = response.data;
      
      // Формируем объект с данными по каждой криптовалюте
      const cryptoData = {
        price: parseFloat(data.lastPrice),               // Текущая цена
        priceChange: parseFloat(data.priceChange),       // Изменение цены за 24ч
        priceChangePercent: parseFloat(data.priceChangePercent), // Изменение в процентах за 24ч
        weightedAvgPrice: parseFloat(data.weightedAvgPrice), // Средневзвешенная цена
        highPrice: parseFloat(data.highPrice),           // Максимальная цена за 24ч
        lowPrice: parseFloat(data.lowPrice),             // Минимальная цена за 24ч
        volume: parseFloat(data.volume),                 // Объём торгов за 24ч
        quoteVolume: parseFloat(data.quoteVolume),       // Объём торгов в базовой валюте
        openPrice: parseFloat(data.openPrice),           // Цена открытия за 24ч
        bidPrice: parseFloat(data.bidPrice),             // Лучшая цена покупки
        askPrice: parseFloat(data.askPrice)              // Лучшая цена продажи
      };

      // Присваиваем данные криптовалюте по её символу
      if (symbol === 'BTCUSDT') prices.bitcoin = cryptoData;
      if (symbol === 'ETHUSDT') prices.ethereum = cryptoData;
      if (symbol === 'TONUSDT') prices.toncoin = cryptoData;
      if (symbol === 'DOGEUSDT') prices.dogecoin = cryptoData;
      if (symbol === 'PEPEUSDT') prices.pepecoin = cryptoData;
      if (symbol === 'SHIBUSDT') prices.shibcoin = cryptoData;
      if (symbol === 'SOLUSDT') prices.solana = cryptoData;
      if (symbol === 'ADAUSDT') prices.cardano = cryptoData;
      if (symbol === 'XRPUSDT') prices.ripple = cryptoData;
      if (symbol === 'DOTUSDT') prices.polkadot = cryptoData;
      if (symbol === 'UNIUSDT') prices.uniswap = cryptoData;
      if (symbol === 'LTCUSDT') prices.litecoin = cryptoData;
      if (symbol === 'BNBUSDT') prices.binancecoin = cryptoData;
      if (symbol === 'DOGSUSDT') prices.dogs = cryptoData;
    });

    res.json(prices); // Возвращаем расширенные данные как JSON

  } catch (error) {
    console.error('Error while retrieving data:', error);
    res.status(500).json({ error: 'Error fetching crypto data' });
  }
};
