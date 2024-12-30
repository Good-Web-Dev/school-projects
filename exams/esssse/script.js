let questions = []; // Initialize an empty array for questions

const app = document.getElementById("app");
const endExamBtn = document.getElementById("end-exam-btn");

let userAnswers = JSON.parse(localStorage.getItem("userAnswers")) || {};
let resultPage = localStorage.getItem("resultPage") || false;

fetch(jsonDatabase)
  .then((response) => {
    if (!response.ok) {
      throw new Error(`Failed to load questions. HTTP status: ${response.status}`);
    }
    return response.json();
  })
  .then((data) => {
    questions = data; // Assign the fetched data to the questions array

    if (resultPage) {
      const answeredQuestions = Object.keys(userAnswers).length;
      calculateResult(answeredQuestions);
    } else {
      renderQuestions();
      convertLatinToArabic(); // Call the conversion function after rendering
    }
  })
  .catch((error) => {
    console.error("Error fetching questions:", error);
    app.innerHTML = `<h2 style="color:darkred; margin-bottom: -5px;">تعذر تحميل الأسئلة! يرجى المحاولة لاحقًا.</h2>`;
  });

function renderQuestions() {
  app.innerHTML = "";
  endExamBtn.classList.remove("hidden");
  questions.forEach((q, index) => {
    const questionDiv = document.createElement("div");
    questionDiv.className = "question";
const cancelAnswer = document.createElement("span");
cancelAnswer.classList.add("cancel-answer");
cancelAnswer.innerHTML = `<i class="fas fa fa-trash"></i> محو الإجابة`;
    const questionNumber = index + 1;
    const questionTitle = document.createElement("h3");
    questionTitle.innerHTML = `<p class="question-number">${questionNumber.toLocaleString('ar-SA')}</p><span class="chapter-title">${q.chapter}</span> ${q.question}`;
    questionDiv.appendChild(questionTitle);
questionDiv.appendChild(cancelAnswer);

    const optionsDiv = document.createElement("div");
    optionsDiv.className = "options";

    q.options.forEach((option, i) => {
  option += "."; // Append the period to the option text
  const label = document.createElement("label");

  // Construct the label's inner HTML with the input and option text
  label.innerHTML = `
    <input type="radio" name="question-${index}" value="${i}" ${
    userAnswers[index] !== undefined && userAnswers[index] === i ? "checked" : ""
  }>
    ${option}
  `;

  // Add an event listener manually for the input
  const input = label.querySelector("input");
  input.addEventListener("change", () => {
    userAnswers[index] = i;
    localStorage.setItem("userAnswers", JSON.stringify(userAnswers));
  });

  optionsDiv.appendChild(label); // Append the label to the options container
});

    questionDiv.appendChild(optionsDiv);
    app.appendChild(questionDiv);

cancelAnswer.addEventListener("click", function() {
  delete userAnswers[index]; // Correctly removes the answer
  localStorage.setItem("userAnswers", JSON.stringify(userAnswers));
  renderQuestions();
  convertLatinToArabic();
});
convertLatinToArabic();
});
let laws = document.querySelectorAll('.formulas.laws:not(.inline)');
let inlineLaws = document.querySelectorAll('.formulas.laws.inline');
typesetFormulas(laws, inlineLaws);
}

function renderResultPage(correctAnswers, totalAnsweredQuestions) {
  const percentage = (correctAnswers / totalAnsweredQuestions) * 100;

  app.innerHTML = `<div class="result-card"><h2>نتيجة الاختبار</h2>
 <div class="resultSymbol"><div class="rst">${correctAnswers > 0 ? `${correctAnswers.toLocaleString("ar-SA")}` : `<span style="padding-bottom:1px; display:inline-block;">صفر</span>`}</div> <div class="rsb">${totalAnsweredQuestions.toLocaleString("ar-SA")}</div></div>
<p style="font-weight:500; text-align: center;">
النسبة =
${percentage !== 0 ? percentage.toFixed(0).toLocaleString("ar-SA") + "٪" : "صفر٪"}
<br>
النتيجة = عدد الأسئلة المُجَاوَب عليها بشكل صحيح 
<b style="margin-top:7px; display: inline-block;">على</b> عدد الأسئلة المُجَاوَب عليها.
</p><div style="display:grid; grid-template-columns: 1fr 1fr; gap: 20px;">
    ${totalAnsweredQuestions < questions.length ? `<button id="complete-exam-btn"><i class="fas fa fa-play"></i> &nbsp;إكمال الاختبار</button>` : ""}<button id="retry-exam-btn"><i class="fas fa fa-undo"></i> إعادة الاختبار</button></div></div>
`;

  questions.forEach((q, index) => {
    const questionDiv = document.createElement("div");
    questionDiv.className = "question";

    const questionTitle = document.createElement("h3");
    const questionNumber = index + 1;
    questionTitle.innerHTML = `<p class="question-number">${questionNumber.toLocaleString('ar-SA')}</p><span class="chapter-title">${q.chapter}</span> ${q.question}`;
    questionDiv.appendChild(questionTitle);

    const optionsDiv = document.createElement("div");
    optionsDiv.className = "options";

    let questionResult = 0;

    q.options.forEach((option, i) => {
option += ".";
      const label = document.createElement("label");
      label.innerHTML = option;

      if (userAnswers[index] !== undefined) {
        if (userAnswers[index] === i) {
          if (userAnswers[index] === q.correct) {
            label.classList.add("correct-s");
label.innerHTML += `<i class="material-icons">check</i>`;
            questionResult = 1;
          } else {
            label.classList.add("wrong-s");
label.innerHTML += `<i class="material-icons">close</i>`;
          }
        }
        if (i === q.correct && userAnswers[index] !== i) {
          label.classList.add("correct");
label.innerHTML += `<i class="material-icons">check</i>`;
        }
      }

      optionsDiv.appendChild(label);
    });

    questionDiv.appendChild(optionsDiv);
    app.appendChild(questionDiv);
  });

  endExamBtn.classList.add("hidden");
  localStorage.setItem("resultPage", "true");

  if (totalAnsweredQuestions < questions.length) {
    document.getElementById("complete-exam-btn").addEventListener("click", () => {
      localStorage.removeItem("resultPage");
      renderQuestions();
    });
  }

  document.getElementById("retry-exam-btn").addEventListener("click", () => {
    userAnswers = {};
    localStorage.removeItem("userAnswers");
    localStorage.removeItem("resultPage");
    renderQuestions();
convertLatinToArabic();
  });
}

