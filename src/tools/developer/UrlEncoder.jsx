import TextTool from '../../components/TextTool.jsx'
const dec = (t) => { try { return decodeURIComponent(t.trim()) } catch { throw new Error('This is not valid percent-encoding (for example a stray % sign).') } }
export default function UrlEncoder() {
  return <TextTool filename="url.txt" rows={5} placeholder="https://example.com/search?q=hello world"
    actions={[
      { label: 'Encode text', run: (t) => encodeURIComponent(t) },
      { label: 'Encode full URL', run: (t) => { try { return encodeURI(t.trim()) } catch { throw new Error('This text contains an invalid character sequence.') } } },
      { label: 'Decode', run: dec },
    ]} />
}
