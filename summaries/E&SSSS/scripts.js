 ScrollReveal().reveal('.pages',{
    delay: 100,
    reset: true,
    easing: 'ease-in-out',
    duration: 700,
    opacity: 0
  });

var srPages = document.querySelectorAll('.pages');
for (var i = 0; i < srPages.length; i++) {
  (function(index) {
    window.addEventListener('beforeprint', function() {
      srPages[index].style.opacity = '1';
    });
  })(i);
}

var laws = document.querySelectorAll('.formulas.laws:not(.inline)');
var inlineLaws = document.querySelectorAll('.formulas.laws.inline');

function typesetFormulas() {
  for (var i = 0; i < laws.length; i++) {
    var law = laws[i].innerHTML;
let size = laws[i].getAttribute("data-size");
if(size == null){
    laws[i].innerHTML = `<img style="display: block; width:140px; margin:auto; text-align: center;" src="https://latex.codecogs.com/svg.image?${law}">`;
  }
else{
laws[i].innerHTML = `<img style="display: block; width:${size}; margin:auto; text-align: center;" src="https://latex.codecogs.com/svg.image?${law}">`;
}
}

for (var i = 0; i < inlineLaws.length; i++) {
    var inlineLaw = inlineLaws[i].innerHTML;
    let size = inlineLaws[i].getAttribute("data-size");
if(size == null){
    inlineLaws[i].innerHTML = `<img style="display: inline-block; width:140px; margin:auto; text-align: center;" src="https://latex.codecogs.com/svg.image?${inlineLaw}">`;
  }
else{
inlineLaws[i].innerHTML = `<img style="display: inline-block; width:${size}; margin:auto; text-align: center;" src="https://latex.codecogs.com/svg.image?${inlineLaw}">`;
}
  }
}

setTimeout(typesetFormulas, 100);

const pageDivs = document.querySelectorAll('.page');

pageDivs.forEach((pageDiv, index) => {
  if (!pageDiv.classList.contains('no-page-number')) {
    const numberElement = document.createElement('p');
    numberElement.classList.add('page-number');
    const pageNumber = index;
    const easternArabicNumber = pageNumber.toLocaleString('ar-SA');
    numberElement.textContent = easternArabicNumber;
    pageDiv.appendChild(numberElement);
  }
});

function getPageNumberInEasternArabic(pageNumber) {
  const skippedDivs = document.querySelectorAll('.no-page-number').length;
  const adjustedPageNumber = pageNumber - skippedDivs;
  const tensDigit = Math.floor(adjustedPageNumber / 10);
  const onesDigit = adjustedPageNumber % 10;
  let easternArabicNumber = '';
  if (tensDigit > 0) {
    easternArabicNumber += easternArabicNumerals[tensDigit];
  }
  easternArabicNumber += easternArabicNumerals[onesDigit];
  return easternArabicNumber;
}