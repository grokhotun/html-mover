!!include('./partials/polyfills.js');

const htmlMover = () => {
    
    const movingElements = document.querySelectorAll('[data-html-mover]');
    const movingElementsPositions = [];
    const mediaQueries = [];

    function _debounce(func, delay) {
        let inDebounce;
        return function () {
            const context = this;
            const args = arguments;
            clearTimeout(inDebounce);
            inDebounce = setTimeout(() => func.apply(context, args), delay);
        }
    };

    function _getElementByIndex(parent, index) {
        const children = parent.children;
        if (children.length > 0) {
            return children[index];
        } else {
            return null;
        }
    };

    function _getElementByClass(parent, className) {
        return parent.querySelector(`.${className}`);
    };

    function _getIndexInParent(element) {
        const children = Array.prototype.slice.call(element.parentNode.children);
        return children.indexOf(element);
    };

    function _insertBefore(element, sibling) {
        sibling.before(element);
    };

    function _insertToEnd(element, parent) {
        parent.append(element);
    };

    function _smartInsert(element, parent, index) {
        const insertingBefore = _getElementByIndex(parent, index);
        if (insertingBefore) {
            _insertBefore(element, insertingBefore);
        } else {
            _insertToEnd(element, parent);
        }
    };

    function _sort(array) {
        array.sort((a, b) => {
            if (a.breakpoint > b.breakpoint) {
                return -1
            } else {
                return 1
            }
        });
    };

    function createMediaquery() {
        if (movingElementsPositions.length > 0) {
            movingElementsPositions.forEach((element) => {
                mediaQueries.push(window.matchMedia(`(max-width: ${element.breakpoint}px`));
            });
        }
    };

    function move() {
        movingElementsPositions.forEach((element, index) => {
            const htmlClass = `html-mover-${element.breakpoint}`;
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

                            default: {
                                if (parseInt(element.newPlace) >= 0) {
                                    _smartInsert(element.movingElement, element.newParent, parseInt(element.newPlace));
                                } else {
                                    const insertingBefore = _getElementByClass(element.newParent, element.newPlace);
                                    if (insertingBefore) {
                                        _insertBefore(element.movingElement, insertingBefore)
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
    };

    function init() {
        if (movingElements.length > 0) {
            movingElements.forEach((element, index) => {
                const attributeArray = element.getAttribute('data-html-mover').split(',');
                movingElementsPositions[index] = {
                    movingElement: element,
                    originalParent: element.parentNode,
                    originalPlace: _getIndexInParent(element),
                    newParent: document.querySelector(`.${attributeArray[0]}`) || element.parentNode,
                    newPlace: attributeArray[1].trim() || 'last',
                    breakpoint: parseInt(attributeArray[2].trim()) || 767
                };
            });
            _sort(movingElementsPositions);
            createMediaquery();
            move();
            window.addEventListener('resize', _debounce(move, 50));
        }
    };

    init();
}

document.addEventListener("DOMContentLoaded", () => {
    htmlMover();
});