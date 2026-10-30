let userName = prompt('Как вас зовут?');

if (userName === null || userName.trim() === '') {
    userName = 'гость';
}

alert('Здравствуйте, ' + userName + '! Добро пожаловать на страницу данных эксперимента.');
console.log('Пользователь: ' + userName);

const measurements = [12, 45, 78, 54, 90, 8, 63];

function findMax(arr) {
    let max = arr[0];
    for (let i = 1; i < arr.length; i++) {
        if (arr[i] > max) {
            max = arr[i];
        }
    }
    return max;
}

function getSum(arr) {
    let sum = 0;
    for (let i = 0; i < arr.length; i++) {
        sum = sum + arr[i];
    }
    return sum;
}

function filterAboveAverage(arr) {
    const average = getSum(arr) / arr.length;
    const result = [];
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] > average) {
            result.push(arr[i]);
        }
    }
    return result;
}

function countAnomalies(arr) {
    const max = findMax(arr);
    const threshold = max * 0.1;
    let count = 0;
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] <= threshold) {
            count = count + 1;
            console.log('Аномально низкое значение: ' + arr[i]);
        }
    }
    return count;
}

const max = findMax(measurements);
const min = Math.min.apply(null, measurements);
const average = getSum(measurements) / measurements.length;
const aboveAverage = filterAboveAverage(measurements);
const lowCount = countAnomalies(measurements);

alert('Среднее значение – ' + average + ', ' + aboveAverage.length + ' измерений – выше среднего');
console.log('Количество аномально низких значений: ' + lowCount);

if (max - min > 50) {
    console.log('Наблюдается высокая вариативность данных');
}

const defaultHypotheses = [
    { text: 'В районах с большей площадью зелёных насаждений средний уровень стресса жителей ниже.', verified: false },
    { text: 'Качество воздуха в спальных районах значительно лучше, чем в промышленных.', verified: true },
    { text: 'Наличие водоёма в парке увеличивает видовое разнообразие птиц минимум на 20%.', verified: false }
];

const list = document.querySelector('.hypotheses');
const counter = document.getElementById('hypotheses-counter');
const addBtn = document.getElementById('add-hypothesis');
const input = document.getElementById('new-hypothesis');
const toggleBtn = document.getElementById('toggle-hypotheses');
const themeBtn = document.getElementById('theme-btn');
const section = document.getElementById('hypotheses');

if (!list) {
    console.error('Контейнер .hypotheses не найден');
}
if (!section) {
    console.error('Секция #hypotheses не найдена');
}

function loadHypotheses() {
    try {
        const raw = localStorage.getItem('hypotheses');
        if (raw !== null) {
            const parsed = JSON.parse(raw);
            if (Array.isArray(parsed)) {
                return parsed;
            }
        }
    } catch (e) {
        console.error('Не удалось прочитать localStorage: ' + e.message);
    }
    return defaultHypotheses.slice();
}

function saveHypotheses() {
    try {
        localStorage.setItem('hypotheses', JSON.stringify(hypotheses));
    } catch (e) {
        console.error('Не удалось сохранить в localStorage: ' + e.message);
    }
}

let hypotheses = loadHypotheses();

function createCard(item, index) {
    const card = document.createElement('article');
    card.className = 'hypothesis-card';

    const text = document.createElement('p');
    text.textContent = item.text;

    const status = document.createElement('span');
    status.className = 'status ' + (item.verified ? 'status-verified' : 'status-unverified');
    status.textContent = item.verified ? 'проверена' : 'не проверена';

    const buttons = document.createElement('div');
    buttons.className = 'card-buttons';

    const statusBtn = document.createElement('button');
    statusBtn.type = 'button';
    statusBtn.textContent = 'Изменить статус';
    statusBtn.addEventListener('click', function () {
        hypotheses[index].verified = !hypotheses[index].verified;
        saveHypotheses();
        render();
    });

    const deleteBtn = document.createElement('button');
    deleteBtn.type = 'button';
    deleteBtn.textContent = 'Удалить';
    deleteBtn.addEventListener('click', function () {
        hypotheses.splice(index, 1);
        saveHypotheses();
        render();
    });

    buttons.appendChild(statusBtn);
    buttons.appendChild(deleteBtn);
    card.appendChild(text);
    card.appendChild(status);
    card.appendChild(buttons);
    return card;
}

function updateCounter() {
    if (!counter) {
        return;
    }
    const cards = document.querySelectorAll('.hypothesis-card');
    const verified = document.querySelectorAll('.status-verified');
    counter.textContent = 'Всего гипотез: ' + cards.length + ', из них проверено: ' + verified.length;
}

function render() {
    if (!list) {
        return;
    }
    while (list.firstChild) {
        list.removeChild(list.firstChild);
    }
    for (let i = 0; i < hypotheses.length; i++) {
        list.appendChild(createCard(hypotheses[i], i));
    }
    updateCounter();
}

if (addBtn && input) {
    addBtn.addEventListener('click', function () {
        const text = input.value.trim();
        if (text === '') {
            alert('Введите формулировку гипотезы');
            return;
        }
        hypotheses.push({ text: text, verified: false });
        saveHypotheses();
        input.value = '';
        render();
    });
} else {
    console.error('Кнопка добавления или поле ввода не найдены');
}

if (toggleBtn) {
    toggleBtn.addEventListener('click', function () {
        if (!section) {
            console.error('Секция #hypotheses не найдена');
            return;
        }
        if (section.hasAttribute('hidden')) {
            section.removeAttribute('hidden');
            toggleBtn.textContent = 'Скрыть гипотезы';
        } else {
            section.setAttribute('hidden', '');
            toggleBtn.textContent = 'Показать гипотезы';
        }
    });
} else {
    console.error('Кнопка скрытия гипотез не найдена');
}

function applyTheme(theme) {
    if (theme === 'dark') {
        document.body.classList.add('dark-theme');
    } else {
        document.body.classList.remove('dark-theme');
    }
    if (themeBtn) {
        themeBtn.textContent = theme === 'dark' ? 'Светлая тема' : 'Тёмная тема';
        themeBtn.setAttribute('aria-pressed', theme === 'dark' ? 'true' : 'false');
    }
}

if (themeBtn) {
    themeBtn.addEventListener('click', function () {
        const isDark = document.body.classList.toggle('dark-theme');
        const theme = isDark ? 'dark' : 'light';
        try {
            localStorage.setItem('theme', theme);
        } catch (e) {
            console.error('Не удалось сохранить тему: ' + e.message);
        }
        themeBtn.textContent = isDark ? 'Светлая тема' : 'Тёмная тема';
        themeBtn.setAttribute('aria-pressed', isDark ? 'true' : 'false');
    });
} else {
    console.error('Кнопка переключения темы не найдена');
}

let savedTheme = 'light';
try {
    if (localStorage.getItem('theme') === 'dark') {
        savedTheme = 'dark';
    }
} catch (e) {
    console.error('Не удалось прочитать тему: ' + e.message);
}
applyTheme(savedTheme);

render();
