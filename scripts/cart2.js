let cartId = []
let carts = []


const addToCarts = (event, id, food, store) => {
    event.target.setAttribute('disabled', true);
    event.target.innerHTML = `Товар додано <img class="add_cart_image" height="15px" src="../images/checkmark-outline.svg" alt="">`;

    if(!cartId.includes(cartId)){
        carts.push({
            id: id,
            food: food,
            store: store,
        });

        cartId.push(id)

        localStorage.setItem('cart', carts)
        console.log(carts)
    }
}

let history = history;