function calculateResult(totalAnsweredQuestions) {
  let correctAnswers = 0;
  for (let i = 0; i < questions.length; i++) {
    if (userAnswers[i] === questions[i].correct) {
      correctAnswers++;
    }
  }
  renderResultPage(correctAnswers, totalAnsweredQuestions);
convertLatinToArabic();
let laws = document.querySelectorAll('.formulas.laws:not(.inline)');
let inlineLaws = document.querySelectorAll('.formulas.laws.inline');
typesetFormulas(laws, inlineLaws);
}

endExamBtn.addEventListener("click", () => {
  const answeredQuestions = Object.keys(userAnswers).length;
  if (answeredQuestions === 0) {
    sAlert();
  } else {
    calculateResult(answeredQuestions);
  }
});

function sAlert() {
  const swal = Swal.mixin({
    customClass: {
      closeButton: "closeButton",
      confirmButton: "okBtn",
    },
    buttonsStyling: false
  });
  swal.fire({
    confirmButtonText: "حسنٌ",
    title: "تنبيه!",
    html: `<p dir="rtl" style="font-weight:500; margin:-10px auto; padding:10px;">لا يمكنك إنهاء الاختبار قبل أن تحل على الأقل سؤالًا واحدًا!</p>`,
    iconHtml: "<i class='fa fas fa-exclamation-triangle warning-icon'></i>",
    showCloseButton: true,
  });
}
function convertLatinToArabic() {
    const latinToArabicMap = {
        '0': '٠',
        '1': '١',
        '2': '٢',
        '3': '٣',
        '4': '٤',
        '5': '٥',
        '6': '٦',
        '7': '٧',
        '8': '٨',
        '9': '٩'
    };

    // Function to recursively convert text nodes, skipping elements with class "laws"
function replaceTextNodes(node) {
    if (node.nodeType === Node.TEXT_NODE) {
        //Only replace if the parent node doesn't have the class 'laws'
        let parentHasLawsClass = false;
        let currentNode = node.parentNode;
        while (currentNode) {
            if (currentNode.classList && currentNode.classList.contains('laws') || currentNode.classList && currentNode.classList.contains('exam-title') || currentNode.classList && currentNode.classList.contains('latin-num')) {
                parentHasLawsClass = true;
                break;
            }
            currentNode = currentNode.parentNode;
        }
        if (!parentHasLawsClass) {
            node.nodeValue = node.nodeValue.replace(/[0-9]/g, (match) => latinToArabicMap[match]);
        }
    } else if (node.childNodes) {
        node.childNodes.forEach(replaceTextNodes);
    }
}

// Start the replacement from the body
replaceTextNodes(document.body);
}

function typesetFormulas(laws, inlineLaws) {
  for (var i = 0; i < laws.length; i++) {
    var law = laws[i].innerHTML;
let style = laws[i].getAttribute("data-style");
if(style == null){
    laws[i].innerHTML = `<img style="display: block; width:4rem; margin:auto; text-align: center;" src="https://latex.codecogs.com/svg.image?{\\color{DarkBlue} \\boldsymbol{${law}}}">`;
  }
else{
laws[i].innerHTML = `<img style="display: block; margin:auto; text-align: center; ${style}" src="https://latex.codecogs.com/svg.image?{\\color{DarkBlue} \\boldsymbol{${law}}}">`;
}
}

for (var i = 0; i < inlineLaws.length; i++) {
    var inlineLaw = inlineLaws[i].innerHTML;
    let style = inlineLaws[i].getAttribute("data-style");
if(style == null){
    inlineLaws[i].innerHTML = `<img style="display: inline-block; width:4rem; margin:auto; text-align: center;" src="https://latex.codecogs.com/svg.image?{\\color{DarkBlue} \\boldsymbol{${inlineLaw}}}">`;
  }
else{
inlineLaws[i].innerHTML = `<img style="display: inline-block; margin:auto; text-align: center; ${style}" src="https://latex.codecogs.com/svg.image?{\\color{DarkBlue} \\boldsymbol{${inlineLaw}}}">`;
}
  }
}