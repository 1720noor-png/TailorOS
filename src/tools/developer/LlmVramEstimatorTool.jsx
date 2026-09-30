import { useState } from 'react'
import { Field, Msg, CopyBtn } from '../../components/ui.jsx'

export default function LlmVramEstimatorTool() {
  const [paramsBillion, setParamsBillion] = useState('7') // 7B, 13B, 70B
  const [quantBits, setQuantBits] = useState('16') // 16 (FP16), 8 (INT8), 4 (INT4)
  const [contextTokens, setContextTokens] = useState('8192')
  const [batchSize, setBatchSize] = useState('1')
  const [kvBits, setKvBits] = useState('16') // KV Cache precision
  const [numLayers, setNumLayers] = useState('32')
  const [numHeads, setNumHeads] = useState('32')
  const [hiddenDim, setHiddenDim] = useState('4096')
  const [overheadFactor, setOverheadFactor] = useState('1.20') // 20% CUDA context & activation buffer
  const [res, setRes] = useState(null)
  const [err, setErr] = useState('')

  const presets = [
    { label: '7B Model (e.g. Llama-3-8B / Mistral-7B)', params: '7', layers: '32', heads: '32', dim: '4096' },
    { label: '13B / 14B Model (e.g. Qwen-14B)', params: '14', layers: '40', heads: '40', dim: '5120' },
    { label: '70B Frontier Model (e.g. Llama-3-70B)', params: '70', layers: '80', heads: '64', dim: '8192' }
  ]

  const applyPreset = (p) => {
    setParamsBillion(p.params)
    setNumLayers(p.layers)
    setNumHeads(p.heads)
    setHiddenDim(p.dim)
  }

  const calc = () => {
    try {
      const P = parseFloat(paramsBillion) * 1e9
      const qB = parseFloat(quantBits)
      const ctx = parseFloat(contextTokens)
      const batch = parseFloat(batchSize)
      const kvB = parseFloat(kvBits)
      const L = parseFloat(numLayers)
      const H = parseFloat(numHeads)
      const D = parseFloat(hiddenDim)
      const overhead = parseFloat(overheadFactor)

      if (isNaN(P) || P <= 0) return setErr('Parameters must be greater than 0.')
      if (isNaN(ctx) || ctx <= 0) return setErr('Context length must be greater than 0.')
      setErr('')

      // 1. Model Weights Memory in GB: (Params * bits_per_param) / 8 / (1024^3)
      const weightBytes = (P * qB) / 8
      const weightGB = weightBytes / (1024 ** 3)

      // 2. KV Cache Memory in GB: 2 * L * (D) * ctx * batch * (kv_bits / 8) / (1024^3)
      // Key and Value matrices per token per layer
      const kvBytes = 2 * L * D * ctx * batch * (kvB / 8)
      const kvGB = kvBytes / (1024 ** 3)

      // 3. Activation & CUDA Context Overhead
      const baseTotalGB = weightGB + kvGB
      const finalTotalGB = baseTotalGB * overhead

      // Recommend GPU Tier
      let recGpu = 'RTX 3060 / 4060 (12 GB VRAM)'
      if (finalTotalGB > 80) recGpu = 'Multi-GPU Cluster (2x–4x H100 / A100 80GB)'
      else if (finalTotalGB > 48) recGpu = 'NVIDIA A100 / H100 (80 GB VRAM)'
      else if (finalTotalGB > 24) recGpu = 'NVIDIA A6000 / RTX 6000 Ada (48 GB VRAM)'
      else if (finalTotalGB > 16) recGpu = 'NVIDIA RTX 3090 / 4090 (24 GB VRAM)'
      else if (finalTotalGB > 12) recGpu = 'NVIDIA RTX 4080 (16 GB VRAM)'

      setRes({
        weightGB: weightGB.toFixed(2),
        kvGB: kvGB.toFixed(2),
        totalGB: finalTotalGB.toFixed(2),
        recGpu,
        copyText: `LLM VRAM Estimate for ${paramsBillion}B (${quantBits}-bit): Weights: ${weightGB.toFixed(2)} GB, KV-Cache (${ctx} tokens): ${kvGB.toFixed(2)} GB, Total Required VRAM: ${finalTotalGB.toFixed(2)} GB. Recommended Hardware: ${recGpu}.`
      })
    } catch (e) {
      setErr(e.message || 'Calculation error.')
    }
  }

  return (
    <div>
      <p style={{ color: 'var(--text-muted, #64748b)', marginBottom: '1.25rem' }}>
        Estimate GPU VRAM memory requirements for local LLM inference and fine-tuning, accounting for parameter quantization (FP16/INT8/INT4), KV-cache length, and CUDA overhead.
      </p>

      <div style={{ marginBottom: '1rem' }}>
        <span style={{ fontSize: '0.9rem', fontWeight: 600, display: 'block', marginBottom: '0.4rem' }}>Model Architecture Preset:</span>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
          {presets.map(p => (
            <button key={p.params} type="button" className="btn ghost" style={{ fontSize: '0.85rem', padding: '0.35rem 0.75rem' }} onClick={() => applyPreset(p)}>
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <div className="row">
        <Field label="Model Parameters (Billions)">
          <input type="number" step="0.5" min="0.1" value={paramsBillion} onChange={(e) => setParamsBillion(e.target.value)} />
        </Field>
        <Field label="Weight Precision (Quantization)">
          <select value={quantBits} onChange={(e) => setQuantBits(e.target.value)}>
            <option value="16">16-bit (FP16 / BF16 - Full Quality)</option>
            <option value="8">8-bit (INT8 - 50% Memory)</option>
            <option value="4">4-bit (GGUF / AWQ / GPTQ - 25% Memory)</option>
          </select>
        </Field>
      </div>

      <div className="row" style={{ marginTop: '0.75rem' }}>
        <Field label="Context Window (Max Tokens)">
          <input type="number" step="1024" min="512" max="131072" value={contextTokens} onChange={(e) => setContextTokens(e.target.value)} />
        </Field>
        <Field label="Concurrent Batch Size">
          <input type="number" min="1" max="128" value={batchSize} onChange={(e) => setBatchSize(e.target.value)} />
        </Field>
      </div>

      <div className="actions" style={{ marginTop: '1.25rem' }}>
        <button className="btn" onClick={calc}>Calculate Required VRAM</button>
      </div>

      <Msg>{err}</Msg>

      {res && (
        <div className="out" role="status" style={{ marginTop: '1.25rem', padding: '1rem', background: 'var(--card-bg, #f8fafc)', borderRadius: '0.5rem', border: '1px solid var(--border-color, #e2e8f0)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <span style={{ fontSize: '0.85rem', color: '#64748b' }}>Model Weights</span>
              <p style={{ fontSize: '1.3rem', fontWeight: 'bold', margin: '0.2rem 0' }}>{res.weightGB} GB</p>
            </div>
            <div>
              <span style={{ fontSize: '0.85rem', color: '#64748b' }}>KV-Cache ({contextTokens} ctx)</span>
              <p style={{ fontSize: '1.3rem', fontWeight: 'bold', margin: '0.2rem 0' }}>{res.kvGB} GB</p>
            </div>
            <div>
              <span style={{ fontSize: '0.85rem', color: '#64748b' }}>Total Minimum VRAM</span>
              <p style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: '0.2rem 0', color: '#0284c7' }}>{res.totalGB} GB</p>
            </div>
          </div>

          <div style={{ padding: '0.75rem', background: '#e0f2fe', borderRadius: '0.375rem', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.85rem', color: '#0369a1', display: 'block' }}>Recommended Hardware Class:</span>
            <strong style={{ fontSize: '1rem', color: '#0c4a6e' }}>{res.recGpu}</strong>
          </div>

          <CopyBtn text={res.copyText} label="Copy Memory Specifications" />
        </div>
      )}
    </div>
  )
}
