import { createContext, useCallback, useContext, useEffect, useId, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { DeskFolio } from './lib/DeskFolio.tsx'
import { DialSlider } from './lib/DialSlider.tsx'
import { haptic } from './lib/haptics.ts'
import { DF_SCRIBBLES } from './lib/dfScribble.ts'
import './lib/deskfolio.css'

function Editable({ className = '', placeholder, initial }: { className?: string; placeholder?: string; initial?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current
    if (el && initial && !el.textContent) el.textContent = initial
  }, [initial])
  return (
    <div
      ref={ref}
      className={`df-edit ${className}`.trim()}
      contentEditable
      suppressContentEditableWarning
      role="textbox"
      aria-multiline="true"
      aria-label={placeholder}
      data-ph={placeholder}
      spellCheck={false}
    />
  )
}

// project name that links to its page, with a real hand-drawn marker scribble underline.
// On hover a fat "pen" traces the scribble's centerline (stroke-dashoffset) inside a mask,
// uncovering the exact marker shape as it bobs along the route — genuine self-drawing.
// `variant` selects which scribble pattern from the doodle sheet to use.
function DfProjName({ href, variant = 0, children }: { href: string; variant?: number; children: React.ReactNode }) {
  const sc = DF_SCRIBBLES[variant % DF_SCRIBBLES.length]
  const maskId = useId()
  return (
    <a className="df-proj-name" href={href}>
      {children}
      <svg className="df-proj-scribble" viewBox={sc.viewBox} preserveAspectRatio="none" aria-hidden="true">
        <mask id={maskId}>
          <path
            className="df-scribble-pen"
            d={sc.center}
            fill="none"
            stroke="#fff"
            strokeWidth={sc.strokeW}
            strokeLinecap="round"
            strokeLinejoin="round"
            pathLength={1}
          />
        </mask>
        <path d={sc.fill} fill="currentColor" mask={`url(#${maskId})`} />
      </svg>
    </a>
  )
}

// hand-drawn-ish doodles
function EditableNameTag({ className = '' }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current
    if (el && !el.textContent) el.textContent = 'Om'
  }, [])

  return (
    <div className={`df-name-tag ${className}`.trim()}>
      <img className="df-name-tag-img" src="/stickers/items/hello-name-tag.svg" alt="" draggable={false} decoding="async" />
      <div
        ref={ref}
        className="df-name-tag-text"
        contentEditable
        suppressContentEditableWarning
        role="textbox"
        aria-label="Name"
        data-ph="Om"
        spellCheck={false}
        onPointerDown={(e) => e.stopPropagation()}
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.stopPropagation()}
      />
    </div>
  )
}

const LbHeart = (p: React.SVGProps<SVGSVGElement>) => (
  // hand-drawn outline heart
  <svg viewBox="138 40 105 105" fill="currentColor" aria-hidden="true" {...p}>
    <path d="M156.278,88.438c0-0.319,0-0.853,0-1.426c-0.415-0.437-0.849-0.894-1.022-1.077 c-0.311-0.686-0.474-1.046-0.932-2.055c-0.121-0.649,0.161-2.027-0.024-3.339c-0.22-0.262-0.418-0.498-0.7-0.834 c0.198-0.335,0.398-0.676,0.71-1.206c0-1.254,0-2.737,0-4.222c0.219-0.256,0.42-0.492,0.66-0.772c0-0.363,0-0.783,0-1.112 c0.217-0.594,0.713-0.425,1.058-0.558c0.607-0.351-0.286-1.515,1.015-1.363c-0.37-0.416-0.578-0.649-0.837-0.94 c0.118-0.261,0.181-0.587,0.374-0.787c0.502-0.523,0.955-1.016,1.16-1.774c0.151-0.562,1.004-0.734,1.108-1.46 c0.135-0.938,1.11-1.22,1.572-1.91c0.913,0.126,1.247-0.669,1.766-1.141c0.71-0.646,1.364-1.354,2.052-2.025 c0.06-0.059,0.206-0.018,0.291-0.064c1.133-0.612,2.286-1.275,3.465-1.679c1.316-0.451,2.6-0.947,3.769-1.645 c0.349,0.299,0.584,0.5,0.864,0.74c0.791,0,1.639,0,2.487,0c0.244,0.223,0.475,0.435,0.721,0.66c0.405,0,0.83,0,1.385,0 c0.348,0.529,0.732,1.113,1.212,1.843c0.081,0.018,0.371,0.085,0.663,0.151c0.605,0.604,1.209,1.208,1.813,1.813 c0.302,0.302,0.858,0.602,0.861,0.907c0.008,1.108,1.281,1.364,1.419,2.313c0.12,0.822,1.177,1.041,1.238,1.715 c0.084,0.916,0.837,1.167,1.286,1.814c0,0.559,0,1.186,0,1.769c0.432,0.517,0.745,1.024,0.86,1.633 c0.778,0.17,0.114,1.302,0.992,1.436c0.758,0.078,1.277-0.604,1.331-1.063c0.09-0.772,0.995-1.117,0.811-1.928 c0.742-0.59,0.681-1.722,1.578-2.241c0.932-0.539,0.915-1.808,1.803-2.463c0.765-0.564,1.422-1.297,2.047-2.024 c1.097-1.275,2.99-1.548,3.606-3.106c0.561,0,0.882,0,1.202,0c0.877-0.111,1.008-1.246,2.026-1.346 c0.725-0.071,1.391-0.736,2.213-1.211c0.256,0,0.682,0,1.099,0c0.24-0.221,0.471-0.435,0.689-0.636c1.72,0,3.426,0,5.119,0 c0.389,0.389,0.767,0.767,1.217,1.217c0.2-0.156,0.41-0.32,0.649-0.508c0.16-0.023,0.361-0.063,0.563-0.077 c0.213-0.014,0.447-0.059,0.637,0.008c0.465,0.163,0.756,0.577,1.326,0.697c0.53,0.112,0.942,0.787,1.404,1.213 c0.212,0.01,0.421,0.02,0.629,0.029c1.588,1.588,3.174,3.174,4.769,4.769c0,0.201,0,0.412,0,0.922 c0.574,0.474,1.306,1.079,2.114,1.747c-0.264,0.451-0.463,0.793-0.773,1.322c0.238,0.119,0.6,0.301,0.962,0.482 c-0.067,0.079-0.134,0.158-0.201,0.237c0.505,0.06,1.009,0.12,1.527,0.182c0.469,0.674,0.126,1.436,0.227,2.148 c0.213,0.232,0.427,0.463,0.653,0.707c0,0.412,0,0.836,0,1.226c0.23,0.258,0.438,0.491,0.597,0.668c0,1.131,0,2.191,0,3.218 c-0.183,0.183-0.334,0.334-0.547,0.547c0,1.2,0,2.465,0,3.65c-0.489,0.652-1.073,1.167-1.3,1.809 c-0.23,0.648-0.706,1.151-0.773,1.954c-0.067,0.796-0.554,1.702-1.258,2.336c-0.397,0.356-0.892,0.691-1.099,1.146 c-0.209,0.459-0.294,0.942-0.698,1.323c-0.184,0.174-0.076,0.702-0.261,0.824c-0.928,0.606-1.023,1.769-1.783,2.492 c-0.813,0.774-1.639,1.511-2.106,2.644c-0.372,0.903-1.653,1.287-1.768,2.474c-0.008,0.082-0.142,0.152-0.218,0.227 c-0.755,0.755-1.437,1.609-2.287,2.237c-0.814,0.601-0.448,1.932-1.565,2.259c-0.213,0-0.425,0-0.723,0 c-0.119,0.349-0.245,0.72-0.371,1.09c-1.284,1.284-2.568,2.568-3.856,3.855c-0.699,0.2-1.36,0.467-1.779,1.144 c0,0.196,0,0.408,0,0.69c-0.807,0.789-1.617,1.639-2.491,2.42c-0.995,0.889-1.684,2.17-3.126,2.5 c-0.676,0.797-1.727,1.322-2.054,2.351c-0.349,1.099-1.603,1.422-1.923,2.408c-0.46,1.419-1.825,1.988-2.625,3.241 c0.057,0.16,0.078,0.545,0.277,0.697c0.348,0.266,1.115-0.025,1.043,0.768c-0.019,0.147,0.007,0.286-0.05,0.344 c-1.125,1.14-2.26,2.271-3.472,3.484c-0.644-0.635-1.291-1.271-1.926-1.897c-0.257,0.228-0.491,0.435-0.706,0.627 c-0.931,0.02-1.302-0.548-1.547-1.301c-0.238-0.734-0.618-1.337-1.645-1.261c-0.349-0.762-0.714-1.561-1.13-2.469 c-0.19-0.039-0.482-0.1-0.814-0.169c-0.268-0.268-0.57-0.57-0.882-0.882c0-0.2,0-0.411,0-0.711 c-0.649-0.627-1.341-1.291-2.028-1.959c-0.738-0.718-0.882-1.876-1.813-2.453c0.242-1.154-1.207-1.319-1.353-2.339 c-0.075-0.522-0.764-0.942-1.134-1.439c-0.861-1.157-2.444-1.729-2.723-3.356c-1.133-1.133-2.266-2.266-3.399-3.398 c-1.057-1.057-2.194-2.049-3.142-3.197c-0.572-0.693-0.89-1.586-1.606-2.213c-0.722-0.632-1.412-1.312-2.034-2.041 c-0.451-0.528-0.737-1.194-1.156-1.755c-0.434-0.581-1.163-1.041-1.356-1.678c-0.246-0.81-1.157-1.042-1.301-1.703 C158.495,91.586,157.013,90.509,156.278,88.438z M160.764,69.348c-0.931,0.225-1.237,0.961-1.453,1.773 c-0.372,0.129-0.744,0.259-1.144,0.398c0.258,0.284,0.466,0.514,0.671,0.74c0.256,0.639-0.407,0.868-0.572,1.292 c0.207,0.246,0.406,0.482,0.526,0.625c0,0.959,0,1.799,0,2.591c-0.199,0.199-0.35,0.35-0.553,0.553 c-0.029,0.662-0.06,1.381-0.088,2.011c-0.237,0.237-0.388,0.388-0.566,0.566c0.417,0.446,0.836,0.894,1.267,1.354 c0,1.052,0,2.117,0,3.181c0.81,1.667,1.726,3.251,3.175,4.46c0.054,0.045-0.017,0.216,0.023,0.306 c0.492,1.124,0.97,2.279,2.031,2.991c0.59,0.396,0.398,1.142,0.887,1.572c0.557,0.489,1.045,1.055,1.563,1.588 c0.035,1.251,1.489,1.534,1.784,2.458c0.388,1.221,1.396,1.784,2.099,2.659c0.703,0.876,1.843,1.399,2.063,2.676 c0.044,0.258,0.405,0.622,0.657,0.655c1.06,0.138,1.556,0.988,2.216,1.621c0.663,0.636,1.38,1.209,1.629,2.21 c0.139,0.561,1.001,0.73,1.102,1.462c0.11,0.805,0.875,1.144,1.363,1.669c0.797,0.859,1.659,1.658,2.476,2.465 c0,0.252,0,0.465,0,0.691c1.148,0.781,1.363,2.314,2.496,3.118c-0.257,0.828,0.962,1.123,0.695,1.977 c0.517,0.517,1.148,0.975,1.541,1.587c0.428,0.668,0.642,1.474,1.277,1.845c0.423-0.2,0.784-0.365,1.14-0.541 c0.178-0.088,0.505-0.225,0.494-0.294c-0.197-1.156,1.158-1.354,1.386-2.333c0.202-0.866,1.046-1.419,1.903-1.886 c1.349-0.735,2.783-2.416,3.816-4.004c0.281-0.433,0.709-0.768,1.027-1.181c0.364-0.474,0.309-1.167,0.9-1.559 c0.503-0.334,1.191-0.273,1.575-0.877c0.337-0.53,0.818-0.969,0.864-1.021c0.802-0.342,1.082-0.442,1.342-0.58 c0.178-0.094,0.313-0.278,0.495-0.353c0.27-0.111,0.565-0.162,0.832-0.233c0-0.514,0-0.94,0-1.374 c1.658-1.658,3.309-3.328,4.984-4.972c0.453-0.445,0.638-1.021,0.949-1.522c0.528-0.852,0.914-1.809,1.742-2.507 c1.138-0.961,2.134-2.09,2.996-2.951c0.439-0.951,0.692-1.718,1.12-2.37c0.556-0.847,1.693-1.275,1.792-2.465 c0.845-0.807,1.69-1.613,2.466-2.354c-0.263-1.891,1.587-2.977,1.314-4.631c0.446-0.447,0.824-0.824,1.214-1.215 c0-1.264,0-2.542,0-3.772c0.188-0.41,0.746-0.531,0.616-1.29c-0.118-0.155-0.361-0.471-0.628-0.819c0-0.604,0-1.237,0-1.816 c-0.239-0.279-0.441-0.514-0.625-0.729c0.111-0.911,1.12-1.598,0.524-2.608c-0.227-0.227-0.425-0.604-0.684-0.653 c-1.018-0.189-1.845-0.859-2.161-1.636c-0.678-1.667-2.178-2.464-3.137-3.724c-1.176,0.383-1.811-0.559-2.684-0.784 c-0.739-0.19-0.669-1.201-1.141-1.731c-0.536,0-1.07,0-1.604,0c-0.379-0.656-0.379-0.656-1.227-0.374 c0.238,0.684,0.816,0.257,1.227,0.374c-0.075,0.182-0.15,0.365-0.272,0.66c-1.097,0-2.245,0-3.273,0 c-0.264,0.264-0.439,0.563-0.562,0.543c-1.118-0.184-1.977,0.504-2.798,0.987c-0.62,0.365-1.179,0.289-1.769,0.394 c-1.435,1.435-2.912,2.83-4.282,4.324c-0.521,0.569-1.277,0.615-1.791,1.118c0,0.211,0,0.423,0,0.676 c-1.271,1.257-2.56,2.533-3.844,3.803c0.185,1.075-1.009,1.269-1.325,2.169c0,0.291,0,0.706,0,1.064 c-0.437,0.537-1.042,0.84-1.236,1.485c0,0.107-0.043,0.245,0.008,0.315c0.182,0.253,0.396,0.483,0.633,0.763 c0,1.332,0.008,2.717-0.009,4.102c-0.002,0.186-0.127,0.371-0.196,0.556c-0.512,0.211-1.024,0.423-1.523,0.629 c-0.175-0.175-0.326-0.326-0.496-0.496c-0.403,0-0.825,0-1.319,0c-0.309,0.327-0.627,0.807-1.289,0.597 c-0.277-0.277-0.579-0.579-0.908-0.908c0-2.527,0-5.083,0-7.484c-0.419-0.741-0.734-1.364-1.11-1.947 c-0.442-0.684,0.138-1.706-0.814-2.261c-0.182-0.106-0.026-0.793-0.026-1.174c-0.774-0.516-1.855-0.483-1.982-1.768 c-0.05-0.51-0.767-0.953-1.215-1.467c0-0.147,0-0.359,0-0.614c-1.571-1.561-3.159-3.142-4.755-4.715 c-0.06-0.06-0.191-0.048-0.289-0.069c-0.32,0-0.641,0-0.997,0c-0.213-0.19-0.446-0.398-0.704-0.628c-0.389,0-0.813,0-1.253,0 c-0.216,0.2-0.447,0.414-0.685,0.634c-0.419,0-0.844,0-0.908,0c-1.237,0.469-2.156,0.896-2.969,1.417 c-0.962,0.617-1.673,1.624-2.462,2.431c-0.495,0-0.92,0-1.048,0c-1.014,0.382-1.208,1.09-1.428,1.783 c-0.195,0.044-0.392,0.084-0.586,0.132C160.94,68.79,160.691,68.942,160.764,69.348z M157.88,81.523 c-0.46,0.429-0.46,0.856,0,1.285C158.34,82.38,158.34,81.952,157.88,81.523z M174.952,107.924 c0.006,0.135,0.012,0.271,0.017,0.406c0.285,0.038,0.57,0.091,0.856,0.102c0.07,0.003,0.219-0.156,0.205-0.204 c-0.044-0.151-0.14-0.4-0.229-0.405C175.522,107.807,175.236,107.883,174.952,107.924z M188.964,123.505 c-0.071-0.071-0.158-0.212-0.211-0.2c-0.151,0.034-0.288,0.129-0.43,0.2c0.071,0.071,0.158,0.212,0.211,0.2 C188.685,123.672,188.822,123.576,188.964,123.505z M160.215,88.988c0.086,0.086,0.157,0.157,0.228,0.228 c0.071-0.142,0.167-0.279,0.2-0.43c0.012-0.053-0.129-0.139-0.2-0.211C160.367,88.714,160.29,88.854,160.215,88.988z M211.304,99.243c-0.074-0.134-0.151-0.274-0.228-0.413c-0.071,0.071-0.212,0.158-0.2,0.211c0.034,0.151,0.129,0.288,0.2,0.43 C211.147,99.399,211.218,99.328,211.304,99.243z"/> <path d="M160.691,69.169c0.305,0.261,0.48,0.41,0.655,0.558 C160.786,70.162,160.833,69.666,160.691,69.169z"/> <path d="M160.215,71.042c0.074-0.134,0.151-0.274,0.228-0.413 c0.071,0.071,0.212,0.158,0.2,0.211c-0.034,0.151-0.129,0.288-0.2,0.43C160.372,71.199,160.301,71.128,160.215,71.042z"/>
  </svg>
)
const LbSparkle = (p: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...p}>
    <path d="M12 2c.9 5.6 3.5 8.2 9 9-5.5.8-8.1 3.4-9 9-.9-5.6-3.5-8.2-9-9 5.5-.8 8.1-3.4 9-9Z" />
  </svg>
)
const LbCloud = (p: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...p}>
    <path d="M7 18a4 4 0 0 1-.5-8A5.5 5.5 0 0 1 17.2 8.6 4 4 0 0 1 17 18H7Z" />
  </svg>
)
const LbCal = (p: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true" {...p}>
    <rect x="4" y="5" width="16" height="15" rx="3.5" />
    <path d="M4 10h16M9 3v3M15 3v3" />
  </svg>
)
const LbBell = (p: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...p}>
    <path d="M12 3a5 5 0 0 0-5 5c0 5-2 6-2 6h14s-2-1-2-6a5 5 0 0 0-5-5Zm0 18a2.5 2.5 0 0 0 2.4-2h-4.8A2.5 2.5 0 0 0 12 21Z" />
  </svg>
)

