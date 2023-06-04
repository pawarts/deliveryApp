let cartIdArray = [];
let cart = [];

let minusButton, minusFoodFromCart;

const removeFromCart = (element) => {
    console.log(element)
    element.number--
}

const addToCart = (event) => {

    console.log(event)

    if(!event.target.classList.contains('added_to_cart')){
        event.target.innerHTML = `Товар додано <img class="add_cart_image" src="images/checkmark-outline.svg" alt="">`;
        event.target.classList.add('added_to_cart')
    }

    /*if(!cartIdArray.includes(id)){
        cart.push({
            id: id,
            food: food,
            store: store,
            number: 0
        })
        cartIdArray.push(id)
    } else {
        cart.forEach(element => {
            if(element.id === id){
                element.number++
                createElement(element)
            }
        })
    }*/

    console.log(cart)

    cart.forEach(element => {
        createElement(element)
    })
}

//Create element

const createNode = (tag, classList, attribute, nodeValue, parentNode) => {
    let createNode;

    createNode = document.createElement(tag);
    createNode.classList.add(classList);

    createNode.setAttribute(attribute.name, attribute.value);

    createNode.innerHTML = nodeValue;

    parentNode.appendChild(createNode);
}

let id_carted_food = []

const createElement = (element) => {

    if(!id_carted_food.includes(element.id)){
        const shopListItems = document.querySelector('.shop_list-items');



        createNode('li', 'shop_list-item', '', '',
        shopListItems);

        const shopListItem = document.querySelectorAll(".shop_list-item");


        createNode('div', 'food_text-wrapper', {name: 'data-id', value: element.id}, element.food, shopListItem[shopListItem.length - 1])

        createNode('button', 'minus', {name: 'data-id', value: element.id}, '-', shopListItem[shopListItem.length - 1])
        createNode('p', 'food_number', {name: 'data-id', value: element.id},
            element.number, shopListItem[shopListItem.length - 1])
        createNode('button', 'plus', {name: 'data-id', value: element.id}, '+', shopListItem[shopListItem.length - 1])

        minusFoodFromCart = document.querySelectorAll('.minus');

        minusFoodFromCart.forEach(item => {
            item.addEventListener('click', () => {
                if(item.dataset.id == element.id){
                    element.number--;
                    createElement(element);
                }
            });
        });

        let addFood = document.querySelectorAll('.plus');

        addFood.forEach(item => {
            item.addEventListener('click', () => {
                if(item.dataset.id == element.id){
                    element.number++;
                    createElement(element)
                }
            });
        });


        id_carted_food.push(element.id)
    } else {
        let createdElement = document.querySelectorAll('.food_number')
        createdElement.forEach(item => {
            if(item.dataset.id == element.id){
                item.innerHTML = element.number;
            }
        })
    }
}