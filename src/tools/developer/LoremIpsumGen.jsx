import { useState } from 'react'
import { Field, CopyBtn, Msg } from '../../components/ui.jsx'
export default function LoremIpsumGen() {
  const [paragraphs, setParagraphs] = useState('3')
  const [result, setResult] = useState('')
  const [err, setErr] = useState('')
  const generate = () => {
    setErr(''); setResult('')
    const n=Math.max(1,parseInt(paragraphs)||3)
    const base='Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.'
    const extras=['Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.','Curabitur pretium tincidunt lacus. Nulla gravida orci a odio. Nullam varius, turpis et commodo pharetra.','Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus.','Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.','Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor. Donec sed odio dui.']
    const paras=[base,...Array.from({length:n-1},(_,i)=>extras[i%extras.length])]
    setResult(paras.slice(0,n).join('\n\n'))
  }
  return (
    <div>
      <div className="row">
        <Field label="Paragraphs"><input type="number" value={paragraphs} onChange={e=>setParagraphs(e.target.value)} placeholder="3" /></Field>
      </div>
      <div className="actions"><button className="btn" onClick={generate}>Generate</button></div>
      <Msg>{err}</Msg>
      {result && <div className="out" role="status"><pre style={{whiteSpace:'pre-wrap',font:'inherit'}}>{result}</pre><div className="actions"><CopyBtn text={result} /></div></div>}
      <p className="hint">Classic Lorem Ipsum placeholder text.</p>
    </div>
  )
}
