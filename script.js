const menu = document.getElementById('menu');
const cartBtn = document.getElementById('cart-btn');
const cartModal = document.getElementById('cart-modal');
const cartItemsContainer = document.getElementById('cart-items');
const cartTotal = document.getElementById('cart-total');
const checkoutBtn = document.getElementById('checkout-btn');
const closeModalBtn = document.getElementById('close-modal-btn');
const cartCounter = document.getElementById('cart-count');
const addressInput = document.getElementById('address');
const addressWarn = document.getElementById('address-warn');

let cart = [];

cartBtn.addEventListener('click', () => {
    cartModal.style.display = "flex";
    updateCartModal()
})

cartModal.addEventListener('click', (event) => {
    if(event.target === cartModal || event.target === closeModalBtn) {
        cartModal.style.display = "none"
    }
})

menu.addEventListener('click', (event) => {
    // se foi clicado no elemento com a classe '.add-to-cart-btn', ou em algum 'filho' desse elemento que contem essa classe, se não foi clicado em nenhum desse retorna null
    let parentButton = event.target.closest(".add-to-cart-btn");
    if(parentButton) {
        const name = parentButton.getAttribute("data-name");
        const price = parseFloat(parentButton.getAttribute("data-price"));
        addToCart(name, price);
    }
})


function addToCart(name, price) {
    // Vai procurar se o nome do produto já existe no carrinho
    const existingItem = cart.find(item => item.name === name)

    // se existir..
    if(existingItem) {
        // adiciona mais 1 em quantidade dele, e retorna nada, para parar a execução da função
        existingItem.quantity += 1;
    } else {
        // se não existir envia para o carrinho
        cart.push({
            name,
            price,
            quantity: 1,
        });
    }

    updateCartModal()
}

function updateCartModal() {
    cartItemsContainer.innerHTML = "";
    let total = 0;

    cart.forEach(item => {
        const cartItemElement = document.createElement('div');

        cartItemElement.innerHTML = `
        <div class="flex items-center justify-between py-2 px-1 border-b-2 border-black bg-gray-100">
            <div>
                <p class="font-medium text-xl">${item.name}</p>
                <p>Quantidade: ${item.quantity}</p>
                <p class="font-bold" mt-2>Preço: R$${item.price.toFixed(2)}</p>
            </div>
            <button class="px-2 py-1 bg-red-500 text-white font-medium rounded-xl remove-from-cart-btn" data-name="${item.name}">
                Remover
            </button>
        </div>
        `

        total += item.price * item.quantity

        cartItemsContainer.appendChild(cartItemElement)
    })

    // esse toLocaleString o js já formata para a moeda especificada
    cartTotal.textContent = total.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });

    cartCounter.innerText = cart.length;
    
}

cartItemsContainer.addEventListener('click', (e) => {
    if(e.target.classList.contains("remove-from-cart-btn")) {
        const name = e.target.getAttribute("data-name");
        deleteItemToCart(name);
    }
})

function deleteItemToCart(name) {
    const indexItem = cart.findIndex(item => item.name === name);

    if(indexItem !== -1) {
        const item = cart[indexItem]
        
        if(item.quantity > 1) {
            item.quantity -= 1;
            updateCartModal();
            return;
        } 

        cart.splice(indexItem, 1);
        updateCartModal();
    }
}


addressInput.addEventListener('input', (event) => {
    let inputValue = event.target.value
    console.log(inputValue)

    if(inputValue !== "") {
        addressInput.classList.remove("border-red-500");
        addressWarn.classList.add("hidden");
    }
})

checkoutBtn.addEventListener('click', () => {
    const isOpem = checkRestaurantOpen();
    if(!isOpem) {
        Toastify({
            text: "O restaurant está Fechado",
            duration: 3000,
            close: true,
            gravity: "top", // `top` or `bottom`
            position: "left", // `left`, `center` or `right`
            stopOnFocus: true, // Prevents dismissing of toast on hover
            style: {
              background: "#ef4444",
            },
        }).showToast();

        return;
    }

    if(cart.length === 0) return;
    if(addressInput.value === "") {
        addressWarn.classList.remove("hidden");
        addressInput.classList.add("border-red-500");
        return;
    }

    //Enviar o pedido para o whatssap web
    const cartItems = cart.map((item) => {
        return (
            `${item.name} quantidade: (${item.quantity}) Preço: R$${item.price}`
        )
    }).join("");

    const message = encodeURIComponent(cartItems);
    // Numero de telefone real do com zap, no caso este é ficticio
    const phone = "12123456789";

    window.open(`https://wa.me/${phone}?text=${message} Endereço: ${addressInput.value}`, "_blank");

    cart.length = 0;
    updateCartModal();
})

function checkRestaurantOpen() {
    const data = new Date();
    const hora = data.getHours();
    return hora >= 18 && hora < 22;
}

const spanItem = document.getElementById('date-span');
const isOpen = checkRestaurantOpen();

if(isOpen) {
    spanItem.classList.remove("bg-red-500");
    spanItem.classList.add("bg-green-600");
} else {
    spanItem.classList.remove("bg-green-600");
    spanItem.classList.add("bg-red-500")
}