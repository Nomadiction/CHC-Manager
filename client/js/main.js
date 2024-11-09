// Работа с криптовалютами
const pricesContainer = document.getElementById('prices');
const loader = document.querySelector('#prices > lord-icon'); 

// Флаг для отслеживания первой загрузки
let firstLoad = true;

// Объект для хранения предыдущих цен
let previousPrices = {};

// Функция для форматирования цены
function formatPrice(price) {
    if (price >= 1) {
        return price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }
    return price.toLocaleString('en-US', { minimumFractionDigits: 4, maximumFractionDigits: 8 });
}

// Функция для получения данных криптовалют
async function fetchCryptoPrices() {
    try {
        // Показываем лоудер только при первой загрузке
        if (firstLoad) loader.style.display = 'block';

        const response = await fetch(`${window.location.origin}/api/crypto/prices`);
        const data = await response.json();
        
        // Отображаем данные после их получения
        displayPrices(data);

        // Скрываем лоудер после первой загрузки
        if (firstLoad) {
            loader.style.display = 'none';
            firstLoad = false;
        }

    } catch (error) {
        console.error('Error while retrieving data:', error);
        pricesContainer.innerHTML = '<p style="user-select:none;">Failed to load prices. Try again.</p>';
        loader.style.display = 'none';
    }
}

// Функция для отображения цен и процентов изменения на карточках
function displayPrices(prices) {
    for (const [currency, data] of Object.entries(prices)) {
        const { price, priceChangePercent } = data;

        // Проверка, существует ли уже карточка для данной криптовалюты
        let priceElement = document.getElementById(`crypto-${currency}`);
        
        if (!priceElement) {
            // Создаем новую карточку, если она еще не существует
            priceElement = document.createElement('div');
            priceElement.classList.add('crypto-card');
            priceElement.id = `crypto-${currency}`;
            
            let iconPath;
            switch (currency) {
                case 'bitcoin': iconPath = '/icons/logos/bitcoin-btc-logo.svg'; break;
                case 'ethereum': iconPath = '/icons/logos/ethereum-eth-logo.svg'; break;
                case 'toncoin': iconPath = '/icons/logos/toncoin-ton-logo.svg'; break;
                case 'dogecoin': iconPath = '/icons/logos/dogecoin-doge-logo.svg'; break;
                case 'pepecoin': iconPath = '/icons/logos/pepe-pepe-logo.svg'; break;
                case 'shibcoin': iconPath = '/icons/logos/shiba-inu-shib-logo.svg'; break;
                case 'solana': iconPath = '/icons/logos/solana-sol-logo.svg'; break;
                case 'cardano': iconPath = '/icons/logos/cardano-ada-logo.svg'; break;
                case 'ripple': iconPath = '/icons/logos/xrp-xrp-logo.svg'; break;
                case 'polkadot': iconPath = '/icons/logos/polkadot-new-dot-logo.svg'; break;
                case 'uniswap': iconPath = '/icons/logos/uniswap-uni-logo.svg'; break;
                case 'litecoin': iconPath = '/icons/logos/litecoin-ltc-logo.svg'; break;
                case 'binancecoin': iconPath = '/icons/logos/bnb-bnb-logo.svg'; break;
                case 'dogs': iconPath = '/icons/logos/dogs-dogs-logo.svg'; break;
                default: iconPath = 'NaN';
            }

            // Создаем содержимое карточки
            priceElement.innerHTML = `
                <div class="icon-name">
                    <img src="${iconPath}" alt="${currency}" class="crypto-icon">
                    <span class="crypto-name">${currency.charAt(0).toUpperCase() + currency.slice(1)}</span>
                </div>
                <span class="crypto-price">${formatPrice(price)}</span>
                <span class="crypto-change"></span>
            `;

            // Добавляем карточку в контейнер
            pricesContainer.appendChild(priceElement);

            // Добавляем обработчики касания
            addTouchEffects(priceElement);
        }

        // Обновление только данных внутри существующей карточки
        const priceText = priceElement.querySelector('.crypto-price');
        const changeText = priceElement.querySelector('.crypto-change');

        // Обновляем цену и проценты изменения
        priceText.textContent = formatPrice(price);
        changeText.textContent = `${priceChangePercent.toFixed(2)}%`;

        // Обновляем класс для индикатора изменения
        const changeClass = priceChangePercent > 0 ? 'positive' : 'negative';
        changeText.className = `crypto-change ${changeClass}`;

        // Обновляем данные предыдущих цен
        previousPrices[currency] = price;
    }
}

// Функция для применения эффектов при касаниях
function addTouchEffects(card) {
    let touchEndTimeout;

    card.addEventListener('touchstart', function() {
        card.classList.add('active');
    });

    card.addEventListener('touchend', function() {
        clearTimeout(touchEndTimeout);

        // Таймер для удаления подсветки
        touchEndTimeout = setTimeout(() => {
            card.classList.remove('active');
        }, 1000);
    });
}

// Обновление цены каждую секунду
fetchCryptoPrices();
setInterval(fetchCryptoPrices, 1000);
