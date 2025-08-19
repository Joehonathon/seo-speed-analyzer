import React from 'react'

export default function ScoreBadge({ score, label='Score' }) {
  let cls = 'badge';
  if (score >= 90) cls += ' good'
  else if (score >= 70) cls += ' ok'
  else cls += ' bad'
  return (
    <div className={cls}>
      <div className="value">{score}</div>
      <div className="label">{label}</div>
    </div>
  )
}
