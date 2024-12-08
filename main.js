const body = document.body;
let header = document.querySelector("header");
let questionArea = document.querySelector(".question");
let answers = document.querySelector(".answers");
let sub = document.querySelector(".sub");
let modalButton = document.querySelector(".modalB");
let CountElement = document.querySelector(".count-down");
let total = document.querySelector(".total");
const chosenLan = document.querySelectorAll(".chosenLan");
const languages = document.querySelector(".btn-group-lg");
const testContainer = document.querySelector(".test-container");
const modalTitle = document.querySelector(".modal-title");
const modalBody = document.querySelector(".modal-body");
let language;

let testDir, testName;
const center = "d-flex align-items-center justify-content-center container";
const cardsContainer = document.createElement("div");

(() => {
  // testContainer.style.display = "none";
  testContainer.remove();

  chosenLan.forEach((button) => {
    document.body.className = center;
    button.onclick = function () {
      language = button.id;
      console.log(language);
      TestsCards();
    };
  });
})();

function TestsCards() {
  let questionsFiles = {
    html: {
      path: "/json/html_questions.json",
      desc:
        language === "ar"
          ? `لغة ترميز هيكلية تُستخدم لإنشاء البنية الأساسية لصفحات الويب وتحديد محتواها، مثل النصوص والصور والروابط.`
          : `A structural markup language used to create the basic framework of web pages and define their content, like text, images, and links.`,
    },
    css: {
      path: "/json/css_questions.json",
      desc:
        language === "ar"
          ? `لغة تصميم تُستخدم لتنسيق صفحات الويب وتحسين مظهرها، بما في ذلك الألوان والخطوط والتخطيطات.`
          : `A styling language used to format web pages and enhance their appearance,
             including colors, fonts, and layouts.`,
    },
    javascript: {
      path: "/json/javascript_questions.json",
      desc:
        language === "ar"
          ? `لغة برمجة ديناميكية تُستخدم لإضافة التفاعلية والوظائف المتقدمة لصفحات الويب، مثل القوائم التفاعلية والنماذج.`
          : `A dynamic programming language used to add interactivity and advanced functionalities to web pages,
                  such as interactive menus and forms.`,
    },
    reactJS: {
      path: "/json/react_questions.json",
      desc:
        language === "ar"
          ? `مكتبة JavaScript تُستخدم لتطوير واجهات المستخدم التفاعلية والقابلة لإعادة الاستخدام، مع التركيز
             على أداء عالي وهيكلية مكونات واضحة.`
          : `
            A JavaScript library used to build interactive and reusable user interfaces,
            focusing on high performance and clear component architecture.`,
    },
  };
  body.className = "container";

  body.style.direction = `${language === "ar" ? "rtl" : "ltr"}`;

  languages.remove();
  cardsContainer.className = "row";
  cardsContainer.innerHTML = "";
  document.body.appendChild(cardsContainer);

  for (let key in questionsFiles) {
    const cardCol = document.createElement("div");
    cardCol.className = "mt-3 col-sm-6 mb-3 mb-sm-0";
    const card = document.createElement("div");
    card.className = "card";
    card.style.height = "100%";

    const cardBody = document.createElement("div");
    cardBody.className = "card-body";
    const title = document.createElement("h5");
    title.className = "card-title";
    title.innerHTML = key;
    const text = document.createElement("p");
    text.className = "card-text";
    text.innerHTML = questionsFiles[key].desc;
    const button = document.createElement("button");
    button.className = "btn btn-primary";
    button.type = "button";
    button.innerHTML = `${language === "ar" ? "اختبار" : ""} ${key} ${language === "en" ? "test" : ""}`;
    button.id = questionsFiles[key].path;
    button.onclick = function () {
      testDir = button.id;
      testName = key;
      console.log(testDir, testName);
      fetchData();
    };
    cardCol.appendChild(card);
    cardsContainer.appendChild(cardCol);
    card.appendChild(cardBody);
    cardBody.append(title, text, button);
  }
}

