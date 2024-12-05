document.addEventListener("DOMContentLoaded", () => {
    // Всплывающее окно при загрузке сайта
    // const login = prompt("Введите ваш логин:");
    // if (login === "Админ") {
    //     const password = prompt("Введите пароль:");
    //     if (password === "Я главный") {
    //         alert("Здравствуйте!");
    //     } else if (!password) {
    //         alert("Отменено");
    //     } else {
    //         alert("Неверный пароль");
    //     }
    // } else if (!login) {
    //     alert("Отменено");
    // } else {
    //     alert("Я вас не знаю");
    // }

    // Генерация случайной капчи
    function generateTextCaptcha() {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let captcha = '';
        for (let i = 0; i < 6; i++) {
            captcha += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return captcha;
    }

    function generateNumberCaptcha() {
        const num1 = Math.floor(Math.random() * 10);
        const num2 = Math.floor(Math.random() * 10);
        return { question: `${num1} + ${num2}`, answer: num1 + num2 };
    }

    // Проверка пустого объекта
    function isEmpty(obj) {
        return Object.keys(obj).length === 0;
    }

    const captchaContainer = document.getElementById('captcha-container');
    const captchaInput = document.getElementById('captcha-input');
    const captchaError = document.getElementById('captcha-error');
    let currentCaptcha;

    if (captchaContainer && captchaInput && captchaError) {
        function setupCaptcha() {
            if (!currentCaptcha || isEmpty(currentCaptcha)) {
                currentCaptcha = generateTextCaptcha();
                captchaContainer.textContent = `Введите: ${currentCaptcha}`;
            }
        }

        captchaInput.addEventListener('input', () => {
            if (captchaInput.value === currentCaptcha) {
                document.querySelector('button[type="submit"]').disabled = false;
                captchaError.style.display = 'none';
            } else {
                document.querySelector('button[type="submit"]').disabled = true;
                captchaError.style.display = 'block';
            }
        });

        // При неправильной капче показываем числовую
        captchaInput.addEventListener('blur', () => {
            if (captchaInput.value !== currentCaptcha) {
                const numberCaptcha = generateNumberCaptcha();
                currentCaptcha = numberCaptcha.answer.toString();
                captchaContainer.textContent = `Решите: ${numberCaptcha.question}`;
            }
        });

        setupCaptcha();
    }

    // Логика для кнопки "Нравится"
    // Обработка кнопки "Нравится"
    const likeButton = document.getElementById("like-button");

    if (likeButton) {
        likeButton.addEventListener("click", () => {
            // Переключение класса active
            likeButton.classList.toggle("active");

            // Меняем текст кнопки в зависимости от её состояния
            if (likeButton.classList.contains("active")) {
                likeButton.textContent = "Нравится ❤️";
            } else {
                likeButton.textContent = "Нравится";
            }
        });
    }

    // Рисование
    const drawingArea = document.getElementById("drawing-area");
    let isDrawing = false;

    if (drawingArea) {
        drawingArea.addEventListener("click", () => {
            isDrawing = !isDrawing;
        });

        drawingArea.addEventListener("mousemove", (e) => {
            if (isDrawing) {
                const dot = document.createElement("div");
                dot.style.position = "absolute";
                dot.style.width = "5px";
                dot.style.height = "5px";
                dot.style.backgroundColor = "black";
                dot.style.borderRadius = "50%";
                dot.style.left = `${e.offsetX}px`;
                dot.style.top = `${e.offsetY}px`;
                drawingArea.appendChild(dot);
            }
        });
    }

    //  Магазин
    // Функция truncate
    function truncate(str, maxlength) {
        return str.length > maxlength ? str.slice(0, maxlength - 1) + '…' : str;
    }

    // Функция Accumulator
    function Accumulator(startingValue) {
        this.value = startingValue;

        this.add = function (amount) {
            this.value += amount;
        };

        this.reset = function () {
            this.value = 0;
        };
    }
    const testCart = new Accumulator(0);
    testCart.add(100);
    console.log(testCart.value); // Ожидается: 100
    testCart.reset();
    console.log(testCart.value); // Ожидается: 0
    // Корзина
    const cart = new Accumulator(0);

    // Обработка описаний товаров
    const descriptions = document.querySelectorAll(".description");
    descriptions.forEach((desc) => {
        desc.textContent = truncate(desc.textContent, 100); // Обрезаем до 100 символов
    });

    // Логика для корзины
    const buyButtons = document.querySelectorAll(".buy-button");
    const totalValue = document.getElementById("total-value");
    const cartItems = document.getElementById("cart-items"); // Новый список для отображения товаров
    const clearCartButton = document.getElementById("clear-cart");
    const checkoutButton = document.getElementById("checkout"); // Кнопка завершения покупок
    const removeItemButton = document.getElementById("remove-item");
    const filterButton = document.getElementById("filter-button");
    const sortAscButton = document.getElementById("sort-asc");
    const sortDescButton = document.getElementById("sort-desc");
    const minPriceInput = document.getElementById("min-price");
    const maxPriceInput = document.getElementById("max-price");

    let cartArray = [];

    if (buyButtons.length > 0 && totalValue && clearCartButton && cartItems && checkoutButton && removeItemButton && filterButton && sortAscButton && sortDescButton && minPriceInput && maxPriceInput) {
        buyButtons.forEach((button) => {
            // Получаем цену и название товара
            const courseCard = button.parentElement;
            const name = courseCard.querySelector("h3").textContent;
            const priceElement = courseCard.querySelector(".price");
            const price = parseInt(priceElement.textContent.replace(/\D/g, ""), 10);

            // Добавляем товар в корзину
            button.addEventListener("click", () => {
                addItemToCart(name, price);
            });
        });

        // Функция добавления товара в корзину
        function addItemToCart(name, price) {
            cart.add(price);
            totalValue.textContent = `${cart.value} руб.`;

            const listItem = document.createElement("li");
            listItem.innerHTML = `
                <span class="cart-item-name">${name}</span>
                <span class="cart-item-price">${price} руб.</span>
                <button class="increase-quantity">+</button>
                <button class="decrease-quantity">-</button>
            `;
            cartItems.appendChild(listItem);

            const increaseButton = listItem.querySelector(".increase-quantity");
            const decreaseButton = listItem.querySelector(".decrease-quantity");

            increaseButton.addEventListener("click", () => {
                cart.add(price);
                totalValue.textContent = `${cart.value} руб.`;
            });

            decreaseButton.addEventListener("click", () => {
                if (cart.value >= price) {
                    cart.add(-price);
                    totalValue.textContent = `${cart.value} руб.`;
                }
            });

            cartArray.push({ name, price });
        }

        // Очистка корзины
        clearCartButton.addEventListener("click", () => {
            cart.reset();
            totalValue.textContent = `${cart.value} руб.`;
            cartItems.innerHTML = ""; // Удаляем все элементы списка
            cartArray = [];
        });

        // Завершение покупки
        checkoutButton.addEventListener("click", () => {
            if (cart.value === 0) {
                alert("Корзина пуста! Добавьте товары перед покупкой.");
            } else {
                alert(`Спасибо за покупку! Итоговая сумма: ${cart.value} руб.`);
                cart.reset();
                totalValue.textContent = `${cart.value} руб.`;
                cartItems.innerHTML = "";
                cartArray = [];
            }
        });

        // Удаление элемента из массива
        removeItemButton.addEventListener("click", () => {
            if (cartArray.length > 0) {
                const randomIndex = Math.floor(Math.random() * cartArray.length);
                cartArray.splice(randomIndex, 1);
                updateCartDisplay();
            }
        });

        // Фильтрация элементов
        filterButton.addEventListener("click", () => {
            const minPrice = parseInt(minPriceInput.value, 10) || 0;
            const maxPrice = parseInt(maxPriceInput.value, 10) || Infinity;
            const filteredArray = cartArray.filter(item => item.price >= minPrice && item.price <= maxPrice);
            displayFilteredItems(filteredArray);
        });

        // Сортировка элементов по возрастанию
        sortAscButton.addEventListener("click", () => {
            cartArray.sort((a, b) => a.price - b.price);
            updateCartDisplay();
        });

        // Сортировка элементов по убыванию
        sortDescButton.addEventListener("click", () => {
            cartArray.sort((a, b) => b.price - a.price);
            updateCartDisplay();
        });

        // Функция обновления отображения корзины
        function updateCartDisplay() {
            cartItems.innerHTML = "";
            cart.reset();
            cartArray.forEach(({ name, price }) => {
                cart.add(price);
                const listItem = document.createElement("li");
                listItem.innerHTML = `
                    <span class="cart-item-name">${name}</span>
                    <span class="cart-item-price">${price} руб.</span>
                    <button class="increase-quantity">+</button>
                    <button class="decrease-quantity">-</button>
                `;
                cartItems.appendChild(listItem);

                const increaseButton = listItem.querySelector(".increase-quantity");
                const decreaseButton = listItem.querySelector(".decrease-quantity");

                increaseButton.addEventListener("click", () => {
                    cart.add(price);
                    totalValue.textContent = `${cart.value} руб.`;
                });

                decreaseButton.addEventListener("click", () => {
                    if (cart.value >= price) {
                        cart.add(-price);
                        totalValue.textContent = `${cart.value} руб.`;
                    }
                });
            });
            totalValue.textContent = `${cart.value} руб.`;
        }

        // Функция отображения отфильтрованных элементов
        function displayFilteredItems(filteredArray) {
            cartItems.innerHTML = "";
            cart.reset();
            filteredArray.forEach(({ name, price }) => {
                cart.add(price);
                const listItem = document.createElement("li");
                listItem.innerHTML = `
                    <span class="cart-item-name">${name}</span>
                    <span class="cart-item-price">${price} руб.</span>
                    <button class="increase-quantity">+</button>
                    <button class="decrease-quantity">-</button>
                `;
                cartItems.appendChild(listItem);

                const increaseButton = listItem.querySelector(".increase-quantity");
                const decreaseButton = listItem.querySelector(".decrease-quantity");

                increaseButton.addEventListener("click", () => {
                    cart.add(price);
                    totalValue.textContent = `${cart.value} руб.`;
                });

                decreaseButton.addEventListener("click", () => {
                    if (cart.value >= price) {
                        cart.add(-price);
                        totalValue.textContent = `${cart.value} руб.`;
                    }
                });
            });
            totalValue.textContent = `${cart.value} руб.`;
        }
    } else {
        console.error("Some elements are missing in the DOM.");
    }

    // Тест
    const questions = [
        { image: 'img5.png', correct: 'Поп-арт' },
        { image: 'img1.png', correct: 'Экспрессионизм' },
        { image: 'img3.png', correct: 'Неоклассицизм' },
        { image: 'img2.png', correct: 'Реализм' }
    ];

    let currentQuestion = 0;
    let score = 0;

    function showQuestion() {
        // Скрываем все вопросы
        document.querySelectorAll('.question').forEach((el, index) => {
            el.style.display = index === currentQuestion ? 'block' : 'none';
        });
    }

    window.checkAnswer = function (answer) {
        const correctAnswer = questions[currentQuestion].correct;

        // Проверяем на совпадение
        if (answer === correctAnswer) {
            score++;
        }

        currentQuestion++;

        if (currentQuestion < questions.length) {
            showQuestion();
        } else {
            showResult();
        }
    };

    function showResult() {
        document.querySelectorAll('.question').forEach(el => (el.style.display = 'none'));
        const resultContainer = document.getElementById('result');
        resultContainer.style.display = 'block';

        // Формируем текст результата
        const resultText = score === questions.length
            ? 'Вы запомнили стили правильно!'
            : score === 0
            ? 'Похоже вы плохо запомнили направления.'
            : 'Неплохо, но есть куда стремиться.';

        document.getElementById('result-text').innerText = `Вы ответили правильно на ${score} из ${questions.length} вопросов. ${resultText}`;
    }

    window.restartQuiz = function () {
        currentQuestion = 0;
        score = 0;
        document.getElementById('result').style.display = 'none';
        showQuestion();
    };

    // Показ первого вопроса
    showQuestion();
    // Инициализация карты
    const map = L.map('map').setView([48.8566, 2.3522], 2); 
    // Подключение тайлов OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '' // Убираем атрибуцию
    }).addTo(map);

    // Список музеев
    const museums = [
        { name: "Лувр", coords: [48.860611, 2.337644], info: "Лувр, Париж, Франция", sectionId: "museum-louvre" },
        { name: "Национальная галерея", coords: [51.508929, -0.128299], info: "Национальная галерея, Лондон, Великобритания", sectionId: "museum-national-gallery" },
        { name: "Эрмитаж", coords: [59.939832, 30.314560], info: "Эрмитаж, Санкт-Петербург, Россия", sectionId: "museum-hermitage" },
        { name: "Метрополитен-музей", coords: [40.779437, -73.963244], info: "Метрополитен, Нью-Йорк, США", sectionId: "museum-metropolitan" },
        { name: "Дрезденская галерея", coords: [51.053528, 13.741824], info: "Галерея старых мастеров, Дрезден, Германия", sectionId: "museum-dresden"},
        { name: "Музей Прадо", coords: [40.413781, -3.692127], info: "Музей Прадо, Мадрид, Испания",  sectionId: "museum-prado" },
        { name: "Рейксмузеум", coords: [52.360013, 4.885190], info: "Рейксмузеум, Амстердам, Нидерланды", sectionId: "museum-rijksmuseum" },
        { name: "Национальный музей Китая", coords: [39.905507, 116.398417], info: "Национальный музей Китая, Пекин",  sectionId: "museum-china"},
        { name: "Музеи Ватикана", coords: [41.906487, 12.453601], info: "Музеи Ватикана",  sectionId: "museum-vatican" },
        { name: "Токийский национальный музей", coords: [35.718833, 139.776686], info: "Национальный музей, Токио, Япония" ,  sectionId: "museum-tokyo" },
        { name: "Галерея Третьяковка", coords: [55.741435, 37.620795], info: "Известная художественная галерея.", sectionId: "museum-tretyakovka"},
        { name: "Королевский музей Онтарио", coords: [43.667710, -79.394777], info: "Royal Ontario Museum, Торонто, Канада", sectionId: "museum-royal-ontario" }
    ];

    // Добавляем маркеры
    museums.forEach(museum => {
        const marker = L.marker(museum.coords).addTo(map);
        marker.bindPopup(`<b>${museum.name}</b><br>${museum.info}`);
    });
});