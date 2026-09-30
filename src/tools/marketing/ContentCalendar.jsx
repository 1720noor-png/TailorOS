import Planner from '../../components/Planner.jsx'
const fields = [
  { k: 'title', label: 'Content idea / title', req: true }, { k: 'date', label: 'Publish date', type: 'date', req: true },
  { k: 'platform', label: 'Platform', options: ['Instagram', 'Facebook', 'LinkedIn', 'X', 'TikTok', 'YouTube', 'Blog', 'Email', 'Other'] },
  { k: 'type', label: 'Content type', options: ['Post', 'Video', 'Story/Reel', 'Article', 'Newsletter', 'Carousel', 'Other'] },
  { k: 'status', label: 'Status', options: ['Idea', 'Drafting', 'Scheduled', 'Published'] },
  { k: 'notes', label: 'Notes' },
]
export default function ContentCalendar() {
  return <Planner storeKey="toolhub.content-calendar" fields={fields} dateKey="date" statusKey="status" doneValue="Published" csv="content-calendar.csv" noun="content item" />
}
