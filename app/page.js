'use client';

import { useMemo, useState } from 'react';

const wordPool = ['apple', 'bridge', 'puzzle', 'coffee', 'garden', 'laptop', 'planet'];
const triviaSet = [
  {
    q: 'Which planet is known as the Red Planet?',
    choices: ['Mars', 'Jupiter', 'Venus', 'Saturn'],
    a: 'Mars',
  },
  {
    q: 'How many days are there in a leap year?',
    choices: ['364', '365', '366', '367'],
    a: '366',
  },
  {
    q: 'What is the largest ocean on Earth?',
    choices: ['Atlantic', 'Indian', 'Arctic', 'Pacific'],
    a: 'Pacific',
  },
];

const initialRiddle = [
  {
    clue: 'I have keys but no locks. I have space but no rooms. You can enter, but not go outside. What am I?',
    answer: 'keyboard',
  },
  {
    clue: 'What has hands but cannot clap?',
    answer: 'clock',
  },
  {
    clue: 'What comes once in a minute, twice in a moment, but never in a thousand years?',
    answer: 'm',
  },
];

function Sidebar({ active, setActive }) {
  const tabs = ['Word Guess', 'Trivia Sprint', 'Riddle Relay'];
  return (
    <aside className="sidebar">
      <h1>Teams Fun Hub</h1>
      <p>Office entertainment zone</p>
      <nav>
        {tabs.map((tab) => (
          <button key={tab} onClick={() => setActive(tab)} className={active === tab ? 'active' : ''}>
            {tab}
          </button>
        ))}
      </nav>
    </aside>
  );
}

function WordGuess() {
  const [secret, setSecret] = useState(() => wordPool[Math.floor(Math.random() * wordPool.length)]);
  const [guess, setGuess] = useState('');
  const [history, setHistory] = useState([]);

  const masked = useMemo(() => {
    const guessedLetters = new Set(history.join('').split(''));
    return secret
      .split('')
      .map((letter) => (guessedLetters.has(letter) ? letter : '_'))
      .join(' ');
  }, [secret, history]);

  const solved = masked.replaceAll(' ', '') === secret;

  const submitGuess = (e) => {
    e.preventDefault();
    const letter = guess.toLowerCase().trim();
    if (!letter || letter.length !== 1) return;
    if (!history.includes(letter)) {
      setHistory((prev) => [...prev, letter]);
    }
    setGuess('');
  };

  const reset = () => {
    setSecret(wordPool[Math.floor(Math.random() * wordPool.length)]);
    setHistory([]);
    setGuess('');
  };

  return (
    <section className="game-card">
      <h2>Word Guess</h2>
      <p>Guess one letter at a time to reveal the hidden office-friendly word.</p>
      <div className="display">{masked}</div>
      <form onSubmit={submitGuess} className="row">
        <input
          maxLength={1}
          value={guess}
          onChange={(e) => setGuess(e.target.value)}
          placeholder="Type a letter"
          aria-label="Word guess input"
        />
        <button type="submit">Guess</button>
      </form>
      <p>Used letters: {history.length ? history.join(', ') : 'none yet'}</p>
      {solved && <p className="success">Great! You solved it: {secret}</p>}
      <button onClick={reset} className="secondary">New Word</button>
    </section>
  );
}

function TriviaSprint() {
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const current = triviaSet[index];

  const answer = (choice) => {
    if (finished) return;
    if (choice === current.a) setScore((s) => s + 1);
    const next = index + 1;
    if (next >= triviaSet.length) {
      setFinished(true);
    } else {
      setIndex(next);
    }
  };

  const reset = () => {
    setIndex(0);
    setScore(0);
    setFinished(false);
  };

  return (
    <section className="game-card">
      <h2>Trivia Sprint</h2>
      <p>Quick general-knowledge challenge for office break time.</p>
      {!finished ? (
        <>
          <p className="question">{current.q}</p>
          <div className="choice-grid">
            {current.choices.map((choice) => (
              <button key={choice} onClick={() => answer(choice)}>
                {choice}
              </button>
            ))}
          </div>
          <p>Question {index + 1} of {triviaSet.length}</p>
        </>
      ) : (
        <>
          <p className="success">Round finished! Score: {score}/{triviaSet.length}</p>
          <button onClick={reset}>Play Again</button>
        </>
      )}
    </section>
  );
}

function RiddleRelay() {
  const [index, setIndex] = useState(0);
  const [input, setInput] = useState('');
  const [feedback, setFeedback] = useState('');
  const [done, setDone] = useState(false);

  const current = initialRiddle[index];

  const submit = (e) => {
    e.preventDefault();
    if (done) return;
    const clean = input.toLowerCase().trim();
    if (clean === current.answer) {
      if (index === initialRiddle.length - 1) {
        setDone(true);
        setFeedback('Excellent! You solved all riddles.');
      } else {
        setIndex((i) => i + 1);
        setFeedback('Correct! Next riddle loaded.');
      }
    } else {
      setFeedback('Not quite, try another answer.');
    }
    setInput('');
  };

  const reset = () => {
    setIndex(0);
    setInput('');
    setFeedback('');
    setDone(false);
  };

  return (
    <section className="game-card">
      <h2>Riddle Relay</h2>
      <p>Solve riddles one by one with your teammates.</p>
      {!done && <p className="question">{current.clue}</p>}
      <form onSubmit={submit} className="row">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Your answer"
          aria-label="Riddle answer input"
        />
        <button type="submit">Submit</button>
      </form>
      {feedback && <p className={feedback.startsWith('Excellent') || feedback.startsWith('Correct') ? 'success' : 'error'}>{feedback}</p>}
      <button onClick={reset} className="secondary">Reset Relay</button>
    </section>
  );
}

export default function Home() {
  const [active, setActive] = useState('Word Guess');

  return (
    <main className="shell">
      <header className="topbar">
        <div className="brand">Microsoft Teams (Mock)</div>
        <input placeholder="Search games" readOnly />
        <div className="user">Office Fun</div>
      </header>

      <div className="workspace">
        <Sidebar active={active} setActive={setActive} />
        <section className="content">
          <h3>Entertainment Channel • Text Games</h3>
          <p className="subtle">A Teams-inspired mini app for light office engagement.</p>
          {active === 'Word Guess' && <WordGuess />}
          {active === 'Trivia Sprint' && <TriviaSprint />}
          {active === 'Riddle Relay' && <RiddleRelay />}
        </section>
      </div>
    </main>
  );
}
