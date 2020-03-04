let currentId;

let priceModal = $.modal({
    title: "Card price",
    footerBtn: [
        {text: "Close", type: "primary", handler() {
            priceModal.close();
        }}
    ]
});

let confirmDeleteModal = $.modal({
    title: "Confirm deleting",
    footerBtn: [
        {text: "Yes", type: "primary", handler() {
            confirmDeleteModal.close();
            goods.splice(currentId, 1);
            document.querySelector(".row").remove();
            drawGoods();
        }},
        {text: "Cancel", type: "danger", handler() {
            confirmDeleteModal.close();
        }}
    ]
});

let goods = [
    {title: "Avocado", price: 3, url: "https://cdn3.iconfinder.com/data/icons/fruits-8/512/avocado-512.png"},
    {title: "Grapes", price: 2, url: "https://cdn0.iconfinder.com/data/icons/fruits-29/300/fruit_grapes-512.png"},
    {title: "Plum", price: 1, url: "https://cdn3.iconfinder.com/data/icons/fruits-8/512/plum-512.png"}
];

const drawGoods = () => {
    if (goods.length !== 0) {
        let row = document.createElement("div");
        row.classList.add("row");
    
        for (let card of goods) {
            row.innerHTML += `
                <div class="col mt-3">
                    <div class="card">
                        <img src=${card.url} class="card-img-top" alt=${card.title}>
    
                        <div class="card-body">
                            <h5 class="card-title">${card.title}</h5>
    
                            <button class="btn btn-primary" data-type="price" data-id=${goods.indexOf(card)}>Check price</button>
                            <button class="btn btn-danger" data-type="delete" data-id=${goods.indexOf(card)}>Delete</button>
                        </div>
                    </div>
                </div>
            `;
        }
    
        document.querySelector(".container").append(row);

        document.addEventListener("click", event => {
            if (event.target.dataset.type === "price" || event.target.dataset.type === "delete") {
                let el = goods[event.target.dataset.id];

                event.target.dataset.type === "price" ? (
                    priceModal.setContent(`<p>${el.title}: <b>${el.price}$</b> per kg</p>`),
                    priceModal.open()
                 ) : (
                    currentId = event.target.dataset.id,
                    confirmDeleteModal.setContent(`<p>Are you sure to delete the card with <b>${el.title}</b>?</p>`),
                    confirmDeleteModal.open()
                );
            }
        });
    } else {
        priceModal.destroy()
        confirmDeleteModal.destroy()
    }
}

drawGoods();