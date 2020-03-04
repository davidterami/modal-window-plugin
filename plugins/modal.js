const _createModalFooter = footerBtn => {
    let div = document.createElement("div");
    div.classList.add("modal-footer");

    for (let btnData of footerBtn) {
        let btn = document.createElement("button");
        btn.classList.add("btn", `btn-${btnData.type}`);
        btn.innerHTML = btnData.text;
        btn.onclick = btnData.handler;
        div.append(btn);
    }

    return div;
}

const _createModal = options => {
    const modal = document.createElement("div");
    modal.classList.add("vmodal");

    const DEFAULT_WIDTH = "400px";

    modal.insertAdjacentHTML("afterbegin", `
        <div class="modal-overlay" data-close="true">
            <div class="modal-window" style="width: ${options.width || DEFAULT_WIDTH}">
                <div class="modal-header">
                    <span class="modal-title">${options.title}</span>
                    ${options.unclosable ? "" : `<span class="modal-close" data-close="true">&times;</span>`}
                </div>

                <div class="modal-body" data-content>${options.content}</div>
            </div>
        </div>
    `);

    if (options.footerBtn) {
        let footer = _createModalFooter(options.footerBtn);
        modal.querySelector(".modal-window").append(footer);
    }

    document.body.prepend(modal);
    return modal;
}

$.modal = options => {
    const ANIMATION_SPEED = 200;
    const $modal = _createModal(options);
    let closing = false;
    let destroyed = false;
    
    let modal = {
        open() {
            if (destroyed) return console.log("Modal doesn't exist.");
            !closing && $modal.classList.add("open");
            if (typeof options.onOpen === "function") options.onOpen();
        },
        close() {
            typeof options.beforeClose === "function" ? closing = options.beforeClose() : closing = true;
            
            if (closing) {
                $modal.classList.remove("open");
                $modal.classList.add("hide");
                setTimeout(() => {
                    $modal.classList.remove("hide");
                    closing = false;
                    if (typeof options.onClose === "function") options.onClose();
                }, ANIMATION_SPEED);
            }
        },
        setContent(html) {
            $modal.querySelector("[data-content]").innerHTML = html;
        }
    }

    listenerClick = event => {
        if (event.target.dataset.close) modal.close();
    }

    $modal.addEventListener("click", listenerClick);

    listenerPress = event => {
        if ($modal.classList.contains("open")) {
            if (event.keyCode === 27) modal.close();
        }
    }

    document.addEventListener("keydown", listenerPress);

    return Object.assign(modal, {
        destroy() {
            $modal.remove();
            $modal.removeEventListener("click", listenerClick);
            $modal.removeEventListener("click", listenerPress);
            destroyed = true;
        }
    });
}