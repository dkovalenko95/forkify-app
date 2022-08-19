import View from './View.js';
import previewView from './previewView.js';
import icons from 'url:../../img/icons.svg';

class ResultsView extends View {
  _parentEl = document.querySelector('.results');
  _errorMessage = 'No recipes found for your query! Try again :)';
  _message = '';

  _generateMarkup() {
    console.log(this._data); // 'data' here = all of the results
    return this._data.map(result => previewView.render(result, false)).join('');
  }
}

export default new ResultsView();
