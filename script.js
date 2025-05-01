const generateBtn = document.getElementById('generateBtn');
const questionsDiv = document.getElementById('questions');
// Replace with your OpenAI API Key in server .env

generateBtn.addEventListener('click', async () => {
  const topic = document.getElementById('topic').value.trim();
  const count = parseInt(document.getElementById('countSelect').value, 10) || 5;
  if (!topic) {
    alert('Please enter a topic');
    return;
  }
  questionsDiv.innerHTML = '<p>Loading questions...</p>';
  try {
    const questions = await generateQuestions(topic, count);
    displayQuestions(questions);
  } catch (error) {
    console.error(error);
    questionsDiv.innerHTML = '<p>Error generating questions. Check the console for details.</p>';
  }
});

async function generateQuestions(topic, count) {
  const response = await fetch('/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ topic, count })
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Server error');
  }
  if (!data.questions) {
    throw new Error('Invalid response format: questions missing');
  }
  return data.questions;
}

function displayQuestions(questions) {
  const selectedCount = parseInt(document.getElementById('countSelect').value, 10) || questions.length;
  questions = questions.slice(0, selectedCount);
  questionsDiv.innerHTML = '';
  const scoreEl = document.getElementById('score');
  scoreEl.textContent = '';
  let correctCount = 0;
  let answeredCount = 0;

  questions.forEach((q, idx) => {
    const questionDiv = document.createElement('div');
    questionDiv.classList.add('question');
    const h3 = document.createElement('h3');
    h3.textContent = `${idx + 1}. ${q.question}`;
    questionDiv.appendChild(h3);

    const ul = document.createElement('ul');
    q.options.forEach((opt) => {
      const li = document.createElement('li');
      const label = document.createElement('label');
      const input = document.createElement('input');
      input.type = 'radio';
      input.name = `q${idx}`;
      input.value = opt;
      label.appendChild(input);
      label.appendChild(document.createTextNode(opt));
      li.appendChild(label);
      ul.appendChild(li);
      li.addEventListener('click', () => input.click());

      input.addEventListener('change', () => {
        ul.querySelectorAll('li').forEach(item => item.classList.remove('selected'));
        li.classList.add('selected');

        if (input.value === q.answer) {
          feedbackP.textContent = 'Correct!';
          feedbackP.classList.add('correct');
          feedbackP.classList.remove('incorrect');
        } else {
          feedbackP.textContent = `Incorrect. Correct answer: ${q.answer}`;
          feedbackP.classList.add('incorrect');
          feedbackP.classList.remove('correct');
        }
        feedbackP.style.display = 'block';

        if (q.explanation) {
          explanationP.textContent = `Explanation: ${q.explanation}`;
        } else {
          explanationP.textContent = 'Explanation: Detailed explanation is unavailable.';
        }
        explanationP.style.display = 'block';

        answeredCount++;
        if (input.value === q.answer) {
          correctCount++;
        }
        if (answeredCount === questions.length) {
          scoreEl.textContent = `Score: ${correctCount} / ${questions.length}`;
        }
      });
    });
    questionDiv.appendChild(ul);

    const feedbackP = document.createElement('p');
    feedbackP.classList.add('feedback');
    feedbackP.style.display = 'none';
    questionDiv.appendChild(feedbackP);

    const explanationP = document.createElement('p');
    explanationP.classList.add('explanation');
    explanationP.style.display = 'none';
    questionDiv.appendChild(explanationP);

    questionsDiv.appendChild(questionDiv);
  });
}