// mood faces, grin to sad
const MOOD_MOUTHS = [
  'M8 13 Q12 18.5 16 13', // grin
  'M8.5 14 Q12 16.6 15.5 14', // smile
  'M8.5 15 H15.5', // neutral
  'M8.5 15.6 Q12 14.2 15.5 15.6', // meh
  'M8.5 16 Q12 12.6 15.5 16', // sad
]
function MoodFaces() {
  const [mood, setMood] = useState(1)
  return (
    <div className="df-moods" role="group" aria-label="Today's mood">
      {MOOD_MOUTHS.map((mouth, i) => (
        <button
          key={i}
          type="button"
          className="df-mood"
          aria-pressed={mood === i}
          aria-label={`Mood ${i + 1} of 5`}
          onClick={() => setMood(i)}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
            <circle cx="9" cy="10.5" r="1.15" fill="currentColor" stroke="none" />
            <circle cx="15" cy="10.5" r="1.15" fill="currentColor" stroke="none" />
            <path d={mouth} />
          </svg>
        </button>
      ))}
    </div>
  )
}

/** checkable, editable list row */
function CheckItem({ initial, placeholder }: { initial?: string; placeholder?: string }) {
  const [done, setDone] = useState(false)
  return (
    <li className={done ? 'df-check is-done' : 'df-check'}>
      <button
        type="button"
        className="df-check-box"
        role="checkbox"
        aria-checked={done}
        aria-label={done ? 'Mark not done' : 'Mark done'}
        onClick={() => setDone((d) => !d)}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 13l4 4 10-11" />
        </svg>
      </button>
      <Editable placeholder={placeholder} initial={initial} />
    </li>
  )
}

type StickerItem = { src: string; width: string; rotate: number; pos: React.CSSProperties; lamp?: boolean; stuck?: boolean }
type StickerSet = { id: string; name: string; thumb: string; items: StickerItem[] }

// menu picks a set; items scatter into fixed slots
const SLOT = {
  TL: { top: '8%', left: '3%' },
  TR: { top: '7%', right: '4%' },
  LM: { top: '45%', left: '3%' },
  RM: { top: '42%', right: '3%' },
  BL: { bottom: '9%', left: '4%' },
  BR: { bottom: '10%', right: '3%' },
} as const
const ITM = '/stickers/items/'
const POLAROID_SRC = '__component:polaroid__'
const IPOD_SRC = '__component:ipod__'
const NAME_TAG_SRC = '__component:name-tag__'

const STICKER_SETS: StickerSet[] = [
  {
    // matcha break desk, two clusters
    id: 'journal',
    name: 'Journal',
    thumb: '/stickers/sticker-journal.svg',
    items: [
      // matcha break anchor (top-left)
      { src: ITM + 'sticker-matcha-cup.png', width: 'clamp(70px, 15vw, 196px)', rotate: -6, pos: { top: '7%', left: '3.5%' } }, // matcha latte
      // journaling cluster (bottom-left)
      { src: ITM + 'sticker-journal-1.svg', width: 'clamp(50px, 12vw, 165px)', rotate: -5, pos: SLOT.BL }, // lined notepad
      { src: ITM + 'sticker-journal-0.svg', width: 'clamp(13px, 3vw, 46px)', rotate: 40, pos: { bottom: '15%', left: '17%' } }, // pen
      { src: ITM + 'sticker-journal-3.svg', width: 'clamp(48px, 11.5vw, 156px)', rotate: -8, pos: { bottom: '34%', left: '4%' } }, // reading glasses
      // right side: greenery + cuties
      { src: ITM + 'sticker-plant-succulent.svg', width: 'clamp(40px, 9.5vw, 132px)', rotate: 4, pos: { top: '8%', right: '4.5%' } }, // succulent
      { src: ITM + 'sticker-cutie-tulip-heart.svg', width: 'clamp(40px, 9.5vw, 118px)', rotate: -10, pos: { top: '32%', right: '11%' } }, // tulip-heart
      { src: ITM + 'sticker-cutie-sleepy-kitty.svg', width: 'clamp(48px, 11.5vw, 138px)', rotate: 8, pos: { top: '52%', right: '6%' } }, // sleepy kitty
    ],
  },
  {
    id: 'workspace',
    name: 'Workspace',
    thumb: '/stickers/sticker-desk.svg',
    items: [
      { src: ITM + 'sticker-desk-9.svg', width: 'clamp(72px, 17.2vw, 246px)', rotate: -8, pos: { top: '7%', right: '4.3%' }, lamp: true }, // lamp
      { src: ITM + 'sticker-keyboard.svg', width: 'clamp(139px, 33vw, 560px)', rotate: 27, pos: { top: '-4.5vw', left: '-7vw' } }, // keyboard, peeking from top-left
      { src: ITM + 'sticker-stationery-3.svg', width: 'clamp(48px, 10.4vw, 155px)', rotate: -6, pos: { top: '40.5%', left: '16%' } }, // coffee
      { src: ITM + 'sticker-desk-0.svg', width: 'clamp(47px, 11.2vw, 158px)', rotate: 36, pos: { top: '54%', left: '7%' } }, // pencil
      { src: IPOD_SRC, width: 'clamp(82px, 8.1vw, 154px)', rotate: -14, pos: { top: '43%', right: '6.7%' } }, // iPod
      { src: ITM + 'sticker-cutie-bear.svg', width: 'clamp(62px, 9.6vw, 166px)', rotate: -4, pos: { top: '62%', right: '18.3%' }, stuck: true }, // bear sticker
      { src: ITM + 'sticker-journal-3.svg', width: 'clamp(76px, 11.8vw, 215px)', rotate: -8, pos: { bottom: '16%', left: '21.5%' } }, // glasses
      { src: ITM + 'sticker-plant-succulent.svg', width: 'clamp(64px, 12vw, 185px)', rotate: 3, pos: { bottom: '5.2%', right: '6.8%' } }, // succulent
    ],
  },
  {
    id: 'stationery',
    name: 'Stationery',
    thumb: '/stickers/sticker-stationery.svg',
    items: [
      { src: ITM + 'sticker-stationery-0.svg', width: 'clamp(50px, 12vw, 162px)', rotate: -6, pos: SLOT.TL }, // glasses
      { src: ITM + 'sticker-stationery-5.svg', width: 'clamp(59px, 14vw, 196px)', rotate: 8, pos: SLOT.TR }, // triangle ruler
      { src: ITM + 'sticker-stationery-9.svg', width: 'clamp(17px, 4vw, 58px)', rotate: -10, pos: SLOT.LM }, // pushpin
      { src: ITM + 'sticker-stationery-7.svg', width: 'clamp(40px, 9.5vw, 130px)', rotate: 20, pos: SLOT.RM }, // pencil
      { src: ITM + 'sticker-desk-6.svg', width: 'clamp(46px, 11vw, 150px)', rotate: -8, pos: SLOT.BL }, // lined note
      { src: ITM + 'sticker-stationery-3.svg', width: 'clamp(42px, 10vw, 135px)', rotate: -6, pos: SLOT.BR }, // coffee
      { src: ITM + 'sticker-plant-succulent.svg', width: 'clamp(36px, 8.5vw, 114px)', rotate: 8, pos: { top: '20%', right: '13%' } }, // potted succulent
    ],
  },
]

// pre-warm reveal images (workspace desk + monitor + avatar)
const DESKFOLIO_WARM_SRCS: string[] = [
  ...new Set(
    (STICKER_SETS.find((s) => s.id === 'workspace')?.items ?? [])
      .map((it) => it.src)
      .filter((src) => !src.startsWith('__component:')), // skip component placeholders
  ),
  '/stickers/devices/github-ipad.svg', // dev-activity iPad shell
  '/mort-profile.webp', // about-page avatar
]

// drop-in entrance (transform/opacity only)
function dropIn(rotate: number, i: number, reduce: boolean) {
  const tilt = rotate >= 0 ? 1 : -1
  // capped per-item stagger
  const step = Math.min(i, 6) * 0.06
  return {
    initial: reduce ? false : { opacity: 0, scale: 0.84, rotate: rotate * 0.45 - tilt * 5, y: -28 },
    animate: reduce ? { opacity: 1 } : { opacity: 1, scale: 1, rotate, y: 0 },
    exit: reduce
      ? { opacity: 0 }
      : { opacity: 0, scale: 0.86, rotate, y: -16, transition: { duration: 0.18, ease: 'easeIn' as const } },
    transition: reduce
      ? { duration: 0 }
      : {
          default: { type: 'spring' as const, bounce: 0.42, duration: 0.62, delay: step },
          opacity: { duration: 0.32, delay: step, ease: 'easeOut' as const },
        },
  }
}

// pressed-on entrance for flat peel-stickers
function pressOn(rotate: number, i: number, reduce: boolean) {
  // matches dropIn's capped stagger
  const step = Math.min(i, 6) * 0.05
  return {
    initial: reduce ? false : { opacity: 0, scale: 1.12, rotate },
    animate: reduce ? { opacity: 1 } : { opacity: 1, scale: 1, rotate },
    exit: reduce
      ? { opacity: 0 }
      : { opacity: 0, scale: 0.96, rotate, transition: { duration: 0.16, ease: 'easeIn' as const } },
    transition: reduce
      ? { duration: 0 }
      : {
          default: { type: 'spring' as const, bounce: 0, duration: 0.4, delay: step },
          opacity: { duration: 0.24, delay: step, ease: 'easeOut' as const },
        },
  }
}

