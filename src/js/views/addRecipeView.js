import View from './View.js';
import icons from 'url:../../img/icons.svg';

class AddRecipeView extends View {
  _parentEl = document.querySelector('.upload');

  _window = document.querySelector('.add-recipe-window');
  _overlay = document.querySelector('.overlay');
  _btnOpen = document.querySelector('.nav__btn--add-recipe');
  _btnClose = document.querySelector('.btn--close-modal');

  constructor() {
    super();
    this._addHandlerShowModal();
    this._addHandlerHideModal();
  }

  _toggleModal() {
    this._overlay.classList.toggle('hidden');
    this._window.classList.toggle('hidden');
  }

  _escHideModal(e) {
    if (e.key === 'Escape' && !this._window.classList.contains('hidden')) {
      this._toggleModal();
    }
  }

  _addHandlerShowModal() {
    this._btnOpen.addEventListener('click', this._toggleModal.bind(this)); // 'this' points to current obj
  }

  _addHandlerHideModal() {
    this._btnClose.addEventListener('click', this._toggleModal.bind(this));
    this._overlay.addEventListener('click', this._toggleModal.bind(this));
    document.addEventListener('keydown', this._escHideModal.bind(this))
  }

  addHandlerUpload(handler) {
    this._parentEl.addEventListener('submit', function (e) {
      e.preventDefault();
      // FormData API + ...spread(data into arr)
      const dataArr = [...new FormData(this)];
      console.log(dataArr);

      // Convert entries to an object
      const data = Object.fromEntries(dataArr);
      console.log(data);
      
      handler(data);

    });
  }

  _generateMarkup() {
    
  }
};

export default new AddRecipeView();
