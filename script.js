document.getElementById("fetchButton").addEventListener("click", async () => {

    const url = document.getElementById("urlInput").value;
    
    if (!url) {
        alert("Please enter a valid URL.");
        return;
    }

    try {
        // Выполняем HTTP-запрос по введённому URL.
        const response = await fetch(url);

        // Ожидаем получение текста ответа (HTML-контент страницы).
        const text = await response.text();

        // Передаём полученный HTML-код на обработку и отображение.
        parseAndDisplayData(text);

    } catch (error) {
        console.error("Error loading the webpage:", error);
        alert("Failed to load the webpage.");
    }
});

function parseAndDisplayData(html) {
    // Создаём парсер для разбора HTML-кода в объект DOM.
    const parser = new DOMParser();
    // Преобразуем строку с HTML в DOM-документ.
    const doc = parser.parseFromString(html, "text/html");

    const unwantedTags = ['script', 'style', 'noscript', 'meta', 'link'];

    unwantedTags.forEach(tag => {
        const elements = doc.querySelectorAll(tag);
        elements.forEach(el => el.remove());
    });

    // Находим все текстовые элементы, которые могут содержать полезную информацию (параграфы, заголовки, ссылки и т.д.).
    const contentNodes = Array.from(doc.body.querySelectorAll("p, h1, h2, h3, h4, div, span, li, a"));

    // Множество для хранения уже встречавшихся текстов, чтобы исключить дубликаты.
    let seenTexts = new Set();
    // Собираем текстовое содержимое элементов, очищаем от пробелов и фильтруем пустые строки и дублирующиеся тексты.
    let bodyText = contentNodes
      .map(node => node.textContent.trim()) // Обрезаем пробелы в начале и конце текста.
      .filter(text => text.length > 0 && !seenTexts.has(text) && seenTexts.add(text)) // Фильтруем пустые строки и дубликаты.
      .join(' '); // Объединяем все тексты в одну строку через пробел.

    let highlightedText = bodyText.replace(/(\d+)/g, '<span class="orange">$1</span>');

    highlightedText = highlightedText.replace(/\b[А-ЯA-ZЁ][а-яa-zё]*\b/g, '<span class="purple">$&</span>');

    highlightedText = highlightedText.replace(/(?<!\S)[\wА-Яа-яЁё]{9,}(?!\S)/g, '<span class="italic">$&</span>');

    document.getElementById("output").innerHTML = highlightedText;
}