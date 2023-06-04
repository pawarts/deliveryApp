const shop_cart_list = document.querySelectorAll(".shop_list");
shop_cart_list[1].style.display = 'none';

const Button = (toggled) => {
    switch(toggled){
        case 'shop':
            shop_cart_list[1].style.display = 'none';
            shop_cart_list[0].style.display = 'block';
            break;
        case 'cart':
            shop_cart_list[0].style.display = 'none';
            shop_cart_list[1].style.display = 'block';
            break;
        default:
            console.log("Error")
    }
}