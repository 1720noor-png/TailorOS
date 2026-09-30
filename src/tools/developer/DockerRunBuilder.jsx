import { useState } from 'react'
import { Field, CopyBtn, Msg } from '../../components/ui.jsx'
export default function DockerRunBuilder() {
  const [image, setImage] = useState('')
  const [ports, setPorts] = useState('')
  const [envs, setEnvs] = useState('')
  const [name, setName] = useState('')
  const [result, setResult] = useState('')
  const [err, setErr] = useState('')
  const generate = () => {
    setErr(''); setResult('')
    if(!image.trim()){setErr('Enter an image name.');return}
    let cmd='docker run -d'
    if(name.trim()) cmd+=' --name '+name.trim()
    if(ports.trim()) ports.split(',').forEach(p=>{cmd+=' -p '+p.trim()})
    if(envs.trim()) envs.split(',').forEach(e=>{cmd+=' -e '+e.trim()})
    cmd+=' '+image.trim()
    setResult(cmd)
  }
  return (
    <div>
      <div className="row">
        <Field label="Image"><input type="text" value={image} onChange={e=>setImage(e.target.value)} placeholder="nginx:latest" /></Field>
        <Field label="Ports (host:container)"><input type="text" value={ports} onChange={e=>setPorts(e.target.value)} placeholder="8080:80" /></Field>
        <Field label="Env Vars (KEY=val, ...)"><input type="text" value={envs} onChange={e=>setEnvs(e.target.value)} placeholder="NODE_ENV=production" /></Field>
        <Field label="Container Name"><input type="text" value={name} onChange={e=>setName(e.target.value)} placeholder="my-app" /></Field>
      </div>
      <div className="actions"><button className="btn" onClick={generate}>Generate</button></div>
      <Msg>{err}</Msg>
      {result && <div className="out" role="status"><pre style={{whiteSpace:'pre-wrap',font:'inherit'}}>{result}</pre><div className="actions"><CopyBtn text={result} /></div></div>}
      <p className="hint">Build docker run commands interactively.</p>
    </div>
  )
}