type StickerDragState = {
  pointerId: number
  startX: number
  startY: number
  armed: boolean
  held?: boolean // menu opened, drag not started yet
  stage?: HTMLElement
  offsetX?: number
  offsetY?: number
  width?: number
  height?: number
}

const LONG_PRESS_MS = 420
const LONG_PRESS_SLOP = 8

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n))
}

function scaleCssClamp(value: string, scale: number) {
  const match = value.match(/^clamp\(([\d.]+)px,\s*([\d.]+)vw,\s*([\d.]+)px\)$/)
  if (!match) return value
  const [, min, mid, max] = match
  return `clamp(${Number(min) * scale}px, ${Number(mid) * scale}vw, ${Number(max) * scale}px)`
}

function stageScale(stage: HTMLElement) {
  const rect = stage.getBoundingClientRect()
  return stage.offsetWidth > 0 ? rect.width / stage.offsetWidth : 1
}

function warmImage(src: string) {
  const img = new Image()
  img.decoding = 'async'
  img.src = src
  void img.decode?.().catch(() => {})
  return img
}

// mat-object editing
// long-press to lift + open edit menu; overrides live in shared context
type MatOverride = { left?: number; top?: number; scale?: number; rotate?: number; src?: string; deleted?: boolean }
type MatEditApi = {
  activeKey: string | null
  setActiveKey: (key: string | null) => void
  overrides: Record<string, MatOverride>
  patch: (key: string, partial: MatOverride) => void
  remove: (key: string) => void
  tableSrcs: Set<string> // srcs on the desk, excluded from Replace
}
const MatEditContext = createContext<MatEditApi | null>(null)
function useMatEdit(): MatEditApi {
  const ctx = useContext(MatEditContext)
  if (!ctx) throw new Error('useMatEdit must be used within a MatEditContext provider')
  return ctx
}

// Replace library, grouped into tabs (keep in sync with public/stickers/items/)
const STICKER_CATEGORIES: Array<{ id: string; name: string; files: string[] }> = [
  {
    id: 'cute',
    name: 'Cute',
    files: [
      'sticker-cutie-kirby.png',
      'sticker-cutie-chick.svg',
      'sticker-cutie-pig.svg',
      'sticker-cutie-snail.svg',
      'sticker-cutie-sneaker.svg',
      // hand-drawn cuties
      'sticker-cutie-bear.svg',
      'sticker-cutie-cat-rawr.svg',
      'sticker-cutie-cat-wiggle.svg',
      'sticker-cutie-cat-meow.svg',
      'sticker-cutie-sleepy-kitty.svg',
      'sticker-cutie-sleepy-bunny.svg',
      'sticker-cutie-unicorn-float.svg',
      'sticker-cutie-apple.svg',
      'sticker-cutie-cherry-mug.svg',
      'sticker-cutie-rocket.svg',
      'sticker-cutie-gift.svg',
      'sticker-cutie-flower-smile.svg',
      'sticker-cutie-tulip-heart.svg',
      'sticker-cutie-heart-thanks.svg',
      'sticker-cutie-heart-mend.svg',
      'sticker-cutie-rainbow-cloud.svg',
      'sticker-cutie-poppies.svg',
      'sticker-cutie-gameboy.svg',
      'sticker-cute-pop-cat-face.svg',
      'sticker-cute-pop-fox-face.svg',
      'sticker-cute-pop-koi-fish.svg',
      'sticker-cute-pop-reindeer.svg',
      'sticker-cute-pop-skull.svg',
      'sticker-cute-pop-unicorn.svg',
    ],
  },
  {
    id: 'stationery',
    name: 'Stationery',
    files: ['sticker-desk-0.svg', 'sticker-desk-1.svg', 'sticker-desk-2.svg', 'sticker-desk-3.svg', 'sticker-desk-4.svg', 'sticker-desk-5.svg', 'sticker-desk-6.svg', 'sticker-journal-0.svg', 'sticker-journal-1.svg', 'sticker-journal-3.svg', 'sticker-stationery-0.svg', 'sticker-stationery-1.svg', 'sticker-stationery-2.svg', 'sticker-stationery-5.svg', 'sticker-stationery-6.svg', 'sticker-stationery-7.svg', 'sticker-stationery-9.svg', 'sticker-stationery-10.svg'],
  },
  {
    id: 'plants',
    name: 'Plants',
    files: ['sticker-plant-1.svg', 'sticker-plant-2.svg', 'sticker-plant-succulent.svg', 'sticker-cute-pop-cactus.svg'],
  },
  {
    id: 'desk',
    name: 'Desk',
    files: ['sticker-keyboard.svg', 'sticker-desk-7.svg', 'sticker-desk-8.svg', 'sticker-desk-9.svg', 'sticker-journal-2.svg', 'sticker-stationery-3.svg', 'sticker-stationery-4.svg', 'sticker-matcha-cup.png'],
  },
  {
    id: 'dev',
    name: 'Dev',
    // each logo in two styles: badge + outlined die-cut
    files: [
      'sticker-dev-react.svg',
      'sticker-dev-typescript.svg', 'sticker-dev-typescript-outline.svg',
      'sticker-dev-javascript.svg', 'sticker-dev-javascript-outline.svg',
      'sticker-dev-html.svg', 'sticker-dev-html-outline.svg',
      'sticker-dev-python.svg', 'sticker-dev-python-outline.svg',
      'sticker-dev-github.svg', 'sticker-dev-github-outline.svg',
      'sticker-dev-figma.png',
      'sticker-dev-cpp.png', 'sticker-dev-tailwind.png', 'sticker-dev-w3css.png', 'sticker-dev-nextjs.png',
    ],
  },
]
// Polaroid + iPod are live CSS components, ride Replace as sentinel srcs

// src to category id + flat library
const CAT_OF = new Map<string, string>()
const STICKER_LIBRARY: string[] = []
STICKER_CATEGORIES.forEach((c) =>
  c.files.forEach((f) => {
    const src = ITM + f
    CAT_OF.set(src, c.id)
    STICKER_LIBRARY.push(src)
  }),
)
// Polaroid in Stationery tab
CAT_OF.set(POLAROID_SRC, 'stationery')
STICKER_LIBRARY.push(POLAROID_SRC)
// iPod in Replace catalogue
CAT_OF.set(IPOD_SRC, 'desk')
STICKER_LIBRARY.push(IPOD_SRC)
// name tag as live component sticker
CAT_OF.set(NAME_TAG_SRC, 'stationery')
STICKER_LIBRARY.push(NAME_TAG_SRC)
// tab row: one per category
const LIB_TABS = STICKER_CATEGORIES.map((c) => ({ id: c.id, name: c.name }))

// peel stickers adhere flush; everything else rests as a 3D object
const isPeelSticker = (src: string) => /sticker-(cutie|cute-pop|dev)-/.test(src)
// dev logos share one consistent size
const isDevSticker = (src: string) => /sticker-dev-/.test(src)
const DEV_STICKER_WIDTH = 'clamp(56px, 12.5vw, 132px)'

// keyboard colour themes (pre-recoloured SVG copies)
const KEYBOARD_BASE_SRC = ITM + 'sticker-keyboard.svg'
type StickerTheme = { id: string; name: string; src: string; swatch: string }
const KEYBOARD_THEMES: StickerTheme[] = [
  { id: 'mint', name: 'Mint', src: KEYBOARD_BASE_SRC, swatch: '#8bbba8' },
  { id: 'aqua', name: 'Aqua', src: ITM + 'sticker-keyboard-blue.svg', swatch: '#8cbfe0' },
  { id: 'orange', name: 'Orange', src: ITM + 'sticker-keyboard-orange.svg', swatch: '#e58e3e' },
  { id: 'ruby', name: 'Ruby', src: ITM + 'sticker-keyboard-ruby.svg', swatch: '#e8635e' },
]

// edit-menu icons (stroke 1.5)
const LbResize = (p: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...p}>
    <path d="M16.4999 3.26621C17.3443 3.25421 20.1408 2.67328 20.7337 3.26621C21.3266 3.85913 20.7457 6.65559 20.7337 7.5M20.5059 3.49097L13.5021 10.4961" />
    <path d="M3.26636 16.5001C3.25436 17.3445 2.67343 20.141 3.26636 20.7339C3.85928 21.3268 6.65574 20.7459 7.50015 20.7339M10.502 13.4976L3.49824 20.5027" />
  </svg>
)
const LbReplace = (p: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...p}>
    <path d="M16.9767 19.5C19.4017 17.8876 21 15.1305 21 12C21 7.02944 16.9706 3 12 3C11.3126 3 10.6432 3.07706 10 3.22302M16.9767 19.5V16M16.9767 19.5H20.5M7 4.51555C4.58803 6.13007 3 8.87958 3 12C3 16.9706 7.02944 21 12 21C12.6874 21 13.3568 20.9229 14 20.777M7 4.51555V8M7 4.51555H3.5" />
  </svg>
)
const LbTrash = (p: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...p}>
    <path d="M19.5 5.5L18.8803 15.5251C18.7219 18.0864 18.6428 19.3671 18.0008 20.2879C17.6833 20.7431 17.2747 21.1273 16.8007 21.416C15.8421 22 14.559 22 11.9927 22C9.42312 22 8.1383 22 7.17905 21.4149C6.7048 21.1257 6.296 20.7408 5.97868 20.2848C5.33688 19.3626 5.25945 18.0801 5.10461 15.5152L4.5 5.5" />
    <path d="M3 5.5H21M16.0557 5.5L15.3731 4.09173C14.9196 3.15626 14.6928 2.68852 14.3017 2.39681C14.215 2.3321 14.1231 2.27454 14.027 2.2247C13.5939 2 13.0741 2 12.0345 2C10.9688 2 10.436 2 9.99568 2.23412C9.8981 2.28601 9.80498 2.3459 9.71729 2.41317C9.32164 2.7167 9.10063 3.20155 8.65861 4.17126L8.05292 5.5" />
    <path d="M9.5 16.5L9.5 10.5" />
    <path d="M14.5 16.5L14.5 10.5" />
  </svg>
)
const DEFAULT_DEV_ACTIVITY_LINK = 'https://github.com/Omzee15'

// library tile artwork: static icon for sentinels, else the sticker image
function StickerTile({ src }: { src: string }) {
  if (src === POLAROID_SRC)
    return (
      <svg className="df-lib-polaroid" viewBox="0 0 40 36" aria-hidden="true">
        <rect x="4" y="6" width="32" height="26" rx="5" fill="#f6f4ef" stroke="#d8d2c8" />
        <rect x="4" y="6" width="32" height="6" rx="3" fill="#eceae4" />
        <rect x="27" y="9" width="6" height="2.6" rx="1.3" fill="#e15b5b" />
        <rect x="8" y="9.2" width="4" height="3" rx="1" fill="#cfd6db" />
        <circle cx="20" cy="21" r="7.5" fill="#2c2f33" />
        <circle cx="20" cy="21" r="4.4" fill="#5b6168" />
        <circle cx="18" cy="19" r="1.5" fill="#aeb6bd" />
      </svg>
    )
  if (src === IPOD_SRC)
    return (
      <svg className="df-lib-ipod" viewBox="0 0 40 56" aria-hidden="true">
        <rect x="9" y="3" width="22" height="50" rx="4.5" fill="#f7f7f5" stroke="#d8d8d3" />
        <rect x="12" y="8" width="16" height="16" rx="1.8" fill="#d7daf9" stroke="#4b4e66" strokeWidth="0.8" />
        <rect x="14" y="11" width="8" height="1.4" rx="0.7" fill="#4b4e66" opacity="0.75" />
        <rect x="14" y="14" width="11" height="1.2" rx="0.6" fill="#4b4e66" opacity="0.45" />
        <rect x="14" y="17" width="10" height="1.2" rx="0.6" fill="#4b4e66" opacity="0.45" />
        <circle cx="20" cy="38" r="10" fill="#dedede" stroke="#c8c8c8" />
        <circle cx="20" cy="38" r="4.2" fill="#fff" stroke="#d4d4d4" />
        <path d="M15 38h2.2M22.8 38H25M20 33v1.8M20 41.2v1.8" stroke="#fff" strokeWidth="1.4" strokeLinecap="round" />
      </svg>
    )
  if (src === NAME_TAG_SRC)
    return <img className="df-lib-name-tag" src="/stickers/items/hello-name-tag.svg" alt="" draggable={false} loading="lazy" decoding="async" />
  // lazy-load so thumbnails never fetch on the reveal path
  return <img src={src} alt="" draggable={false} loading="lazy" decoding="async" />
}

function stickerTitle(src: string) {
  return src === POLAROID_SRC
    ? 'polaroid'
    : src === IPOD_SRC
      ? 'iPod'
      : src === NAME_TAG_SRC
        ? 'name tag'
        : src.split('/').pop()?.replace('sticker-', '').replace(/\.(svg|png)$/, '')
}

// bloom edit menu, morphs between views
type MatObjectKind = 'sticker' | 'polaroid' | 'device' | 'object'

