const keys = [
  'Q','W','E','R','T','Y','U','I','O','P',
  'A','S','D','F','G','H','J','K','L',
  'Z','X','C','V','B','N','M'
]

export default function Keyboard() {
  return (
    <div className="keyboard">
      {keys.map(k => (
        <button
          key={k}
          onClick={() => window.keyboard.press(k)}
        >
          {k}
        </button>
      ))}

      <button onClick={() => window.keyboard.space()}>Space</button>
      <button onClick={() => window.keyboard.backspace()}>⌫</button>
      <button onClick={() => window.keyboard.enter()}>Enter</button>
    </div>
  )
}
