document.addEventListener('DOMContentLoaded', function () {
    // URL for the JSON data
    const jsonDataUrl = 'https://raw.githubusercontent.com/pantaire/mano/main/mano.json';

    // Array to store selected ingredients for filtering
    let selectedIngredients = [];

    // Function to display menu items as list group
    function displayMenuItems(items) {
        const menuList = document.getElementById('menu-list');
        menuList.innerHTML = ''; // Clear existing list
        items.forEach(function (item) {
            const listItem = document.createElement('li');
            listItem.className = 'list-group-item';

            const itemName = document.createElement('h5');
            itemName.innerHTML = getEmoji(item.type) + ' <span class="font-weight-bold">' + item.id + '</span> ' + item.name;
            listItem.appendChild(itemName);

            const priceAndIngredients = document.createElement('div');
            priceAndIngredients.className = 'd-flex justify-content-between';
            priceAndIngredients.innerHTML = '<p>' + item.ingredients.join(', ') + '</p><p class="text-right">' + getPriceString(item.price) + '</p>';
            listItem.appendChild(priceAndIngredients);

            // Add green background to vegetarian meals
            if (item.vegetarian) {
                listItem.classList.add('bg-success', 'text-white');
            }

            menuList.appendChild(listItem);
        });
    }

    // Function to filter menu items based on selected item type and ingredients
    function filterMenuItems(filterValue) {
        fetch(jsonDataUrl)
            .then(response => response.json())
            .then(data => {
                let filteredItems = data.filter(item => {
                    if (filterValue === 'all') {
                        return true;
                    } else {
                        return item.type.toLowerCase() === filterValue.toLowerCase();
                    }
                });
                displayMenuItems(filteredItems);
            })
            .catch(error => console.error('Error fetching JSON:', error));
    }

    // Fetch JSON data and display all menu items initially
    filterMenuItems('all');

    // Event listeners for filter buttons
    document.getElementById('all-filter').addEventListener('click', function () {
        filterMenuItems('all');
    });
    document.getElementById('pizza-filter').addEventListener('click', function () {
        filterMenuItems('pizza');
    });
    document.getElementById('pasta-filter').addEventListener('click', function () {
        filterMenuItems('pasta');
    });
    document.getElementById('salad-filter').addEventListener('click', function () {
        filterMenuItems('salad');
    });

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
            // filterMenuItems(); // Uncomment this line if you want to apply ingredient filter immediately
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
                // filterMenuItems(); // Uncomment this line if you want to apply ingredient filter immediately
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
            // filterMenuItems(); // Uncomment this line if you want to apply ingredient filter immediately
            pillBoxContainer.removeChild(pillBox);
        });
        pillBox.appendChild(removeIcon);
        pillBoxContainer.appendChild(pillBox);
    }

    // Function to get price string based on price object
    function getPriceString(price) {
        console.log(price.length)
        if (typeof price === 'object') {
            if (price.length === 2) {
                return 'Klein: €' + price[0].toFixed(2) + ', Groß: €' + price[1].toFixed(2);
            } else if (price.length === 4) {
                return 'Klein: €' + price[0].toFixed(2) + ', Mittel: €' + price[1].toFixed(2) + ', Groß: €' + price[2].toFixed(2) + ', Party: €' + price[3].toFixed(2);
            } else {
                return ''; // Invalid price object format
            }
        } else {
            return '€' + price.toFixed(2);
        }
    }

});
