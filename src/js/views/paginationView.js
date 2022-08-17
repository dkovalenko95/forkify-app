import View from './View.js';
import icons from 'url:../../img/icons.svg';

class PaginationView extends View {
  _parentEl = document.querySelector('.pagination');

  addHandlerClick(handler) {
    // Event delegation:
    this._parentEl.addEventListener('click', function(e) {
      const btn = e.target.closest('.btn--inline');
      
      if (!btn) return;
      
      // To Establish pages navigation need to create a connection between the DOM and code -> using the data attrs
      const goToPage = +btn.dataset.goto;

      handler(goToPage);
    });
  }

  _generateMarkupBtn(type, curPage) {
    return `
      <button data-goto="${type === 'next' ? curPage + 1 : curPage - 1}" class="btn--inline pagination__btn--${type}">
        ${type === 'next' ? `<span>Page ${curPage + 1}</span>` : ''}
        <svg class="search__icon">
          <use href="${icons}#icon-arrow-${type === 'next' ? 'right' : 'left'}"></use>
        </svg>
        ${type === 'prev' ? `<span>Page ${curPage - 1}</span>` : ''}
      </button>
    `;
  }

  _generateMarkup() {
    const curPage = this._data.page;
    
    const numPages = Math.ceil(this._data.results.length / this._data.resultsPerPage);

    // Page 1, and there are other pages
    if (curPage === 1 && numPages > 1) return this._generateMarkupBtn('next', curPage);
    
    // Last page
    if (curPage === numPages && numPages > 1) return this._generateMarkupBtn('prev', curPage);
    
    // Other page
    if (curPage < numPages) return `${this._generateMarkupBtn('next', curPage)}${this._generateMarkupBtn('prev', curPage)}`;
    
    // Page 1, and there are NO other pages
    return '';
  }
}

export default new PaginationView();



// Another pagination solution with variables btns:
// const prevBtn = `
// <button class="btn--inline pagination__btn--prev">
//     <svg class="search__icon">
//         <use href="${icons}#icon-arrow-left"></use>
//         </svg>
//     <span>Page ${curPage - 1}</span>
// </button>
// `;
// const nextBtn = `
// <button class="btn--inline pagination__btn--next">
//     <span>Page ${curPage + 1}</span>
//     <svg class="search__icon">
//         <use href="${icons}#icon-arrow-right"></use>
//     </svg>
// </button>
// `;
