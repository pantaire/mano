document.addEventListener('DOMContentLoaded', function () {
    // URL for the JSON data
    const jsonDataUrl = 'https://raw.githubusercontent.com/pantaire/mano/main/mano.json';


    // Event listeners for type filter buttons
    const typeFilterButtons = document.querySelectorAll('.type-filter-btn');
    typeFilterButtons.forEach(button => {
        button.addEventListener('click', function () {
            console.log('Type filter button clicked:', this.id);
            typeFilterButtons.forEach(btn => btn.classList.remove('btn-primary'));
            this.classList.add('btn-primary');
            const filterValue = this.id.replace('-filter', '');
            console.log('Filter value:', filterValue);
            filterMenuItems(filterValue); // Pass filterValue as argument
        });
    });

    // Array to store selected ingredients for filtering
    let selectedIngredients = [];

    // Function to display menu items
    function displayMenuItems(items) {
        const menuList = document.getElementById('menu-list');
        menuList.innerHTML = ''; // Clear existing list
        items.forEach(item => {
            console.log('Displaying item:', item);
            const listItem = document.createElement('li');
            listItem.className = 'list-group-item';
            listItem.innerHTML = `
                <h5>${getEmoji(item.type)} <span class="font-weight-bold">${item.id}</span> ${item.name}</h5>
                <div class="d-flex justify-content-between">
                    <p>${item.ingredients.join(', ')}</p>
                    <p class="text-right">${getPriceString(item.price)}</p>
                </div>`;
            if (item.vegetarian) {
                listItem.classList.add('bg-success', 'text-white');
            }
            menuList.appendChild(listItem);
        });
    }

    // Function to filter menu items based on selected item type and ingredients
    function filterMenuItems(filterValue) {
        if (filterValue === undefined) filterValue = 'all'; // Handle undefined filterValue
        fetch(jsonDataUrl)
            .then(response => response.json())
            .then(data => {
                let filteredItems = data.filter(item => {
                    const matchesType = filterValue === 'all' || item.type.toLowerCase() === filterValue.toLowerCase();
                    const matchesIngredients = selectedIngredients.length === 0 || selectedIngredients.every(ingredient => item.ingredients.map(i => i.toLowerCase()).some(i => i.includes(ingredient.toLowerCase())));
                    return matchesType && matchesIngredients;
                });
                displayMenuItems(filteredItems);
            })
            .catch(error => console.error('Error fetching JSON:', error));
    }

    // Event listener for the add ingredient button
    document.getElementById('add-ingredient-btn').addEventListener('click', function () {
        const ingredientInput = document.getElementById('ingredient-filter');
        const ingredient = ingredientInput.value.trim();
        if (ingredient) {
            selectedIngredients.push(ingredient);
            renderPillBox(ingredient);
            filterMenuItems(getActiveFilter()); // Filter menu items
            ingredientInput.value = ''; // Clear the input after adding ingredient
        }
    });

    // Event listener for the ingredient search input
    const ingredientInput = document.getElementById('ingredient-filter');
    ingredientInput.addEventListener('keypress', function (event) {
        if (event.key === 'Enter') {
            const ingredient = ingredientInput.value.trim();
            if (ingredient) {
                selectedIngredients.push(ingredient);
                renderPillBox(ingredient);
                filterMenuItems(getActiveFilter()); // Filter menu items
                ingredientInput.value = ''; // Clear the input after adding ingredient
            }
        }
    });

    // Function to render pillbox for selected ingredient
    function renderPillBox(ingredient) {
        const pillBoxContainer = document.getElementById('pillbox-container');
        const pillBox = document.createElement('div');
        pillBox.className = 'badge badge-pill badge-primary mr-2 mb-2';
        pillBox.textContent = ingredient;
        const removeIcon = document.createElement('span');
        removeIcon.className = 'ml-1';
        removeIcon.innerHTML = '&#10006;'; // X symbol
        removeIcon.style.cursor = 'pointer';
        removeIcon.addEventListener('click', function () {
            selectedIngredients = selectedIngredients.filter(item => item !== ingredient);
            pillBoxContainer.removeChild(pillBox);
            filterMenuItems(); // Update filter after removing ingredient
        });
        pillBox.appendChild(removeIcon);
        pillBoxContainer.appendChild(pillBox);
    }

    // Function to get emoji based on item type
    function getEmoji(type) {
        switch (type.toLowerCase()) {
            case 'pasta':
                return '🍝';
            case 'pizza':
                return '🍕';
            case 'salad':
                return '🥗';
            default:
                return '';
        }
    }

    // Function to get price string based on price object
    function getPriceString(price) {
        if (typeof price === 'object') {
            if (price.length === 2) {
                return `Klein: € ${price[0].toFixed(2)}, Groß: € ${price[1].toFixed(2)}`;
            } else if (price.length === 4) {
                const sizes = ['Klein', 'Mittel', 'Groß', 'Party'];
                return sizes.map((size, index) => `${size}: € ${price[index].toFixed(2)}`).join(', ');
            } else {
                return '';
            }
        } else {
            return '€ ' + price.toFixed(2);
        }
    }

    // Initial load: Display all menu items
    filterMenuItems();

    // Function to get the active filter value
    function getActiveFilter() {
        const activeButton = document.querySelector('.type-filter-btn.btn-primary');
        return activeButton ? activeButton.id.replace('-filter', '') : 'all';
    }
});