function MatObjectMenu({ objectKey, kind, scale, rotate, flip, dx = 0, themes, baseSrc }: { objectKey: string; kind: MatObjectKind; scale: number; rotate: number; flip: boolean; dx?: number; themes?: StickerTheme[]; baseSrc?: string }) {
  const reduce = useReducedMotion()
  const { setActiveKey, overrides, patch, remove, tableSrcs } = useMatEdit()
  const [view, setView] = useState<'menu' | 'resize' | 'library' | 'theme'>('menu')
  const currentSrc = overrides[objectKey]?.src ?? themes?.[0]?.src
  // open Replace on the current sticker's tab
  const [libCat, setLibCat] = useState(() => CAT_OF.get(overrides[objectKey]?.src ?? baseSrc ?? '') ?? LIB_TABS[0].id)
  const close = () => setActiveKey(null)

  // Replace library: every sticker except those on the desk
  const libItems = useMemo(() => STICKER_LIBRARY.filter((src) => !tableSrcs.has(src)), [tableSrcs])
  const catItems = useMemo(() => libItems.filter((src) => CAT_OF.get(src) === libCat), [libItems, libCat])
  const LIB_TILE = 46
  const libCols = Math.min(6, Math.max(1, catItems.length))
  const libRows = Math.max(1, Math.ceil(catItems.length / libCols))
  const libGridH = catItems.length ? libRows * LIB_TILE + (libRows - 1) * 6 : 44
  const libH = 34 + 8 + libGridH + 20 // tab row + gap + grid + padding

  // menu rows count
  const canDelete = kind !== 'device'
  const menuRows = 1 + (kind === 'sticker' ? 1 : 0) + (themes ? 1 : 0) + (canDelete ? 1 : 0)
  // centred on object, plus clamp nudge
  const xPos = dx ? `calc(-50% + ${dx}px)` : '-50%'
  const dims =
    view === 'library'
      ? { width: 326, height: libH, borderRadius: 22 }
      : view === 'theme'
        ? { width: 236, height: 112, borderRadius: 22 }
      : view === 'resize'
        ? { width: 244, height: 138, borderRadius: 22 }
        : { width: 170, height: 12 + menuRows * 46, borderRadius: 20 }

  return (
    <motion.div
      className="df-matmenu"
      data-flip={flip ? 'below' : 'above'}
      role="menu"
      aria-label={kind === 'sticker' ? 'Edit sticker' : 'Edit object'}
      onPointerDown={(e) => e.stopPropagation()}
      initial={reduce ? false : { opacity: 0, scale: 0.66, x: xPos, ...dims }}
      animate={reduce ? { opacity: 1, x: xPos, ...dims } : { opacity: 1, scale: 1, x: xPos, ...dims }}
      exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.82, x: xPos, transition: { duration: 0.14, ease: 'easeIn' } }}
      transition={reduce ? { duration: 0 } : { type: 'spring', bounce: 0.26, duration: 0.44 }}
    >
      {/* one keyed surface per view, quick fade swap */}
      <motion.div
        key={view}
        className="df-matmenu-view"
        initial={reduce ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.14 }}
      >
        {view === 'menu' && (
          <div className="df-matmenu-rows">
            <button type="button" className="df-matmenu-row" onClick={() => setView('resize')}>
              <LbResize className="df-matmenu-ico" /> Resize
            </button>
            {kind === 'sticker' && (
              <button type="button" className="df-matmenu-row" onClick={() => setView('library')}>
                <LbReplace className="df-matmenu-ico" /> Replace
              </button>
            )}
            {themes && (
              <button type="button" className="df-matmenu-row" onClick={() => setView('theme')}>
                <span className="df-matmenu-ico df-matmenu-themedot" style={{ background: (themes.find((t) => t.src === currentSrc) ?? themes[0]).swatch }} aria-hidden="true" /> Theme
              </button>
            )}
            {canDelete && (
              <button type="button" className="df-matmenu-row df-matmenu-row--danger" onClick={() => { remove(objectKey); close() }}>
                <LbTrash className="df-matmenu-ico" /> Delete
              </button>
            )}
          </div>
        )}
        {view === 'resize' && (
          <div className="df-matmenu-resize">
            <DialSlider value={scale} onChange={(s) => patch(objectKey, { scale: s })} min={0.5} max={1.8} step={0.05} label="Size" valueText={`${Math.round(scale * 100)}%`} ariaLabel="Object size" />
            <DialSlider value={rotate} onChange={(r) => patch(objectKey, { rotate: r })} min={-180} max={180} step={1} label="Tilt" valueText={`${Math.round(rotate)}°`} ariaLabel="Sticker rotation" />
            <button type="button" className="df-matmenu-done" onClick={() => setView('menu')}>Done</button>
          </div>
        )}
        {view === 'theme' && themes && (
          <div className="df-matmenu-theme">
            <div className="df-matmenu-theme-row" role="radiogroup" aria-label="Keyboard colour">
              {themes.map((t) => {
                const selected = (currentSrc ?? themes[0].src) === t.src
                return (
                  <button
                    key={t.id}
                    type="button"
                    role="radio"
                    aria-checked={selected}
                    aria-label={t.name}
                    title={t.name}
                    className={selected ? 'df-matmenu-swatch is-active' : 'df-matmenu-swatch'}
                    style={{ background: t.swatch }}
                    onClick={() => patch(objectKey, { src: t.src })}
                  />
                )
              })}
            </div>
            <button type="button" className="df-matmenu-done" onClick={() => setView('menu')}>Done</button>
          </div>
        )}
        {view === 'library' && (
          <div className="df-matmenu-lib">
            {/* grid, tabs below */}
            {catItems.length === 0 ? (
              <p className="df-matmenu-lib-empty">Nothing here that isn't already on the desk ✨</p>
            ) : (
              <motion.div
                key={libCat}
                className="df-matmenu-lib-grid"
                style={{ gridTemplateColumns: `repeat(${libCols}, ${LIB_TILE}px)` }}
                initial={reduce ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.15 }}
              >
                {catItems.map((src) => (
                  <button
                    type="button"
                    key={src}
                    className="df-matmenu-lib-item"
                    title={stickerTitle(src)}
                    onClick={() => { patch(objectKey, { src }); close() }}
                  >
                    <StickerTile src={src} />
                  </button>
                ))}
              </motion.div>
            )}
            {/* tabs with sliding pill */}
            <div className="df-matmenu-tabs" role="tablist" aria-label="Sticker categories">
              {LIB_TABS.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  role="tab"
                  aria-selected={t.id === libCat}
                  className={t.id === libCat ? 'df-matmenu-tab is-active' : 'df-matmenu-tab'}
                  onClick={() => setLibCat(t.id)}
                >
                  {t.id === libCat && (
                    <motion.span
                      className="df-matmenu-tab-bg"
                      layoutId="df-matmenu-tab-bg"
                      transition={reduce ? { duration: 0 } : { type: 'spring', bounce: 0.2, duration: 0.4 }}
                    />
                  )}
                  <span className="df-matmenu-tab-label">{t.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  )
}

function DraggableMatObject({
  objectKey,
  editable = false,
  kind = 'sticker',
  className = 'df-sticker-dragger',
  title = 'Hold to move',
  style,
  themes,
  baseSrc,
  onDraggingChange,
  children,
}: {
  objectKey: string
  editable?: boolean
  kind?: MatObjectKind
  className?: string
  title?: string
  style: React.CSSProperties
  themes?: StickerTheme[]
  baseSrc?: string
  onDraggingChange?: (dragging: boolean) => void
  children: React.ReactNode
}) {
  const { activeKey, setActiveKey, overrides, patch } = useMatEdit()
  const override = overrides[objectKey]
  const active = editable && activeKey === objectKey
  const [dragging, setDragging] = useState(false)
  const [flip, setFlip] = useState(false)
  const [menuDx, setMenuDx] = useState(0) // nudge to keep menu on-canvas
  const elRef = useRef<HTMLDivElement>(null)
  const timerRef = useRef<number | null>(null)
  const dragRef = useRef<StickerDragState | null>(null)
  const dragFrameRef = useRef<number | null>(null)
  const pendingDragPatchRef = useRef<MatOverride | null>(null)
  const suppressClickRef = useRef(false)

  const clearHold = () => {
    if (timerRef.current != null) {
      window.clearTimeout(timerRef.current)
      timerRef.current = null
    }
  }

  const releaseCapture = () => {
    const state = dragRef.current
    const el = elRef.current
    if (state && el?.hasPointerCapture(state.pointerId)) {
      try {
        el.releasePointerCapture(state.pointerId)
      } catch {
        // capture already gone if OS cancelled the gesture
      }
    }
  }

  const flushDragPatch = useCallback(() => {
    if (dragFrameRef.current != null) {
      window.cancelAnimationFrame(dragFrameRef.current)
      dragFrameRef.current = null
    }
    const pending = pendingDragPatchRef.current
    if (!pending) return
    pendingDragPatchRef.current = null
    patch(objectKey, pending)
  }, [objectKey, patch])

  const scheduleDragPatch = useCallback((partial: MatOverride) => {
    pendingDragPatchRef.current = partial
    if (dragFrameRef.current != null) return
    dragFrameRef.current = window.requestAnimationFrame(() => {
      dragFrameRef.current = null
      const pending = pendingDragPatchRef.current
      if (!pending) return
      pendingDragPatchRef.current = null
      patch(objectKey, pending)
    })
  }, [objectKey, patch])

  useEffect(() => () => {
    if (dragFrameRef.current != null) window.cancelAnimationFrame(dragFrameRef.current)
  }, [])

  const placement = override?.left != null && override?.top != null ? { left: override.left, top: override.top } : undefined
  const placedStyle = placement
    ? (() => {
        const { left, right, top, bottom, ...rest } = style
        void left
        void right
        void top
        void bottom
        return { ...rest, left: placement.left, top: placement.top }
      })()
    : style

  const rootClassName = [className, dragging && 'is-dragging', active && 'df-matobject--active'].filter(Boolean).join(' ')

  // long-press in edit mode: lift + open menu
  const beginEdit = (el: HTMLDivElement) => {
    const stage = el.closest<HTMLElement>('.deskfolio-demo-stage')
    if (stage) {
      const sr = stage.getBoundingClientRect()
      const r = el.getBoundingClientRect()
      setFlip((r.top - sr.top) < sr.height * 0.4) // near top, drop menu below
      // nudge horizontally to stay inside the stage
      const scale = stageScale(stage) || 1
      const centerX = r.left + r.width / 2 - sr.left // object centre from stage left
      const half = 168 * scale // menu half-width
      const pad = 14 * scale
      let dx = 0
      if (centerX - half < pad) dx = pad - (centerX - half)
      else if (centerX + half > sr.width - pad) dx = sr.width - pad - (centerX + half)
      setMenuDx(dx / scale) // back to unscaled units
    }
    if (dragRef.current) dragRef.current.held = true
    setActiveKey(objectKey)
  }

  const armDrag = (el: HTMLDivElement, pointerId: number, clientX: number, clientY: number) => {
    const stage = el.closest<HTMLElement>('.deskfolio-demo-stage')
    if (!stage || dragRef.current?.pointerId !== pointerId) return
    const scale = stageScale(stage) || 1
    const stageRect = stage.getBoundingClientRect()
    const rect = el.getBoundingClientRect()
    const left = (rect.left - stageRect.left) / scale
    const top = (rect.top - stageRect.top) / scale
    const width = rect.width / scale
    const height = rect.height / scale
    dragRef.current = {
      ...dragRef.current,
      armed: true,
      stage,
      offsetX: (clientX - rect.left) / scale,
      offsetY: (clientY - rect.top) / scale,
      width,
      height,
    }
    patch(objectKey, { left, top })
    setDragging(true)
    onDraggingChange?.(true)
    try {
      el.setPointerCapture(pointerId)
    } catch {
      // some browsers decline capture; drag still works
    }
  }

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return
    const el = e.currentTarget
    dragRef.current = { pointerId: e.pointerId, startX: e.clientX, startY: e.clientY, armed: false, held: false }
    clearHold()
    timerRef.current = window.setTimeout(() => {
      timerRef.current = null
      if (editable) beginEdit(el)
      else armDrag(el, e.pointerId, e.clientX, e.clientY)
    }, LONG_PRESS_MS)
  }

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const state = dragRef.current
    if (!state || state.pointerId !== e.pointerId) return
    if (state.armed) {
      if (!state.stage || state.offsetX == null || state.offsetY == null || state.width == null || state.height == null) return
      const scale = stageScale(state.stage) || 1
      const stageRect = state.stage.getBoundingClientRect()
      const maxLeft = Math.max(0, state.stage.offsetWidth - state.width)
      const maxTop = Math.max(0, state.stage.offsetHeight - state.height)
      scheduleDragPatch({
        left: clamp((e.clientX - stageRect.left) / scale - state.offsetX, 0, maxLeft),
        top: clamp((e.clientY - stageRect.top) / scale - state.offsetY, 0, maxTop),
      })
      e.preventDefault()
      return
    }
    const moved = Math.hypot(e.clientX - state.startX, e.clientY - state.startY) > LONG_PRESS_SLOP
    if (state.held) {
      // moving converts the lift into a drag
      if (moved) {
        setActiveKey(null)
        armDrag(e.currentTarget, state.pointerId, e.clientX, e.clientY)
      }
      return
    }
    // moved before long-press: scroll/swipe, cancel hold
    if (moved) {
      clearHold()
      dragRef.current = null
    }
  }

  const onPointerUp = () => {
    clearHold()
    flushDragPatch()
    const state = dragRef.current
    if (state?.armed || state?.held) {
      // swallow the trailing click after a drag/lift
      suppressClickRef.current = true
      window.setTimeout(() => {
        suppressClickRef.current = false
      }, 0)
    }
    releaseCapture()
    dragRef.current = null
    setDragging(false)
    onDraggingChange?.(false)
  }

  const onPointerCancel = () => {
    clearHold()
    flushDragPatch()
    releaseCapture()
    dragRef.current = null
    setDragging(false)
    onDraggingChange?.(false)
  }

  return (
    <div
      ref={elRef}
      className={rootClassName}
      data-sticker={objectKey}
      title={title}
      style={placedStyle}
      onClickCapture={(e) => {
        if (!suppressClickRef.current) return
        // never swallow the menu's own buttons
        if ((e.target as HTMLElement).closest('.df-matmenu')) return
        e.preventDefault()
        e.stopPropagation()
        suppressClickRef.current = false
      }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerCancel}
      onLostPointerCapture={onPointerUp}
      onContextMenu={(e) => e.preventDefault()}
    >
      {children}
      <AnimatePresence>
        {active && <MatObjectMenu objectKey={objectKey} kind={kind} scale={override?.scale ?? 1} rotate={override?.rotate ?? 0} flip={flip} dx={menuDx} themes={themes} baseSrc={baseSrc} />}
      </AnimatePresence>
    </div>
  )
}

