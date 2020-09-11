"use strict";

/*
    Полифилы
*/
// Полифил на forEach
if (window.NodeList && !NodeList.prototype.forEach) {
  NodeList.prototype.forEach = function (callback, thisArg) {
    thisArg = thisArg || window;

    for (var i = 0; i < this.length; i++) {
      callback.call(thisArg, this[i], i, this);
    }
  };
}

;

var htmlMover = function htmlMover() {
  var movingElements = document.querySelectorAll('[data-html-mover]');
  var movingElementsPositions = [];
  var mediaQueries = [];

  function _debounce(func, delay) {
    var inDebounce;
    return function () {
      var context = this;
      var args = arguments;
      clearTimeout(inDebounce);
      inDebounce = setTimeout(function () {
        return func.apply(context, args);
      }, delay);
    };
  }

  ;

  function _getElementByIndex(parent, index) {
    var children = parent.children;

    if (children.length > 0) {
      return children[index];
    } else {
      return null;
    }
  }

  ;

  function _getElementByClass(parent, className) {
    return parent.querySelector(".".concat(className));
  }

  ;

  function _getIndexInParent(element) {
    var children = Array.prototype.slice.call(element.parentNode.children);
    return children.indexOf(element);
  }

  ;

  function _insertBefore(element, sibling) {
    sibling.before(element);
  }

  ;

  function _insertToEnd(element, parent) {
    parent.append(element);
  }

  ;

  function _smartInsert(element, parent, index) {
    var insertingBefore = _getElementByIndex(parent, index);

    if (insertingBefore) {
      _insertBefore(element, insertingBefore);
    } else {
      _insertToEnd(element, parent);
    }
  }

  ;

  function _sort(array) {
    array.sort(function (a, b) {
      if (a.breakpoint > b.breakpoint) {
        return -1;
      } else {
        return 1;
      }
    });
  }

  ;

  function createMediaquery() {
    if (movingElementsPositions.length > 0) {
      movingElementsPositions.forEach(function (element) {
        mediaQueries.push(window.matchMedia("(max-width: ".concat(element.breakpoint, "px")));
      });
    }
  }

  ;

  function move() {
    movingElementsPositions.forEach(function (element, index) {
      var htmlClass = "html-mover-".concat(element.breakpoint);

      if (mediaQueries[index].matches) {
        if (element.originalParent !== element.newParent) {
          if (!element.movingElement.classList.contains(htmlClass) && element.originalParent !== element.newParent) {
            switch (element.newPlace) {
              case 'first':
                _smartInsert(element.movingElement, element.newParent, 0);

                break;

              case 'last':
                _smartInsert(element.movingElement, element.newParent);

                break;

              default:
                {
                  if (parseInt(element.newPlace) >= 0) {
                    _smartInsert(element.movingElement, element.newParent, parseInt(element.newPlace));
                  } else {
                    var insertingBefore = _getElementByClass(element.newParent, element.newPlace);

                    if (insertingBefore) {
                      _insertBefore(element.movingElement, insertingBefore);
                    }
                  }

                  break;
                }
            }

            element.movingElement.classList.add(htmlClass);
          }
        } else {
          console.warn('HTML-mover: элемент', element.movingElement, 'имеет неверный селектор!');
        }
      } else {
        if (element.movingElement.classList.contains(htmlClass)) {
          _smartInsert(element.movingElement, element.originalParent, element.originalPlace);

          element.movingElement.classList.remove(htmlClass);
        }
      }
    });
  }

  ;

  function init() {
    if (movingElements.length > 0) {
      movingElements.forEach(function (element, index) {
        var attributeArray = element.getAttribute('data-html-mover').split(',');
        movingElementsPositions[index] = {
          movingElement: element,
          originalParent: element.parentNode,
          originalPlace: _getIndexInParent(element),
          newParent: document.querySelector(".".concat(attributeArray[0])) || element.parentNode,
          newPlace: attributeArray[1].trim() || 'last',
          breakpoint: parseInt(attributeArray[2].trim()) || 767
        };
      });

      _sort(movingElementsPositions);

      createMediaquery();
      move();
      window.addEventListener('resize', _debounce(move, 50));
    }
  }

  ;
  init();
};

document.addEventListener("DOMContentLoaded", function () {
  htmlMover();
});