
document.addEventListener("DOMContentLoaded", function () {
    class AnteDialog extends HTMLElement {
        constructor() {
            super();
            this.isOpen = false; // 记录弹窗是否打开
        }

        connectedCallback() {
            this.dialog = this.querySelector('.ante-dialog-box');
            this.content = this.querySelector('.ante-dialog-content');

            this.addEventListener("click", (e) => {
                if (e.target === this) {
                    this.closeDialog();
                }
            });
        }

        openDialog(video) {
            if (this.content.contains(this.content.firstChild)) {
                this.content.removeChild(this.content.firstChild);
            }

            this.content.appendChild(video)

            if (this.content.firstChild.querySelector("video") && this.content.firstChild.querySelector("video").tagName === "VIDEO") {
                this.content.firstChild.querySelector("video").currentTime = 0;
                this.content.firstChild.querySelector("video").play()
            }
            // 显示弹窗
            this.style.display = "flex";
            this.isOpen = true;
            document.body.style.overflow = 'hidden';
        }

        closeDialog() {
            this.content.innerHTML = "";
            this.style.display = "none";
            this.isOpen = false;
            document.body.style.overflow = '';
        }
    }
    // 定义自定义元素 ante-dialog
    if (!window.customElements.get("ante-dialog")) {
        window.customElements.define("ante-dialog", AnteDialog);
    }

    class AnteDialogTemplate extends HTMLElement {
        connectedCallback() {
            this.openTempDialog()
        }
        openTempDialog() {
            const dialog = document.querySelector('ante-dialog')
            const temp = this.querySelector(".dialogTemp").content
            const clone = document.importNode(temp.querySelector(".tmp-box"), true);
            this.querySelector(".ante-open-dialog").addEventListener("click", function () {
                dialog.openDialog(clone)
            })
        }

    }
    // 定义自定义元素 ante-dialog
    if (!window.customElements.get("ante-dialog-template")) {
        window.customElements.define("ante-dialog-template", AnteDialogTemplate);
    }

    class AnteReview extends HTMLElement {
        connectedCallback() {
            this.AnteSwiper()
        }
        AnteSwiper() {
            const swiper = this.querySelector(".swiper")
            const row = this.dataset.row
            new Swiper(swiper, {
                loop: true,
                slidesPerView: row,
                spaceBetween: 20,
                breakpoints: {
                    1200: {
                        slidesPerView: row,
                        spaceBetween: 20,
                    },
                    1024: {
                        slidesPerView: 3,
                        spaceBetween: 15,
                    },
                    300: {
                        slidesPerView: 2,
                        spaceBetween: 10,
                    },
                },
                pagination: {
                    el: '.swiper-pagination',  // 分页容器
                    clickable: true,  // 使分页点击有效
                },
                navigation: {
                    nextEl: '.swiper-button-next',  // 下一页按钮
                    prevEl: '.swiper-button-prev',  // 上一页按钮
                },
            })
        }

    }
    if (!window.customElements.get("ante-review")) {
        window.customElements.define("ante-review", AnteReview);
    }

    class ANTEFAQ extends HTMLElement {
        connectedCallback() {
            this.AnteFaq()
        }
        AnteFaq() {
            const box = this.querySelector(".accordion")
            const arr = box.querySelectorAll(".accordion__item")
            arr.forEach(el => {
                el.querySelector("button").addEventListener("click", function (e) {
                    if (!el.classList.contains("is-active") && e.target.getAttribute("aria-expanded") != "true") {
                        arr.forEach(li => {
                            const btn = li.querySelector("button")
                            const content = li.querySelector(".accordion__content")
                            btn.setAttribute("aria-expanded", false)
                            li.classList.remove("is-active")
                            content.style.height = content.scrollHeight + "px";
                            content.offsetHeight;
                            content.style.height = "0";
                        })
                    }
                })
            })
        }
    }
    if (!window.customElements.get("ante-faq")) {
        window.customElements.define("ante-faq", ANTEFAQ);
    }

    class QUICKMODEL extends HTMLElement {
        connectedCallback() {
            this.OpenDialog();
        }

        OpenDialog() {
            const dialog = document.getElementById("quick-model-dialog");
            const closeBtn = dialog.querySelector(".quick-model-close");
            const product_id = this.dataset.productId
            const body = document.querySelector("body")

            // 打开弹窗
            this.querySelector(".quick-btn").addEventListener("click", () => {
                this.fetchProductData(product_id)
                setTimeout(() => {
                    dialog.classList.add("show");
                    body.style.overflow = "hidden"
                    
                },1000)
            });

            // 关闭弹窗
            closeBtn.addEventListener("click", () => {
                dialog.classList.remove("show");
                body.style.overflow = "auto"
                const box = document.querySelector("#quick-model-dialog .quick-model-content .quick-model-body")
                box.innerHTML = "";
            });

            // 点击遮罩关闭
            dialog.addEventListener("click", (e) => {
                if (e.target === dialog) {
                    dialog.classList.remove("show");
                    body.style.overflow = "auto"
                    const box = document.querySelector("#quick-model-dialog .quick-model-content .quick-model-body")
                    box.innerHTML = "";
                }
            });
        }
        async fetchProductData(handle) {
            const res = await fetch(`/products/${handle}`)
            const html = await res.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, "text/html");
            const box = document.querySelector("#quick-model-dialog .quick-model-content .quick-model-body")
            const content = doc.querySelector("#MainContent").children[2];
            const sectionId = doc.querySelector("#MainContent").children[2].querySelector("section").dataset.sectionId
            const scripts = doc.querySelectorAll("script");
            if (window.themeCore.Product != undefined) {
                const a = window.themeCore.Product
                a.init(sectionId)
                const lazyImage = window.themeCore.LazyLoadImages
                lazyImage.init()
                setTimeout(() => {
                    lazyImage.init()
                }, 100)
            }
            if (content) {
                doc.querySelectorAll("script").forEach(script => {
                    if ((script.type && script.type !== "text/javascript" && script.type !== "") || (script.src && script.src.includes("shopify-perf-kit"))) {
                        return; // 跳过 JSON、模板或 PerfKit 脚本
                    }
                    script.remove()
                });

                box.appendChild(content.cloneNode(true));
            }
            scripts.forEach(script => {
                if ((script.type && script.type !== "text/javascript" && script.type !== "") || (script.src && script.src.includes("shopify-perf-kit"))) {
                    return; // 跳过 JSON、模板或 PerfKit 脚本
                }
                const newScript = document.createElement("script");
                if (script.src) {
                    newScript.src = script.src;
                    newScript.async = false;
                    box.appendChild(newScript);
                }
            });
        }
    }

    if (!window.customElements.get("quick-model")) {
        window.customElements.define("quick-model", QUICKMODEL);
    }


})