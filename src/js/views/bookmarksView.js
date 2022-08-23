import View from './View.js';
import previewView from './previewView.js';
import icons from 'url:../../img/icons.svg';

class BookmarkView extends View {
  _parentEl = document.querySelector('.bookmarks__list');
  _errorMessage = 'No bookmarks yet. Find a nice recipe and bookmark it :)';
  _message = '';

  // Render bookmarks 1st time
  addHandlerRender(handler) {
    window.addEventListener('load', handler);
  }

  _generateMarkup() {
    console.log(this._data); // 'data' here = all of the bookmarks
    return this._data.map(bookmark => previewView.render(bookmark, false)).join('');

    // Tricky part: the markup returned by 'previewView.render(bookmark, false)' is inserted by the ORIGINAL render() method called on the bookmarksView in the controlAddBookmark() within controller.js

    // Since the 1st render() call has the default 2nd arg set to true (render = true), it will actually render/insert the markup to the DOM. When it is set to false (render = false), it only returns markup! Works like a switch for a different setting.
  }
}

export default new BookmarkView();