function DraggableMatSticker({
  objectKey,
  item,
  index,
  reduce,
  onDraggingChange,
}: {
  objectKey: string
  item: StickerItem
  index: number
  reduce: boolean
  onDraggingChange: (dragging: boolean) => void
}) {
  const { overrides, activeKey } = useMatEdit()
  const ov = overrides[objectKey]
  const active = activeKey === objectKey
  const scale = ov?.scale ?? 1
  const rot = ov?.rotate ?? 0 // user tilt on top of resting rotate
  const src = ov?.src ?? item.src

  // Polaroid replacement becomes the live CSS camera
  if (src === POLAROID_SRC) {
    return (
      <DraggableMatObject
        objectKey={objectKey}
        editable
        kind="sticker"
        className="df-sticker-dragger df-polaroid-dragger"
        baseSrc={src}
        style={
          {
            ...item.pos,
            ...(scale !== 1 ? { '--df-pol-scale': 0.26 * scale } : {}),
            ...(rot !== 0 ? { '--df-pol-rotate': `${-7 + rot}deg` } : {}),
          } as React.CSSProperties
        }
        onDraggingChange={onDraggingChange}
      >
        <div className="df-polaroid-mat">
          <div className="df-polaroid-scale">
            <PolaroidCamera />
          </div>
        </div>
      </DraggableMatObject>
    )
  }

  if (src === IPOD_SRC) {
    return (
      <DraggableMatObject
        objectKey={objectKey}
        editable
        kind="sticker"
        className="df-sticker-dragger df-ipod-dragger"
        baseSrc={src}
        style={
          {
            ...item.pos,
            '--df-ipod-scale': 0.58 * scale,
            '--df-ipod-rotate': `${-14 + rot}deg`,
          } as React.CSSProperties
        }
        onDraggingChange={onDraggingChange}
      >
        <div className="df-ipod-mat">
          <div className="df-mipod df-ipod-placed" aria-hidden="true">
            <MiniPod />
          </div>
        </div>
      </DraggableMatObject>
    )
  }

  // peel vs 3D is driven by the art, not the slot
  if (src === NAME_TAG_SRC) {
    return (
      <DraggableMatObject
        objectKey={objectKey}
        editable
        kind="sticker"
        className="df-sticker-dragger df-name-tag-dragger"
        baseSrc={src}
        style={
          {
            ...item.pos,
            '--df-name-tag-scale': scale,
            '--df-name-tag-rotate': `${-8 + rot}deg`,
          } as React.CSSProperties
        }
        onDraggingChange={onDraggingChange}
      >
        <div className="df-name-tag-mat">
          <EditableNameTag className="df-name-tag-placed" />
        </div>
      </DraggableMatObject>
    )
  }

  const stuck = isPeelSticker(src)

  return (
    <DraggableMatObject
      objectKey={objectKey}
      editable
      kind="sticker"
      // peel stickers sit on the bottom layer
      className={stuck ? 'df-sticker-dragger df-sticker-dragger--stuck' : 'df-sticker-dragger'}
      // dev logos use one consistent base width
      style={{ width: isDevSticker(src) ? DEV_STICKER_WIDTH : item.width, ...item.pos }}
      baseSrc={src}
      // keyboard is recolourable
      themes={item.src === KEYBOARD_BASE_SRC ? KEYBOARD_THEMES : undefined}
      onDraggingChange={onDraggingChange}
    >
      {/* inner scale layer carries Resize + lift */}
      <div className="df-sticker-scale" style={{ transform: `scale(${active ? scale * 1.06 : scale}) rotate(${rot}deg)` }}>
        <motion.img
          key={src}
          className={stuck ? 'df-sticker-item df-sticker-stuck' : 'df-sticker-item'}
          src={src}
          alt=""
          draggable={false}
          decoding="async"
          {...(stuck ? pressOn : dropIn)(item.rotate, index, reduce)}
        />
      </div>
    </DraggableMatObject>
  )
}

/** interactive desk lamp: click to toggle the light */
function DeskLamp({
  item,
  index,
  on,
  onToggle,
  placed = false,
}: {
  item: StickerItem
  index: number
  on: boolean
  onToggle: () => void
  placed?: boolean
}) {
  const reduce = useReducedMotion()
  // warm-up flicker only on a deliberate click, not on mount
  const [warmup, setWarmup] = useState(false)
  return (
    <motion.button
      type="button"
      className={on ? (warmup ? 'df-lamp is-on df-lamp--warmup' : 'df-lamp is-on') : 'df-lamp'}
      style={placed ? { width: '100%' } : { width: item.width, ...item.pos }}
      role="switch"
      aria-checked={on}
      aria-label="Desk lamp light"
      onClick={() => {
        if (!on) setWarmup(true) // play warm-up flicker on manual on
        onToggle()
      }}
      {...dropIn(item.rotate, index, !!reduce)}
    >
      {/* directional light beam, layered for realism */}
      <svg className="df-lamp-cast" viewBox="0 0 200 200" preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <linearGradient id="lamp-beam" x1="121" y1="80" x2="-480" y2="300" gradientUnits="userSpaceOnUse">
            {/* steep near-to-far falloff */}
            <stop offset="0" stopColor="#fff8e8" stopOpacity="0.92" />
            <stop offset="0.09" stopColor="#fff3cf" stopOpacity="0.62" />
            <stop offset="0.24" stopColor="#ffeab2" stopOpacity="0.34" />
            <stop offset="0.48" stopColor="#ffe7a6" stopOpacity="0.15" />
            <stop offset="0.76" stopColor="#ffe6a0" stopOpacity="0.05" />
            <stop offset="1" stopColor="#ffe6a0" stopOpacity="0" />
          </linearGradient>
          <radialGradient id="lamp-pool">
            <stop offset="0" stopColor="#fff7e2" stopOpacity="0.5" />
            <stop offset="0.55" stopColor="#ffedbe" stopOpacity="0.16" />
            <stop offset="1" stopColor="#ffedbe" stopOpacity="0" />
          </radialGradient>
          {/* mask: soft hole over the lamp body */}
          <radialGradient id="lamp-hole">
            <stop offset="0.28" stopColor="#000" />
            <stop offset="1" stopColor="#fff" />
          </radialGradient>
          <filter id="lamp-mblur" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="10" /></filter>
          <mask id="lamp-mask">
            <rect x="-900" y="-500" width="1400" height="1500" fill="#fff" />
            {/* big soft hole so the beam fades in */}
            <ellipse cx="150" cy="52" rx="82" ry="76" fill="url(#lamp-hole)" filter="url(#lamp-mblur)" />
          </mask>
          <filter id="lamp-pen" filterUnits="userSpaceOnUse" x="-820" y="-140" width="1180" height="940"><feGaussianBlur stdDeviation="14" /></filter>
          <filter id="lamp-umb" filterUnits="userSpaceOnUse" x="-820" y="-140" width="1180" height="940"><feGaussianBlur stdDeviation="7" /></filter>
          <filter id="lamp-b10" filterUnits="userSpaceOnUse" x="-820" y="-140" width="1180" height="940"><feGaussianBlur stdDeviation="10" /></filter>
        </defs>
        <g mask="url(#lamp-mask)">
          <path d="M96 54 L-700 90 L-360 660 L150 104 Z" fill="url(#lamp-beam)" opacity="0.42" filter="url(#lamp-pen)" />
          <path d="M106 60 L-650 125 L-370 560 L136 96 Z" fill="url(#lamp-beam)" filter="url(#lamp-umb)" />
          <ellipse cx="-150" cy="210" rx="150" ry="82" transform="rotate(-14 -150 210)" fill="url(#lamp-pool)" filter="url(#lamp-b10)" />
        </g>
      </svg>
      <img className="df-lamp-img" src={item.src} alt="" draggable={false} decoding="async" />
    </motion.button>
  )
}

/** the set's items, scattered across the mat */
function MatStickers({ setId, compact = false }: { setId: string; compact?: boolean }) {
  const reduce = useReducedMotion()
  const { overrides, activeKey } = useMatEdit()
  const [dragging, setDragging] = useState(false)
  const set = STICKER_SETS.find((s) => s.id === setId) ?? STICKER_SETS[0]
  // lift the layer when a sticker's menu is open; index the lamp-filtered list
  const hasActiveSticker = set.items.filter((it) => !it.lamp).some((it, i) => `${set.id}-${i}-${it.src}` === activeKey)
  return (
    <div className={['df-stickers', dragging && 'is-dragging', hasActiveSticker && 'has-active'].filter(Boolean).join(' ')}>
      <AnimatePresence>
        {set.items
          .filter((it) => !it.lamp)
          .map((it, i) => ({ it, i, key: `${set.id}-${i}-${it.src}` })) // stable index so overrides survive
          .filter(({ key }) => !overrides[key]?.deleted)
          // phones keep peel-stickers + the plant only
          .filter(({ it }) => !compact || isPeelSticker(it.src) || /plant/.test(it.src))
          .map(({ it, i, key }) => (
            <DraggableMatSticker
              key={key}
              objectKey={key}
              item={it}
              index={i}
              reduce={!!reduce}
              onDraggingChange={setDragging}
            />
          ))}
      </AnimatePresence>
    </div>
  )
}

// synthesise an item for an added sticker (default size/tilt, cascading slots)
function addedItem(src: string, i: number): StickerItem {
  const peel = isPeelSticker(src)
  const col = i % 6
  const row = Math.floor(i / 6)
  const tilt = [-7, 6, -4, 8, -5, 3][i % 6]
  return {
    src,
    width: peel ? 'clamp(46px, 11vw, 128px)' : 'clamp(48px, 11vw, 146px)',
    rotate: tilt,
    pos: { top: `${24 + col * 6 + row * 4}%`, left: `${13 + col * 3.6}%` },
  }
}

/** user-added stickers, persist across set switches */
function AddedStickers({ added }: { added: Array<{ key: string; src: string }> }) {
  const reduce = useReducedMotion()
  const { overrides, activeKey } = useMatEdit()
  const [dragging, setDragging] = useState(false)
  const live = added.filter((a) => !overrides[a.key]?.deleted)
  const hasActive = live.some((a) => a.key === activeKey)
  return (
    <div className={['df-stickers', dragging && 'is-dragging', hasActive && 'has-active'].filter(Boolean).join(' ')}>
      <AnimatePresence>
        {live.map((a, i) => {
          // seed slot/tilt from the stable key, not the live index
          const seed = Number(a.key.slice('added-'.length))
          return (
            <DraggableMatSticker
              key={a.key}
              objectKey={a.key}
              item={addedItem(a.src, Number.isFinite(seed) ? seed : i)}
              index={i}
              reduce={!!reduce}
              onDraggingChange={setDragging}
            />
          )
        })}
      </AnimatePresence>
    </div>
  )
}

