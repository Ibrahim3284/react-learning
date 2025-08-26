import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import React from 'react'

const reactElement = {
  type: 'a',
  props: {
      href: "https://google.com",
      target: '_blank'
  },
  children: 'Click me to visit google'
}

function MyApp() {
  return (
    <div>
      <h1>Custom react app</h1>
    </div>
  )
}

const AnotherElement = (
  <a href="http://google.com" target='_blank'>Visit google</a>
)

const areactElement = React.createElement(
  'a',
  {href: 'https://google.com', target: "_blank"},
  'Click to visit google'
)

createRoot(document.getElementById('root')).render(
  areactElement
  // areactElement
  // <App />
)
