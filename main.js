import './style.css'

const jsonInput = document.getElementById('jsonInput');
const countBtn = document.getElementById('countBtn');
const clearBtn = document.getElementById('clearBtn');
const resultContainer = document.getElementById('resultContainer');
const errorContainer = document.getElementById('errorContainer');
const errorMessage = document.getElementById('errorMessage');
const totalCountEl = document.getElementById('totalCount');
const topLevelCountEl = document.getElementById('topLevelCount');
const objectCountEl = document.getElementById('objectCount');
const arrayCountEl = document.getElementById('arrayCount');
const primitiveCountEl = document.getElementById('primitiveCount');

countBtn.addEventListener('click', () => {
    const input = jsonInput.value.trim();

    if (!input) {
        showError('Please paste some JSON content first.');
        return;
    }

    try {
        const parsed = JSON.parse(input);
        const counts = countItems(parsed);
        showResult(counts);
    } catch (e) {
        showError(`Invalid JSON: ${e.message}`);
    }
});

clearBtn.addEventListener('click', () => {
    jsonInput.value = '';
    hideResult();
    hideError();
    jsonInput.focus();
});

function countItems(data) {
    let total = 0;
    let objects = 0;
    let arrays = 0;
    let primitives = 0;
    let topLevel = 0;

    // Calculate top level items
    if (Array.isArray(data)) {
        topLevel = data.length;
    } else if (data !== null && typeof data === 'object') {
        topLevel = Object.keys(data).length;
    } else {
        topLevel = 1; // A single primitive is 1 item
    }

    function traverse(item) {
        total++; // Count the item itself

        if (Array.isArray(item)) {
            arrays++;
            item.forEach(subItem => traverse(subItem));
        } else if (item !== null && typeof item === 'object') {
            objects++;
            Object.values(item).forEach(subItem => traverse(subItem));
        } else {
            primitives++;
        }
    }

    traverse(data);

    // If the root data is an object (and not an array), subtract 1 from the objects count
    // because we don't want to count the root container itself.
    if (data !== null && typeof data === 'object' && !Array.isArray(data)) {
        objects = Math.max(0, objects - 1);
    }

    return { total, objects, arrays, primitives, topLevel };
}

function showResult(counts) {
    hideError();
    topLevelCountEl.textContent = counts.topLevel.toLocaleString();
    totalCountEl.textContent = counts.total.toLocaleString();
    objectCountEl.textContent = counts.objects.toLocaleString();
    arrayCountEl.textContent = counts.arrays.toLocaleString();
    primitiveCountEl.textContent = counts.primitives.toLocaleString();

    resultContainer.classList.remove('hidden');
}

function showError(msg) {
    hideResult();
    errorMessage.textContent = msg;
    errorContainer.classList.remove('hidden');
}

function hideResult() {
    resultContainer.classList.add('hidden');
}

function hideError() {
    errorContainer.classList.add('hidden');
}