function fetchData() {
  // testContainer.style.display = "block";
  body.appendChild(testContainer);

  let countCorrectAnswers = 0;
  let index = 0;
  let questionsLength;
  cardsContainer.remove();
  document.querySelector(".category").innerHTML = testName;

  document.body.className = center;

  fetch(testDir)
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      let testData = language === "ar" ? data.ar : data.en;
      questionsLength = testData.length;
      // countDown(10, questionsLength);
      questionInfo();
      addQuestion(testData[index], questionsLength);
      sub.onclick = () => {
        let correctAnswer = testData[index].correct_answer;
        ++index;
        questionInfo();
        checkAnswer(correctAnswer, questionsLength);
        questionArea.innerHTML = "";
        answers.innerHTML = "";
        addQuestion(testData[index], questionsLength);
        // clearInterval(down);
        // countDown(10, questionsLength);
        results();
        questionInfo();
      };
    })
    .catch((err) => console.log(err));

  function addQuestion(data, length) {
    if (index < length) {
      let questionText = document.createTextNode(data.question);
      questionArea.appendChild(questionText);
      const orderArray = [1, 2, 3, 4];
      // orderArray.sort(() => Math.random() - 0.5);
      const shuffledOrder = orderArray.sort(() => Math.random() - 0.5);
      for (let i = 1; i <= 4; i++) {
        let answerContainer = document.createElement("div");
        answerContainer.className = `form-check ${language === "ar" ? "form-check-reverse" : ""}`;

        let radioInput = document.createElement("input");
        radioInput.type = "radio";
        radioInput.className = "form-check-input ";
        radioInput.id = `answer${i}`;
        radioInput.name = "question";
        radioInput.dataset.answer = data[`answer_${i}`];

        let label = document.createElement("label");
        label.className = "form-check-label";
        label.htmlFor = `answer${i}`;
        let labelText = document.createTextNode(data[`answer_${i}`]);
        label.appendChild(labelText);
        answerContainer.append(radioInput, label);
        answerContainer.style.order = shuffledOrder[i - 1];
        if (answerContainer.style.order === "1") {
          radioInput.checked = true;
        }
        answers.appendChild(answerContainer);
      }
    }
  }

  function questionInfo() {
    total.innerHTML = `${index + 1} ${language === "ar" ? "من" : "of"} ${questionsLength}`;
  }
  function checkAnswer(correctAnswer, count) {
    let answers = document.getElementsByName("question");
    let chosenAnswer;

    for (let i = 0; i < answers.length; i++) {
      if (answers[i].checked) {
        chosenAnswer = answers[i].dataset.answer;

        console.log(`right: ${correctAnswer}, checked: ${chosenAnswer}`);
      }
    }
    if (correctAnswer === chosenAnswer) {
      console.log("you are all right");
      countCorrectAnswers++;
    }
  }

  function results() {
    if (questionsLength === index) {
      console.log(countCorrectAnswers);
      modalTitle.innerHTML = `${countCorrectAnswers}/${questionsLength}`;
      let percentage = (countCorrectAnswers / questionsLength) * 100;
      console.log(percentage);
      if (percentage <= 60) {
        modalBody.innerHTML =
          language === "ar"
            ? "نتيجتك ضعيفة، تحتاج إلى بذل جهد أكبر لتتحسن."
            : "Your result is poor, you need to put in more effort to improve.";
      } else if (percentage >= 90) {
        modalBody.innerHTML =
          language === "ar" ? "نتيجتك ممتازة، استمر في هذا الاتجاه." : "Excellent result, keep it up.";
      } else {
        modalBody.innerHTML =
          language === "ar" ? "النتيجة جيدة، لكن هناك مجال للتحسين." : "Good result, but room for improvement.";
      }
      modalButton.click();
      testContainer.remove();
      TestsCards();
      index = 0;
      countCorrectAnswers = 0;
    }
  }
  // function countDown(duration, count) {
  //   if (index < count) {
  //     let seconds;
  //     down = setInterval(function () {
  //       seconds = parseInt(duration % 60);
  //       CountElement.innerHTML = `${seconds}`;
  //       if (--duration < 0) {
  //         clearInterval(down);
  //         sub.click();
  //       }
  //     }, 1000);
  //   }
  // }
}