/** the "+" FAB and its bloom library panel */
function AddStickerControl({ open, onToggle, onAdd }: { open: boolean; onToggle: (v: boolean) => void; onAdd: (src: string) => void }) {
  const reduce = useReducedMotion()
  const [cat, setCat] = useState(LIB_TABS[0].id)
  const items = useMemo(() => STICKER_LIBRARY.filter((src) => CAT_OF.get(src) === cat), [cat])
  const LIB_TILE = 46
  const cols = Math.min(6, Math.max(1, items.length))
  // explicit panel height per category so tab switches morph smoothly
  const rows = Math.max(1, Math.ceil(items.length / cols))
  const gridH = rows * LIB_TILE + (rows - 1) * 9 // 9px row gap
  const panelH = gridH + 74
  return (
    <motion.div
      className="df-addzone"
      initial={reduce ? false : { opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={reduce ? { duration: 0 } : { type: 'spring', bounce: 0.4, duration: 0.5 }}
    >
      <AnimatePresence>
        {open && (
          <motion.div
            className="df-add-panel"
            role="dialog"
            aria-label="Add a sticker"
            initial={reduce ? false : { opacity: 0, scale: 0.85, y: 10, height: panelH }}
            animate={{ opacity: 1, scale: 1, y: 0, height: panelH }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.9, y: 8, transition: { duration: 0.14, ease: 'easeIn' } }}
            transition={
              reduce
                ? { duration: 0 }
                : {
                    default: { type: 'spring', bounce: 0.26, duration: 0.42 },
                    // bottom-anchored, ease height with no overshoot
                    height: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
                  }
            }
          >
            {/* grid, tabs below; panel blooms upward from the FAB */}
            {/* one grid at a time (mode="wait") */}
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={cat}
                className="df-matmenu-lib-grid df-add-grid"
                style={{ gridTemplateColumns: `repeat(${cols}, ${LIB_TILE}px)` }}
                initial={reduce ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={reduce ? { opacity: 0 } : { opacity: 0 }}
                transition={{ duration: reduce ? 0 : 0.12 }}
              >
                {items.map((src) => (
                  <button type="button" key={src} className="df-matmenu-lib-item" title={stickerTitle(src)} onClick={() => onAdd(src)}>
                    <StickerTile src={src} />
                  </button>
                ))}
              </motion.div>
            </AnimatePresence>
            <div className="df-matmenu-tabs" role="tablist" aria-label="Sticker categories">
              {LIB_TABS.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  role="tab"
                  aria-selected={t.id === cat}
                  className={t.id === cat ? 'df-matmenu-tab is-active' : 'df-matmenu-tab'}
                  onClick={() => setCat(t.id)}
                >
                  {t.id === cat && (
                    <motion.span
                      className="df-matmenu-tab-bg"
                      layoutId="df-add-tab-bg"
                      transition={reduce ? { duration: 0 } : { type: 'spring', bounce: 0.2, duration: 0.4 }}
                    />
                  )}
                  <span className="df-matmenu-tab-label">{t.name}</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <button
        type="button"
        className={open ? 'df-add-fab is-open' : 'df-add-fab'}
        aria-label={open ? 'Close sticker picker' : 'Add a sticker to the desk'}
        aria-expanded={open}
        title="Add a sticker"
        onClick={() => onToggle(!open)}
      >
        {/* plus to cross: a 45deg spin of the icon */}
        <motion.svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          animate={{ rotate: open ? 45 : 0 }}
          transition={reduce ? { duration: 0 } : { type: 'spring', bounce: 0.3, duration: 0.4 }}
        >
          <path d="M12 4.5v15M4.5 12h15" />
        </motion.svg>
      </button>
    </motion.div>
  )
}

/** photoreal Polaroid OneStep, pure CSS */
function PolaroidCamera() {
  return (
    <div className="df-polaroid" aria-hidden="true">
      <div className="top">
        <div className="flash" />
        <div className="timer" />
        <div className="sensor" />
        <div className="lens">
          <div className="glass" />
        </div>
        <div className="shutter" />
        <div className="viewfinder">
          <div className="glass">
            <div className="back" />
          </div>
        </div>
        <div className="toggle-container">
          <div className="toggle" />
        </div>
        <div className="power" />
        <div className="title" />
      </div>
      <div className="bottom">
        <div className="toggle-container">
          <div className="toggle">
            <div className="handle" />
          </div>
        </div>
        <div className="printer" />
        <div className="labels">
          <div className="rainbow" />
          <div className="logo">Polaroid</div>
          <div className="type" />
        </div>
      </div>
    </div>
  )
}

// dev-activity monitor: a contribution grid, links to GitHub
const DEV_GRID_COLS = 7 // 4 rows x 7 cols, row-major
// levels 0-4 map to the Less-to-More palette
const DEV_GRID: number[] = [
  0, 0, 0, 0, 0, 1, 2,
  0, 0, 0, 0, 1, 2, 3,
  0, 0, 0, 1, 2, 3, 4,
  0, 0, 1, 1, 2, 3, 3,
]

/** dev-activity monitor; click target is a real link */
function DevMonitor({ href }: { href: string }) {
  return (
    <a
      className="df-monitor"
      href={href}
      target="_blank"
      rel="noreferrer"
      draggable={false}
      aria-label="View GitHub activity"
      title="Open GitHub · hold to move"
    >
      <span className="df-ipad-device" aria-hidden="true">
        <img className="df-ipad-shell" src="/stickers/devices/github-ipad.svg" alt="" draggable={false} decoding="async" />
        <span className="df-ipad-screen">
          {/* tracker UI as SVG so it scales to the screen */}
          <svg className="df-ipad-ui" viewBox="0 0 264 201" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
            <defs>
              <radialGradient id="df-ui-bg" cx="0" cy="0" r="1" gradientTransform="matrix(324 0 0 231 74 0)" gradientUnits="userSpaceOnUse">
                <stop offset="0" stopColor="#21303f" />
                <stop offset="0.68" stopColor="#121c28" />
                <stop offset="1" stopColor="#0c141d" />
              </radialGradient>
              <linearGradient id="df-ui-glare" x1="0" y1="0" x2="112" y2="88" gradientUnits="userSpaceOnUse">
                <stop offset="0" stopColor="#ffffff" stopOpacity="0.12" />
                <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
              </linearGradient>
              <filter id="df-ui-glow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="1.4" result="b" />
                <feMerge>
                  <feMergeNode in="b" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            <rect className="df-ui-bg" x="0" y="0" width="264" height="201" rx="14" />
            <path className="df-ui-glare" d="M0 0H142L0 104Z" />
            <text className="df-ui-title" x="16" y="24">dev activity</text>
            <circle className="df-ui-dot" cx="221" cy="19.5" r="4" filter="url(#df-ui-glow)" />
            <text className="df-ui-streak" x="248" y="24">32</text>
            {DEV_GRID.map((lvl, i) => {
              const col = i % DEV_GRID_COLS
              const row = Math.floor(i / DEV_GRID_COLS)
              return (
                <rect
                  key={i}
                  className="df-ui-cell"
                  data-lvl={lvl}
                  x={21 + col * 33}
                  y={50 + row * 31}
                  width="24"
                  height="24"
                  rx="9"
                  filter={lvl === 4 ? 'url(#df-ui-glow)' : undefined}
                />
              )
            })}
            <g className="df-ui-tags">
              <rect x="16" y="182" width="40" height="15" rx="7.5" />
              <text x="36" y="192.6">React</text>
              <rect x="61" y="182" width="29" height="15" rx="7.5" />
              <text x="75.5" y="192.6">SVG</text>
              <rect x="95" y="182" width="47" height="15" rx="7.5" />
              <text x="118.5" y="192.6">Motion</text>
            </g>
          </svg>
        </span>
      </span>
    </a>
  )
}

/** workspace lamp, rendered above the book */
const LAMP_ITEM = STICKER_SETS.find((s) => s.id === 'workspace')?.items.find((it) => it.lamp)
const LAMP_DEFAULT_SCALE = 1.15
const LAMP_DEFAULT_ROTATE = 10

type CoverTheme = { id: string; name: string; base: string; ink: 'light' | 'dark' }
const SAGE_COVER_THEME: CoverTheme = { id: 'sage', name: 'Sage', base: '#9fc59f', ink: 'dark' }

/** cover gradient + ink vars from base colour */
function coverVars(theme: CoverTheme): React.CSSProperties {
  return {
    '--df-cover-1': `color-mix(in srgb, ${theme.base}, white 14%)`,
    '--df-cover-2': theme.base,
    '--df-cover-3': `color-mix(in srgb, ${theme.base}, black 16%)`,
    '--df-cover-ink': theme.ink === 'light' ? '#eef3f1' : '#5b4a52',
  } as React.CSSProperties
}

// desk surfaces; cutting-mats share a white grid
const matBg = (r1: string, r2: string, r3: string) =>
  [
    'repeating-linear-gradient(0deg, rgba(255,255,255,0.11) 0 1px, transparent 1px 112px)',
    'repeating-linear-gradient(90deg, rgba(255,255,255,0.11) 0 1px, transparent 1px 112px)',
    'repeating-linear-gradient(0deg, rgba(255,255,255,0.05) 0 1px, transparent 1px 28px)',
    'repeating-linear-gradient(90deg, rgba(255,255,255,0.05) 0 1px, transparent 1px 28px)',
    `radial-gradient(130% 120% at 50% 0%, ${r1} 0%, ${r2} 70%, ${r3} 100%)`,
  ].join(', ')

const GREEN_MAT_STYLE = {
  backgroundColor: '#2f6f5b',
  backgroundImage: matBg('#347a64', '#285446', '#20473b'),
  '--df-cast': 'rgba(15, 30, 24, 0.5)',
} as React.CSSProperties

// warm only the "+" panel's first tab on idle
const DESKFOLIO_LIBRARY_WARM_SRCS: string[] = STICKER_LIBRARY.filter(
  (src) => !src.startsWith('__component:') && CAT_OF.get(src) === LIB_TABS[0].id,
)

// phone peel-sticker pool
const MOBILE_STICKER_POOL = [
  'sticker-cutie-bear.svg', 'sticker-cutie-chick.svg', 'sticker-cutie-pig.svg', 'sticker-cutie-snail.svg',
  'sticker-cutie-cat-meow.svg', 'sticker-cutie-cat-wiggle.svg', 'sticker-cutie-sleepy-bunny.svg',
  'sticker-cutie-sleepy-kitty.svg', 'sticker-cutie-rainbow-cloud.svg', 'sticker-cutie-unicorn-float.svg',
  'sticker-cutie-flower-smile.svg', 'sticker-cutie-gift.svg', 'sticker-cutie-rocket.svg', 'sticker-cutie-apple.svg',
  'sticker-cutie-cherry-mug.svg', 'sticker-cutie-poppies.svg', 'sticker-cutie-tulip-heart.svg',
  'sticker-cutie-gameboy.svg', 'sticker-cutie-sneaker.svg', 'sticker-plant-succulent.svg', 'sticker-plant-2.svg',
]

/** pick two distinct peel-stickers, avoiding the current pair */
function pickMobileStickers(prev?: [string, string]): [string, string] {
  const avoid = new Set(prev ?? [])
  const pool = MOBILE_STICKER_POOL.filter((s) => !avoid.has(s))
  const a = pool[Math.floor(Math.random() * pool.length)]
  const rest = MOBILE_STICKER_POOL.filter((s) => s !== a && !avoid.has(s))
  const b = (rest.length ? rest : MOBILE_STICKER_POOL.filter((s) => s !== a))[
    Math.floor(Math.random() * (rest.length ? rest.length : MOBILE_STICKER_POOL.length - 1))
  ]
  return [a, b]
}

// mat-unroll intro: two black panels slide apart
function MatRollIntro() {
  // brief hold, then a weighty ease-out as the rollers travel off
  const roll = { type: 'spring', bounce: 0.07, duration: 0.72, delay: 0.1 } as const
  return (
    <div className="df-rollintro" aria-hidden="true">
      <motion.div className="df-roll df-roll-l" initial={{ x: 0 }} animate={{ x: '-100.5%' }} transition={roll}>
        <span className="df-roll-rod">
          <span className="df-roll-sheen" />
        </span>
      </motion.div>
      <motion.div className="df-roll df-roll-r" initial={{ x: 0 }} animate={{ x: '100.5%' }} transition={roll}>
        <span className="df-roll-rod">
          <span className="df-roll-sheen" />
        </span>
      </motion.div>
    </div>
  )
}

// book content packs
// ships as a portfolio; journal pack kept below (flip SHOW_JOURNAL)
const SHOW_JOURNAL = false

// brand glyphs for the contact page
const IconGitHub = (p: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...p}>
    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
  </svg>
)
const IconInstagram = (p: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...p}>
    <path d="M7.8 2h8.4A5.8 5.8 0 0 1 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8A5.8 5.8 0 0 1 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2Zm0 2A3.8 3.8 0 0 0 4 7.8v8.4A3.8 3.8 0 0 0 7.8 20h8.4a3.8 3.8 0 0 0 3.8-3.8V7.8A3.8 3.8 0 0 0 16.2 4H7.8Zm4.2 3.2A4.8 4.8 0 1 1 12 16.8a4.8 4.8 0 0 1 0-9.6Zm0 2A2.8 2.8 0 1 0 12 14.8a2.8 2.8 0 0 0 0-5.6Zm5.05-2.45a1.2 1.2 0 1 1 0 2.4a1.2 1.2 0 0 1 0-2.4Z" />
  </svg>
)
const IconLinkedIn = (p: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...p}>
    <path d="M20.45 20.45h-3.56v-5.58c0-1.33-.03-3.04-1.85-3.04c-1.85 0-2.14 1.45-2.14 2.94v5.68H9.35V9h3.41v1.56h.05a3.74 3.74 0 0 1 3.36-1.85c3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.13a2.06 2.06 0 0 1 0 4.13Zm1.78 13.02H3.56V9h3.56v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0Z" />
  </svg>
)

// portfolio pack (shown)
const PORTFOLIO_COVER = (
  <div className="df-cover">
    <span className="df-cover-band" aria-hidden="true" />
    <div className="df-cover-label">
      <span className="df-cover-mark" aria-hidden="true">
        <span className="df-cover-mono">OG</span>
        <svg className="df-cover-cursor" viewBox="0 0 24 24" fill="currentColor">
          <path d="M4.037 4.688a.495.495 0 0 1 .651-.651l16 6.5a.5.5 0 0 1-.063.947l-6.124 1.58a2 2 0 0 0-1.438 1.435l-1.579 6.126a.5.5 0 0 1-.947.063z" />
        </svg>
      </span>
      <p className="df-cover-title">Om Gupta</p>
      <span className="df-cover-sub">AI + robotics</span>
      <span className="df-cover-lines" aria-hidden="true" />
    </div>
    <span className="df-cover-hint">tap to open <span className="df-heart" aria-hidden="true">♡</span></span>
  </div>
)

// closing is the final page (p7), not a backCover

const PORTFOLIO_PAGES: React.ReactNode[] = [
  // spread 1 left: about
  <div className="df-page" key="p0">
    <LbSparkle className="df-doodle" style={{ top: 2, right: 6, width: 16, height: 16 }} />
    {/* soft doodle cluster, lower-right */}
    <LbHeart className="df-doodle df-doodle--soft" style={{ bottom: 118, right: 26, width: 27, height: 27, transform: 'rotate(-12deg)' }} />
    <LbSparkle className="df-doodle df-doodle--soft df-doodle--lilac" style={{ bottom: 165, right: 74, width: 14, height: 14 }} />
    <h3 className="df-hello">about me <span className="df-heart" aria-hidden="true">♡</span></h3>
    <div className="df-about-head">
      <span className="df-avatar"><img src="/mort-profile.webp" alt="Om Gupta" loading="lazy" decoding="async" /></span>
      <div>
        <Editable className="df-name" placeholder="your name" initial="Om Gupta" />
        <span className="df-role"><LbSparkle /> AI-first builder</span>
      </div>
    </div>
    <div className="df-card">
      <Editable
        className="df-edit--body"
        placeholder="a little about you…"
        initial="I build AI-first products that turn messy real-world problems into useful, working systems - from intelligent web apps to robotics that can listen, reason, and respond."
      />
    </div>
    <p className="df-label df-label--push">currently…</p>
    <span className="df-date"><LbHeart /> B.Tech CSE AIML - SMIT</span>
    <span className="df-date"><LbSparkle /> Diploma in Robotics - VES Polytechnic</span>
  </div>,
  // spread 1 right: skills
  <div className="df-page" key="p1">
    <LbCloud className="df-doodle df-doodle--lilac" style={{ top: 0, right: 4, width: 26, height: 26 }} />
    {/* soft doodles, lower half */}
    <LbHeart className="df-doodle df-doodle--soft" style={{ bottom: 96, right: 34, width: 26, height: 26, transform: 'rotate(10deg)' }} />
    <LbSparkle className="df-doodle df-doodle--soft df-doodle--lilac" style={{ bottom: 150, left: 14, width: 18, height: 18 }} />
    <LbCloud className="df-doodle df-doodle--soft df-doodle--mint" style={{ bottom: 60, left: 30, width: 24, height: 24 }} />
    <h3 className="df-hello df-hello--lilac">skills</h3>
    <div className="df-card df-card--lilac">
      <p className="df-card-title"><LbSparkle /> i build with</p>
      <ul className="df-tags">
        <li className="df-tag">Go</li>
        <li className="df-tag">React</li>
        <li className="df-tag">TypeScript</li>
        <li className="df-tag">Python</li>
        <li className="df-tag">PostgreSQL</li>
        <li className="df-tag">FastAPI</li>
        <li className="df-tag">Docker</li>
        <li className="df-tag">Electron</li>
      </ul>
    </div>
    <div className="df-card">
      <p className="df-card-title"><LbHeart /> AI stack</p>
      <ul className="df-tags df-tags--blush">
        <li className="df-tag">LangChain</li>
        <li className="df-tag">Gemini</li>
        <li className="df-tag">TensorFlow</li>
        <li className="df-tag">Robotics</li>
        <li className="df-tag">Kafka</li>
        <li className="df-tag">KiCad</li>
      </ul>
    </div>
  </div>,
  // spread 2 left: selected work
  <div className="df-page" key="p2">
    <h3 className="df-hello">everything i built</h3>
    <div className="df-proj">
      <p className="df-proj-head"><DfProjName href="https://portfolio-template.buildc3.tech/" variant={0}>Explainable AI</DfProjName><span className="df-proj-meta">Python · SHAP · LIME</span></p>
      <Editable className="df-edit--body df-proj-desc" placeholder="describe it…" initial="Random Forest Titanic model with feature dependencies, SHAP values, feature importance, and decision-boundary interpretation." />
    </div>
    <div className="df-proj">
      <p className="df-proj-head"><DfProjName href="https://portfolio-template.buildc3.tech/" variant={2}>HireScout</DfProjName><span className="df-proj-meta">Gemini · LangChain</span></p>
      <Editable className="df-edit--body df-proj-desc" placeholder="describe it…" initial="Mock interview platform with resume parsing, real-time voice interviews, and personalized AI feedback, scaled to 1,200 daily users." />
    </div>
    <div className="df-proj">
      <p className="df-proj-head"><DfProjName href="https://portfolio-template.buildc3.tech/" variant={1}>BillBot</DfProjName><span className="df-proj-meta">FastAPI · PostgreSQL</span></p>
      <Editable className="df-edit--body df-proj-desc" placeholder="describe it…" initial="Telegram bill-management bot that parses bill images with Gemini, stores structured OCR data, and serves live bill tracking." />
    </div>
  </div>,
  // spread 2 right: more work
  <div className="df-page" key="p3">
    <LbSparkle className="df-doodle df-doodle--butter" style={{ bottom: 16, right: 12, width: 22, height: 22 }} />
    <h3 className="df-hello df-hello--lilac">more work</h3>
    <div className="df-proj">
      <p className="df-proj-head"><DfProjName href="https://portfolio-template.buildc3.tech/" variant={3}>EchoDcrypt</DfProjName><span className="df-proj-meta">Canvas · Electron</span></p>
      <Editable className="df-edit--body df-proj-desc" placeholder="describe it…" initial="Client-side LSB steganography tool for hiding and extracting messages in images and videos without data leaving the device." />
    </div>
    <div className="df-proj">
      <p className="df-proj-head"><DfProjName href="https://portfolio-template.buildc3.tech/" variant={1}>NeuroDB</DfProjName><span className="df-proj-meta">PostgreSQL · Gemini</span></p>
      <Editable className="df-edit--body df-proj-desc" placeholder="describe it…" initial="AI-powered PostgreSQL desktop manager with natural-language SQL, schema context, DBML diagrams, snippets, exports, and 25,000+ active users." />
    </div>
    <div className="df-proj">
      <p className="df-proj-head"><DfProjName href="https://portfolio-template.buildc3.tech/" variant={0}>ProjectNest</DfProjName><span className="df-proj-meta">React · Go</span></p>
      <Editable className="df-edit--body df-proj-desc" placeholder="describe it…" initial="AI-enhanced project management platform with JWT auth, visual collaboration, and a DevSprint-AI assistant." />
    </div>
  </div>,
  // spread 3 left: experience timeline
  <div className="df-page" key="p4">
    <h3 className="df-hello">experience</h3>
    <ul className="df-xp">
      <li className="df-xp-row">
        <span className="df-xp-dot" aria-hidden="true" />
        <div>
          <p className="df-xp-role">Software Engineering Intern</p>
          <p className="df-xp-meta">Pi-Labs · Go, PostgreSQL, Docker, JWT/RBAC, AI/audio workflows.</p>
        </div>
      </li>
      <li className="df-xp-row">
        <span className="df-xp-dot" aria-hidden="true" />
        <div>
          <p className="df-xp-role">Software Engineering Simulation</p>
          <p className="df-xp-meta">J.P. Morgan Chase &amp; Co. · Spring Boot, Kafka, JPA, H2, REST APIs.</p>
        </div>
      </li>
      <li className="df-xp-row">
        <span className="df-xp-dot" aria-hidden="true" />
        <div>
          <p className="df-xp-role">GenAI Job Simulation</p>
          <p className="df-xp-meta">Boston Consulting Group · AI financial chatbot using Python, pandas, and SEC filings.</p>
        </div>
      </li>
      <li className="df-xp-row">
        <span className="df-xp-dot" aria-hidden="true" />
        <div>
          <p className="df-xp-role">AI &amp; Robotics Developer</p>
          <p className="df-xp-meta">iHub SMIT · SmitBot on Raspberry Pi 5 with LLaMA, Piper TTS, STT, and servo gestures.</p>
        </div>
      </li>
    </ul>
  </div>,
  // spread 3 right: achievements
  <div className="df-page" key="p5">
    <LbHeart className="df-doodle" style={{ top: 2, right: 6, width: 16, height: 16 }} />
    <h3 className="df-hello df-hello--lilac">achievements</h3>
    <ul className="df-checklist">
      <CheckItem placeholder="…" initial="Devopia'24 - 1st Position for an autonomous Drone Delivery System." />
      <CheckItem placeholder="…" initial="Techno-Innova'23 - 1st Position for AI predictive maintenance research." />
      <CheckItem placeholder="…" initial="Technothon'21 - 1st Position for an AI-powered Stock Management System." />
      <CheckItem placeholder="…" initial="Protech 2023 - 1st Position for an IoT agriculture soil examining system." />
    </ul>
  </div>,
  // spread 4 left: stats + links
  <div className="df-page" key="p6">
    <LbSparkle className="df-doodle df-doodle--mint" style={{ top: 2, right: 6, width: 16, height: 16 }} />
    <h3 className="df-hello">stats + links</h3>
    <div className="df-card">
      <ul className="df-tags">
        <li className="df-tag">10+ projects</li>
        <li className="df-tag">40k+ users</li>
        <li className="df-tag">10+ national awards</li>
      </ul>
    </div>
    <ul className="df-links">
      <li>
        <a className="df-link" href="https://github.com/Omzee15" target="_blank" rel="noreferrer"><IconGitHub /> GitHub</a>
      </li>
      <li>
        <a className="df-link" href="https://www.linkedin.com/in/om-gupta915/" target="_blank" rel="noreferrer"><IconLinkedIn /> LinkedIn</a>
      </li>
      <li>
        <a className="df-link" href="https://instagram.com/om_gupta915" target="_blank" rel="noreferrer"><IconInstagram /> Instagram</a>
      </li>
    </ul>
    <p className="df-sig">buildc3.tech <span className="df-heart" aria-hidden="true">♡</span></p>
  </div>,
  // spread 4 right: closing finale
  <div className="df-page df-thanks" key="p7">
    <LbSparkle className="df-thanks-spark" />
    <p className="df-thanks-title">thanks for reading <span className="df-heart" aria-hidden="true">♡</span></p>
    <span className="df-thanks-sub">let's make something</span>
  </div>,
]

// journal pack (preserved, hidden)
const JOURNAL_COVER = (
  <div className="df-cover">
    <span className="df-cover-band" aria-hidden="true" />
    <div className="df-cover-label">
      <LbHeart className="df-cover-heart" />
      <p className="df-cover-title">my journal</p>
      <span className="df-cover-sub">est. today</span>
      <span className="df-cover-lines" aria-hidden="true" />
    </div>
    <span className="df-cover-hint">tap to open <span className="df-heart" aria-hidden="true">♡</span></span>
  </div>
)

const JOURNAL_BACK_COVER = (
  <div className="df-end">
    <LbSparkle className="df-cover-doodle" style={{ width: 24, height: 24 }} />
    <p className="df-end-title">the end <span className="df-heart" aria-hidden="true">♡</span></p>
    <span className="df-end-sub">see you tomorrow</span>
  </div>
)

const JOURNAL_PAGES: React.ReactNode[] = [
  // spread 1 left: entry + mood
  <div className="df-page" key="p0">
    <LbSparkle className="df-doodle" style={{ top: 2, right: 6, width: 16, height: 16 }} />
    <h3 className="df-hello">hello <span className="df-heart" aria-hidden="true">♡</span></h3>
    <span className="df-date"><LbCal /> Tuesday, June 4</span>
    <div className="df-card">
      <p className="df-card-title"><LbHeart /> dear diary</p>
      <Editable
        className="df-edit--body"
        placeholder="write your day…"
        initial="Woke up before my alarm and didn't even mind. Walked to the café in the drizzle for the oat latte, then watched the rain start and stop twice. A small day. A good one."
      />
    </div>
    <p className="df-label">today i feel…</p>
    <MoodFaces />
  </div>,
  // spread 1 right: grateful list
  <div className="df-page" key="p1">
    <LbCloud className="df-doodle df-doodle--lilac" style={{ top: 0, right: 4, width: 26, height: 26 }} />
    <h3 className="df-hello df-hello--lilac">grateful for</h3>
    <div className="df-card df-card--lilac">
      <ul className="df-checklist">
        <CheckItem placeholder="…" initial="rain sounds on the window" />
        <CheckItem placeholder="…" initial="matching socks, finally" />
        <CheckItem placeholder="…" initial="grandma's voice on the phone" />
      </ul>
    </div>
    <p className="df-sig">little things, mostly <span className="df-heart" aria-hidden="true">♡</span></p>
  </div>,
  // spread 2 left: a captured moment
  <div className="df-page" key="p2">
    <h3 className="df-hello">a moment</h3>
    <div className="df-photo">
      <img className="df-photo-img" src="/stickers/journal-polaroid-memory.svg" alt="A dreamy pastel memory from today" loading="lazy" decoding="async" />
      <p className="df-photo-cap">a little pastel pause ~</p>
    </div>
    <Editable
      className="df-edit--quote"
      placeholder="remember it…"
      initial="I saved this because it felt like the day was being soft on purpose. Everything looked minty and warm for a second, like a tiny scene I could fold up and keep between these pages."
    />
  </div>,
  // spread 2 right: tomorrow's checklist
  <div className="df-page" key="p3">
    <h3 className="df-hello df-hello--lilac">tomorrow</h3>
    <div className="df-card df-card--lilac">
      <p className="df-card-title"><LbBell /> to do</p>
      <ul className="df-checklist">
        <CheckItem placeholder="add a task…" initial="water the poor basil" />
        <CheckItem placeholder="add a task…" initial="text maya back!!" />
        <CheckItem placeholder="add a task…" initial="finish the blue sweater" />
        <CheckItem placeholder="add a task…" />
      </ul>
    </div>
  </div>,
  // spread 3 left: this week's highlights
  <div className="df-page" key="p4">
    <LbSparkle className="df-doodle df-doodle--butter" style={{ bottom: 16, right: 12, width: 22, height: 22 }} />
    <h3 className="df-hello">this week</h3>
    <div className="df-card">
      <p className="df-card-title"><LbSparkle /> highlights</p>
      <ul className="df-checklist">
        <CheckItem placeholder="…" initial="morning walk, no phone" />
        <CheckItem placeholder="…" initial="finished the book i kept restarting" />
        <CheckItem placeholder="…" initial="pancakes that didn't burn" />
      </ul>
    </div>
  </div>,
  // spread 3 right: a line you liked
  <div className="df-page" key="p5">
    <h3 className="df-hello df-hello--lilac">a line i liked</h3>
    <Editable
      className="df-edit--quote"
      placeholder="paste a favourite line…"
      initial="“Almost everything will work again if you unplug it for a few minutes — including you.”"
    />
    <p className="df-sig">anne lamott</p>
  </div>,
]

/** classic click-wheel iPod, pure CSS */
function MiniPod() {
  return (
    <div className="ipod">
      <div className="screen">
        <div className="battery" />
        <ul className="menu">
          <li className="s">Music</li>
          <li className="s">Extras</li>
          <li className="s">Settings</li>
          <li className="active">Shuffle Songs</li>
          <li>Backlight</li>
        </ul>
      </div>
      <div className="clickwheel">
        <button type="button" tabIndex={-1} className="clickwheel-button menu-button">Menu</button>
        <button type="button" tabIndex={-1} className="clickwheel-button rw">≪</button>
        <button type="button" tabIndex={-1} className="clickwheel-button ff">≫</button>
        <button type="button" tabIndex={-1} className="clickwheel-button pp"><span>▶</span>❚❚</button>
      </div>
    </div>
  )
}

// shared spring for the staged reveal
const STAGE_SPRING = { type: 'spring', bounce: 0.22, duration: 0.55 } as const

/** self-contained DeskFolio demo */
export function DeskFolioPage() {
  // size the spread to the column
  const [viewport, setViewport] = useState(() => ({
    w: typeof window === 'undefined' ? 1200 : window.innerWidth,
    h: typeof window === 'undefined' ? 900 : window.innerHeight,
  }))
  useEffect(() => {
    let frame = 0
    const measure = () => {
      frame = 0
      const next = { w: window.innerWidth, h: window.innerHeight }
      setViewport((prev) => (prev.w === next.w && prev.h === next.h ? prev : next))
    }
    const on = () => {
      if (frame) return
      frame = window.requestAnimationFrame(measure)
    }
    window.addEventListener('resize', on)
    return () => {
      window.removeEventListener('resize', on)
      if (frame) window.cancelAnimationFrame(frame)
    }
  }, [])

  // staged intro reveal: mat, book, stickers, controls
  // intro gates content stages (1=book, 2=stickers, 3=controls); matDown drops the roll overlay
  const reduce = useReducedMotion()
  const [intro, setIntro] = useState(reduce ? 3 : 0)
  const [matDown, setMatDown] = useState(reduce)
  useEffect(() => {
    if (reduce) {
      setIntro(3)
      setMatDown(true)
      return
    }
    const timers = [
      window.setTimeout(() => setIntro(1), 700), // 1: book blooms
      window.setTimeout(() => setMatDown(true), 880), // unmount the roll overlay
      window.setTimeout(() => setIntro(2), 980), // 2: stickers drop in
      window.setTimeout(() => setIntro(3), 1240), // 3: controls bloom in
    ]
    return () => timers.forEach((t) => window.clearTimeout(t))
  }, [reduce])


  // phones: full-screen one-page reader, driven by media query
  const [compact, setCompact] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(max-width: 760px)').matches,
  )
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 760px)')
    const on = () => setCompact(mq.matches)
    on()
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [])

  // a touch larger now that the desktop canvas is dedicated to the workspace mat
  const spread = Math.min(880, Math.round(viewport.w * 0.88))
  const pageW = Math.max(150, Math.round(spread / 2))
  const pageH = Math.round(pageW * 1.34)
  const stageScale = Math.min(1, viewport.h / (pageH + 376))

  // phones render the same desktop DeskFolio, scaled to fit, one page at a time
  const M_PAGE_W = 380 // desktop default page size
  const M_PAGE_H = 509
  // focused right page width: 80% of screen, capped by height
  const mRightW = Math.min(viewport.w * 0.8, (viewport.h * 0.5) / 1.34)
  const mScale = mRightW / M_PAGE_W
  const mobile = { pageW: M_PAGE_W, pageH: M_PAGE_H, scale: mScale, w: Math.round(mRightW), h: Math.round(mRightW * 1.34) }

  const coverTheme = SAGE_COVER_THEME
  const bgTheme = GREEN_MAT_STYLE
  // pre-warm reveal images during the mat-roll window
  useEffect(() => {
    const imgs = DESKFOLIO_WARM_SRCS.map(warmImage)
    return () => imgs.forEach((img) => { img.src = '' })
  }, [])
  // after the first reveal, warm the add-sticker first tab on idle
  useEffect(() => {
    let cancelled = false
    let imgs: HTMLImageElement[] = []
    const ric = typeof window.requestIdleCallback === 'function' ? window.requestIdleCallback : null
    const idleIds: number[] = []
    const timeoutIds: number[] = []

    const schedule = (cb: IdleRequestCallback, timeout = 2500) => {
      if (ric) {
        idleIds.push(ric(cb, { timeout }) as number)
        return
      }
      timeoutIds.push(
        window.setTimeout(() => cb({ didTimeout: true, timeRemaining: () => 0 } as IdleDeadline), 80),
      )
    }

    const warmChunked = (srcs: string[], done?: () => void) => {
      let index = 0
      const step: IdleRequestCallback = (deadline) => {
        if (cancelled) return
        let count = 0
        while (index < srcs.length && (count < 4 || deadline.timeRemaining() > 8)) {
          imgs.push(warmImage(srcs[index++]))
          count += 1
        }
        if (index < srcs.length) schedule(step, 3000)
        else done?.()
      }
      schedule(step)
    }

    const start = () => warmChunked(DESKFOLIO_LIBRARY_WARM_SRCS)

    if (ric) idleIds.push(ric(start, { timeout: 2500 }) as number)
    else timeoutIds.push(window.setTimeout(start, 1600))

    return () => {
      cancelled = true
      if (ric && typeof window.cancelIdleCallback === 'function') idleIds.forEach((id) => window.cancelIdleCallback(id))
      timeoutIds.forEach((id) => window.clearTimeout(id))
      imgs.forEach((img) => { img.src = '' })
    }
  }, [])
  const stickerSet = 'workspace'
  const [mStickers] = useState<[string, string]>(() => pickMobileStickers())
  const [lampOn, setLampOn] = useState(false)
  // shared mat-object edit state
  const [matOverrides, setMatOverrides] = useState<Record<string, MatOverride>>({
    'desk-lamp': { scale: LAMP_DEFAULT_SCALE, rotate: LAMP_DEFAULT_ROTATE },
  })
  const [activeMatKey, setActiveMatKey] = useState<string | null>(null)
  // user-added stickers, persist across set switches
  const [added, setAdded] = useState<Array<{ key: string; src: string }>>([])
  const addSeqRef = useRef(0)
  const [addOpen, setAddOpen] = useState(false)
  const addSticker = useCallback((src: string) => {
    setAdded((prev) => [...prev, { key: `added-${addSeqRef.current++}`, src }])
    setAddOpen(false)
    setActiveMatKey(null)
  }, [])
  const matEdit = useMemo<MatEditApi>(() => {
    // srcs on this set's desk, excluded from Replace
    const set = STICKER_SETS.find((s) => s.id === stickerSet)
    const tableSrcs = new Set<string>()
    set?.items.forEach((it, i) => {
      if (it.lamp) return
      const ov = matOverrides[`${set.id}-${i}-${it.src}`]
      if (ov?.deleted) return
      tableSrcs.add(ov?.src ?? it.src)
    })
    return {
      activeKey: activeMatKey,
      // opening an edit menu closes the Add panel
      setActiveKey: (key) => {
        setActiveMatKey(key)
        if (key) setAddOpen(false)
      },
      overrides: matOverrides,
      patch: (key, partial) => setMatOverrides((prev) => ({ ...prev, [key]: { ...prev[key], ...partial } })),
      remove: (key) => setMatOverrides((prev) => ({ ...prev, [key]: { ...prev[key], deleted: true } })),
      tableSrcs,
    }
  }, [activeMatKey, matOverrides, stickerSet])
  useEffect(() => {
    if (!activeMatKey) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActiveMatKey(null)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [activeMatKey])
  const devActivityOverride = matOverrides['dev-activity']
  const lampOverride = matOverrides['desk-lamp']

  // book content: portfolio pack (journal pack preserved)
  const cover = SHOW_JOURNAL ? JOURNAL_COVER : PORTFOLIO_COVER
  // portfolio has no back cover; journal keeps its end leaf
  const backCover = SHOW_JOURNAL ? JOURNAL_BACK_COVER : undefined
  const pages = SHOW_JOURNAL ? JOURNAL_PAGES : PORTFOLIO_PAGES
  // phone book: a blank verso before every content page
  const mobilePages = useMemo(() => {
    const out: React.ReactNode[] = []
    for (const p of pages) {
      out.push(null) // blank left page (verso)
      out.push(p) // focused right page
    }
    return out
  }, [pages])

  return (
    <>
      <section className="deskfolio-live">
        <div
          className="demo-stage deskfolio-demo-stage"
          style={
            {
              '--df-stage-scale': stageScale,
              ...bgTheme,
            } as React.CSSProperties
          }
        >
          <MatEditContext.Provider value={matEdit}>
          {/* tap-to-close backdrop behind menu/Add panel */}
          {(activeMatKey || addOpen) && (
            <div
              className="df-matmenu-backdrop"
              aria-hidden="true"
              onPointerDown={() => { setActiveMatKey(null); setAddOpen(false) }}
            />
          )}
          {!matDown && <MatRollIntro />}
          {/* mounted once the mat is down; desktop only */}
          {intro >= 2 && !compact && <MatStickers setId={stickerSet} compact={compact} />}
          {/* user-added stickers */}
          {intro >= 2 && !compact && added.length > 0 && <AddedStickers added={added} />}
          {/* the + FAB + library panel, desktop only */}
          {intro >= 3 && !compact && (
            <AddStickerControl
              open={addOpen}
              onToggle={(v) => { haptic('selection'); setAddOpen(v); if (v) setActiveMatKey(null) }}
              onAdd={(src) => { haptic('nudge'); addSticker(src) }}
            />
          )}
          {/* phones: a few decorative peel-stickers */}
          {intro >= 2 && compact && (
            <>
              <div className="df-mstickers" aria-hidden="true">
                <img className="m3" src={ITM + mStickers[0]} alt="" decoding="async" />
                <img className="m4" src={ITM + mStickers[1]} alt="" decoding="async" />
              </div>
              {/* iPod peeking from the corner */}
              <div className="df-mipod" aria-hidden="true">
                <MiniPod />
              </div>
            </>
          )}
          {/* dev-activity monitor, draggable; tap opens GitHub */}
          {!compact && intro >= 2 && !devActivityOverride?.deleted && (
            <DraggableMatObject
              objectKey="dev-activity"
              editable
              kind="device"
              className="df-sticker-dragger df-monitor-dragger"
              title="Open GitHub · hold to move"
              style={
                {
                  left: '2%',
                  top: '73%',
                  '--df-monitor-scale': devActivityOverride?.scale ?? 0.95,
                  '--df-monitor-rotate': `${-13 + (devActivityOverride?.rotate ?? 0)}deg`,
                } as React.CSSProperties
              }
            >
              <motion.div
                className="df-monitor-mat"
                initial={reduce ? false : { opacity: 0, y: -22 }}
                animate={reduce ? { opacity: 1 } : { opacity: 1, y: 0 }}
                transition={reduce ? { duration: 0 } : { type: 'spring', bounce: 0.4, duration: 0.6, delay: 0.2 }}
              >
                <DevMonitor href={DEFAULT_DEV_ACTIVITY_LINK} />
              </motion.div>
            </DraggableMatObject>
          )}
          <motion.div
            className={compact ? 'df-book-bloom df-book-bloom--mobile' : 'df-book-bloom'}
            initial={false}
            animate={
              reduce
                ? { opacity: 1, y: 0, scale: 1 }
                : { opacity: intro >= 1 ? 1 : 0, y: intro >= 1 ? 0 : 12, scale: intro >= 1 ? 1 : 0.94 }
            }
            transition={reduce ? { duration: 0 } : STAGE_SPRING}
          >
            {compact ? (
              // phones: framed so only the right page shows
              <div className="df-mobile-scaler" style={{ width: mobile.w, height: mobile.h }}>
                <div className="df-mobile-scaler-inner" style={{ transform: `scale(${mobile.scale})`, left: -mobile.w }}>
                  <DeskFolio
                    cover={cover}
                    pages={mobilePages}
                    closeOnEnd={!SHOW_JOURNAL}
                    closedShift="0%"
                    pageWidth={mobile.pageW}
                    pageHeight={mobile.pageH}
                    style={coverVars(coverTheme)}
                  />
                </div>
              </div>
            ) : (
              <DeskFolio
                cover={cover}
                pages={pages}
                backCover={backCover}
                closeOnEnd={!SHOW_JOURNAL}
                pageWidth={pageW}
                pageHeight={pageH}
                style={coverVars(coverTheme)}
              />
            )}
          </motion.div>
          {/* lamp + beam render above the book */}
          <AnimatePresence>
            {!compact && LAMP_ITEM && !lampOverride?.deleted && (
              <DraggableMatObject
                key="desk-lamp"
                objectKey="desk-lamp"
                editable
                kind="object"
                className="df-sticker-dragger df-lamp-dragger"
                title="Hold to edit lamp"
                style={{ width: scaleCssClamp(LAMP_ITEM.width, lampOverride?.scale ?? 1), ...LAMP_ITEM.pos }}
              >
                <DeskLamp
                  item={{ ...LAMP_ITEM, rotate: LAMP_ITEM.rotate + (lampOverride?.rotate ?? 0) }}
                  index={0}
                  on={lampOn}
                  onToggle={() => setLampOn((v) => !v)}
                  placed
                />
              </DraggableMatObject>
            )}
          </AnimatePresence>
          {/* "tap to light it" hint */}
          {!compact && (
            <AnimatePresence>
              {LAMP_ITEM && !lampOverride?.deleted && !lampOn && intro >= 2 && (
                <motion.div
                  className="df-lamp-hint"
                  aria-hidden="true"
                  initial={reduce ? false : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={reduce ? { opacity: 0 } : { opacity: 0, transition: { duration: 0.22, ease: 'easeIn' } }}
                  transition={reduce ? { duration: 0 } : { duration: 0.55, delay: 0.5 }}
                >
                  <span className="df-lamp-hint-text">tap to<br />light it!</span>
                  <svg className="df-lamp-hint-arrow" viewBox="0 0 96 56" aria-hidden="true">
                    <path d="M7 8C22 29 47 39 78 34" />
                    <path d="M69 24L80 34L66 42" />
                  </svg>
                </motion.div>
              )}
            </AnimatePresence>
          )}
          </MatEditContext.Provider>
        </div>
      </section>

      {compact ? (
        <p className="tagline">
          This component is best experienced on desktop. The desktop preview unlocks the full set of interactions, customizations, and effects.
        </p>
      ) : SHOW_JOURNAL ? (
        <p className="tagline">
          A little book you actually open and write in. Tap the cover and it blooms open, then turn the pages by grabbing a corner and dragging it over. It follows your hand and springs to settle. Every page is yours to write on. No buttons, no images, no engine.
        </p>
      ) : null}
    </>
  )
}
