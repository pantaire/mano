document.addEventListener('DOMContentLoaded', function () {
    // URL for the JSON data
    const jsonDataUrl = 'https://raw.githubusercontent.com/pantaire/mano/main/mano.json';

    // Array to store selected ingredients for filtering
    let selectedIngredients = [];

    // Function to display menu items
    function displayMenuItems(items) {
        const menuList = document.getElementById('menu-list');
        menuList.innerHTML = ''; // Clear existing list
        items.forEach(function (item) {
            const listItem = document.createElement('li');
            listItem.className = 'list-group-item mb-2';

            const itemName = document.createElement('h5');
            itemName.innerHTML = getEmoji(item.type) + ' <span class="font-weight-bold">' + item.id + '</span> ' + item.name;
            listItem.appendChild(itemName);

            const priceAndIngredients = document.createElement('div');
            priceAndIngredients.className = 'd-flex justify-content-between';
            priceAndIngredients.innerHTML = '<p>' + item.ingredients.join(', ') + '</p><p class="text-right">Price: $' + item.price + '</p>';
            listItem.appendChild(priceAndIngredients);

            // Add green background to vegetarian meals
            if (item.vegetarian) {
                listItem.classList.add('bg-success', 'text-white');
            }

            menuList.appendChild(listItem);
        });
    }

    // Fetch JSON data and display menu items
    fetch(jsonDataUrl)
        .then(response => response.json())
        .then(data => displayMenuItems(data))
        .catch(error => console.error('Error fetching JSON:', error));

    // Filter menu items based on selected item type and ingredients
    function filterMenuItems() {
        const filterValue = document.getElementById('item-filter').value;
        const searchTerm = selectedIngredients.join(' ').toLowerCase();
        fetch(jsonDataUrl)
            .then(response => response.json())
            .then(data => {
                const filteredItems = data.filter(function (item) {
                    return (filterValue === 'all' || item.type.toLowerCase() === filterValue) &&
                        selectedIngredients.every(function (ingredient) {
                            return item.ingredients.some(function (itemIngredient) {
                                return itemIngredient.toLowerCase().includes(ingredient.toLowerCase());
                            });
                        });
                });
                displayMenuItems(filteredItems);
            })
            .catch(error => console.error('Error fetching JSON:', error));
    }

    // Event listener for the item filter change
    document.getElementById('item-filter').addEventListener('change', filterMenuItems);

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

    // Event listener for the add ingredient button
    document.getElementById('add-ingredient-btn').addEventListener('click', function () {
        const ingredientInput = document.getElementById('ingredient-filter');
        const ingredient = ingredientInput.value.trim();
        if (ingredient) {
            selectedIngredients.push(ingredient);
            renderPillBox(ingredient);
            filterMenuItems();
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
                filterMenuItems();
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
            selectedIngredients = selectedIngredients.filter(function (item) {
                return item !== ingredient;
            });
            filterMenuItems();
            pillBoxContainer.removeChild(pillBox);
        });
        pillBox.appendChild(removeIcon);
        pillBoxContainer.appendChild(pillBox);
    }
});
