Посилання на сайт: https://deliveryapp-gzn0.onrender.com

Для запуску проекту потрібно ввести команду `npm run dev`, після успішного запуску у консоль буде виведено `I'm listen port: 8700
`, а після приєднання до бази даних `I'm connected to DB`. 


На сайті працює чотири сторінки:

	1) Реєстрація - це сторінка реєстрація користувача. У цій сторінці реалізовано вибір ролі користувача, тобто він може бути клієнтом, 	кур'єром або магазином, що продає товари.

	2) Вхід - це сторінка входу в додаток.

	3) Головна сторінка - тут в залежності від вибраної ролі відображається список товарів, в клієнта, список замовлень, в кур'єра. 	Також є фільтр по вибору магазину, після того як користувач вибрав магазин, на сторінці залишаються товари лише цього магазину.

	4) Корзина - коли користувач вибрав товар він додає його до корзини. В корзині реалізовано автоматичний підрахунок загальної 	вартості, якщо користувач хоче купити кілька однакових товарів він може просто використати кнопки '-' та '+', для віднімання та 	додавання товару відповідно. Кількість товарів розташована між цими кнопками. Після додавання або віднімання, автоматинчо 	перераховується загальна вартість товарів в корзині. 

Після того як користувач вибрав товари та заповнив усі поля відправки (Своє ім'я, пошта, телефон, та адреса) він натискає кнопку order,
після цього в таблиці cart видаляється товар і додається до таблиці orders. У ній зберігається інформація про замовника та плата за доставку (10% від вартості корзини).
