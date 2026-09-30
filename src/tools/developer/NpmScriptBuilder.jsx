import { useState } from 'react'
import { Field, CopyBtn, Msg } from '../../components/ui.jsx'
export default function NpmScriptBuilder() {
  const [name, setName] = useState('')
  const [cmd, setCmd] = useState('')
  const [pre, setPre] = useState('')
  const [post, setPost] = useState('')
  const [result, setResult] = useState('')
  const [err, setErr] = useState('')
  const generate = () => {
    setErr(''); setResult('')
    if(!name.trim()||!cmd.trim()){setErr('Name and command required.');return}
    const scripts={}
    if(pre.trim()) scripts['pre'+name.trim()]=pre.trim()
    scripts[name.trim()]=cmd.trim()
    if(post.trim()) scripts['post'+name.trim()]=post.trim()
    setResult('"scripts": '+JSON.stringify(scripts,null,2))
  }
  return (
    <div>
      <div className="row">
        <Field label="Script Name"><input type="text" value={name} onChange={e=>setName(e.target.value)} placeholder="dev" /></Field>
        <Field label="Command"><input type="text" value={cmd} onChange={e=>setCmd(e.target.value)} placeholder="vite --host" /></Field>
        <Field label="Pre-script"><input type="text" value={pre} onChange={e=>setPre(e.target.value)} placeholder="" /></Field>
        <Field label="Post-script"><input type="text" value={post} onChange={e=>setPost(e.target.value)} placeholder="" /></Field>
      </div>
      <div className="actions"><button className="btn" onClick={generate}>Generate</button></div>
      <Msg>{err}</Msg>
      {result && <div className="out" role="status"><pre style={{whiteSpace:'pre-wrap',font:'inherit'}}>{result}</pre><div className="actions"><CopyBtn text={result} /></div></div>}
      <p className="hint">Creates package.json script entries.</p>
    </div>
  )
}
