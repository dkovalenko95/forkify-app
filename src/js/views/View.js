import icons from 'url:../../img/icons.svg';

export default class View {
  _data;

  render(data) {
    // Wrong query err:
    if (!data || (Array.isArray(data) && data.length === 0)) return this.renderError(); 

    this._data = data;
    const markup = this._generateMarkup();
    this._clear();
    this._parentEl.insertAdjacentHTML('afterbegin', markup)
  }

  // DOM update (not ideal algorithm for big real world apps, but works here and suits for not very complicated apps like this)
  update(data) {
    // Wrong query err:
    if (!data || (Array.isArray(data) && data.length === 0)) return this.renderError(); 

    this._data = data;
    const newMarkup = this._generateMarkup();

    // Convert newMarkup str to a DOM obj that's living in the memory and that we can then use to compare with the actual DOM that's on the page. -> 
    // Generate new 'virtual DOM' with changes
    const newDOM = document.createRange().createContextualFragment(newMarkup);
    const newElements = Array.from(newDOM.querySelectorAll('*'));

    // Current actual DOM
    const curElements = Array.from(this._parentEl.querySelectorAll('*'));
    // console.log(curElements, newElements);

    newElements.forEach((newEl, i) => {
      const curEl = curElements[i];
      // console.log(curEl, newEl.isEqualNode(curEl));

      // Updates changed text(!) in DOM
      if (!newEl.isEqualNode(curEl) && newEl.firstChild?.nodeValue.trim() !== '') {
        // console.log('🌐', newEl.firstChild.nodeValue.trim());
        // console.log('🌐 first child:', typeof newEl.firstChild);
        // console.log('🌐 node value:', typeof newEl.firstChild.nodeValue);
        curEl.textContent = newEl.textContent;
      }

      // Update changed attts -> replace all attrs in cur el by attrs coming from new el
      if (!newEl.isEqualNode(curEl)) {
        console.log(newEl.attributes);
        console.log(Array.from(newEl.attributes));
        Array.from(newEl.attributes).forEach(attr => curEl.setAttribute(attr.name, attr.value));
      }
    });
  }

  _clear() {
    this._parentEl.innerHTML = '';
  }

  renderSpinner() {
    const markupSpinner = ` 
      <div class="spinner">
        <svg>
          <use href="${icons}#icon-loader"></use>
        </svg>
      </div> 
    `;
  
    this._clear();
    this._parentEl.insertAdjacentHTML('afterbegin', markupSpinner);
  }

  renderError(message = this._errorMessage) {
    const markupError = `
      <div class="error">
        <div>
          <svg>
            <use href="${icons}#icon-alert-triangle"></use>
          </svg>
        </div>
        <p>${message}</p>
    </div>
    `;

    this._clear();
    this._parentEl.insertAdjacentHTML('afterbegin', markupError);
  }

  renderMessage(message = this._message) {
    const markupError = `
      <div class="message">
        <div>
          <svg>
            <use href="${icons}#icon-smile"></use>
          </svg>
        </div>
        <p>${message}</p>
    </div>
    `;

    this._clear();
    this._parentEl.insertAdjacentHTML('afterbegin', markupError);
  }
};
