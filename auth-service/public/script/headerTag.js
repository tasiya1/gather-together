class HeaderElement extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `<div class="header">
        <div class="logo">
            <h2>GatherTogether</h2>
            <img src="https://static.vecteezy.com/system/resources/thumbnails/010/159/990/small_2x/people-icon-sign-symbol-design-free-png.png" alt="" width="40px">
        </div>
        <div class="header-content">
            <div class="header-button" onclick="window.location.href='/'">
                Home
            </div>
            <div class="header-button" onclick="window.location.href='/rooms/my'">
                My rooms
            </div>
        </div>

    </div>`;
    }
}
customElements.define('gt-header', HeaderElement);