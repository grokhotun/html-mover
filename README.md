## HTML-mover - небольшой скрипт для больших проектов
Предназначен для быстрого и удобного переноса HTML-разметки при адаптации сайтов. Позволят избежать повторения кода.

Пример использования:
1) Вариант 1
```html
<div data-html-mover="имя родителя, индекс в родителе начиная с 0, на каком разрешении"></div>
```
2) Вариант 2
```html
<div data-html-mover="имя родителя, индекс элемента перед которым нужно поставить элемент, на каком разрешении"></div>
```
Также вместо второго параметра можно передавать ключевые слова: last или first

```html
  <div class="wrapper">
    <div class="page__body">
      <div class="page__col page__col--first">
          <div data-html-mover="page__col--second, first, 1400" class="block aqua">1</div>
      </div>
      <div class="page__col page__col--second">
      </div>
    </div>
  </div>
```
