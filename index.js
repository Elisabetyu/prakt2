const ITEMS_PER_PAGE = 20;
const TOTAL_ITEMS = 1000;
const UNIQUE_IMAGES = 10;
const TITLES = [
    "Картошка",
    "Баноффи пай",
    "Клубничное",
    "Красный бархат",
    "Макарон",
    "Кекс",
    "Медовик",
    "Наполеон",
    "Прага",
    "Чизкейк Нью-Йорк"
];

let currentPage = 1;
let items = JSON.parse(localStorage.getItem("items")) || [];

// Если массив пуст, загружаем стандартные 1000 элементов и фиксируем порядок
if (items.length === 0) {
    for (let i = 1; i <= TOTAL_ITEMS; i++) {
        items.push({
            id: i,
            image: `cake${((i - 1) % UNIQUE_IMAGES) + 1}.jpg`,
            title: TITLES[(i - 1) % UNIQUE_IMAGES]
        });
    }
    shuffle(items); // Один раз перемешиваем
    localStorage.setItem("items", JSON.stringify(items));
}

document.addEventListener('DOMContentLoaded', () => {
    initEventListeners();
    renderGallery();
});

// Функция перемешивания (только при первой загрузке)
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function initEventListeners() {
    document.querySelector('.add-btn').addEventListener('click', addRandomItem);
    document.querySelector('.page-prev').addEventListener('click', () => changePage(-1));
    document.querySelector('.page-next').addEventListener('click', () => changePage(1));
    document.querySelector('.back-btn').addEventListener('click', closeDetails);
    document.getElementById('pageInput').addEventListener('change', handlePageInput);
}

function renderGallery() {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    const pageItems = items.slice(start, end);

    document.getElementById('gallery').innerHTML = pageItems
        .map(item => `
            <div class="gallery-item" data-id="${item.id}">
                <img src="${item.image}" alt="${item.title}">
                <button class="delete-btn" data-id="${item.id}">×</button>
            </div>
        `).join('');

    document.querySelectorAll('.gallery-item').forEach(item => {
        item.addEventListener('click', handleItemClick);
    });

    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            deleteItem(Number(btn.dataset.id));
        });
    });

    document.getElementById('currentPage').textContent = currentPage;
    document.getElementById('pageInput').value = currentPage;
}

function handleItemClick(e) {
    if (!e.target.classList.contains('delete-btn')) {
        const itemId = e.currentTarget.dataset.id;
        showDetails(itemId);
    }
}

function handlePageInput(e) {
    const newPage = Math.max(1, Math.min(
        Math.ceil(items.length / ITEMS_PER_PAGE),
        parseInt(e.target.value) || 1
    ));
    currentPage = newPage;
    renderGallery();
}

function deleteItem(id) {
    items = items.filter(item => item.id !== id);
    localStorage.setItem("items", JSON.stringify(items));
    if (currentPage > Math.ceil(items.length / ITEMS_PER_PAGE)) {
        currentPage = Math.max(1, Math.ceil(items.length / ITEMS_PER_PAGE));
    }
    renderGallery();
}

function addRandomItem() {
    const newId = items.length ? Math.max(...items.map(i => i.id)) + 1 : 1;
    const newItem = {
        id: newId,
        image: `cake${((newId - 1) % UNIQUE_IMAGES) + 1}.jpg`,
        title: TITLES[(newId - 1) % UNIQUE_IMAGES]
    };
    items.push(newItem);
    localStorage.setItem("items", JSON.stringify(items));
    renderGallery();
}

function showDetails(id) {
    const item = items.find(i => i.id === Number(id));
    document.getElementById('cakeTitle').textContent = item.title;
    document.querySelector('.gallery-container').style.display = 'none';
    document.getElementById('detailsPage').style.display = 'block';
}

function closeDetails() {
    document.querySelector('.gallery-container').style.display = 'block';
    document.getElementById('detailsPage').style.display = 'none';
}

function changePage(delta) {
    const newPage = currentPage + delta;
    const maxPage = Math.ceil(items.length / ITEMS_PER_PAGE);
    if (newPage > 0 && newPage <= maxPage) {
        currentPage = newPage;
        renderGallery();
    }
}
