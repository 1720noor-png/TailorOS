import Planner from '../../components/Planner.jsx'
const fields = [
  { k: 'subject', label: 'Subject', req: true }, { k: 'task', label: 'Topic / task', req: true },
  { k: 'date', label: 'Study date', type: 'date', req: true }, { k: 'hours', label: 'Hours', type: 'number' },
  { k: 'status', label: 'Status', options: ['Planned', 'Done'] },
]
export default function StudyPlanner() {
  return <Planner storeKey="toolhub.study" fields={fields} dateKey="date" statusKey="status" doneValue="Done" csv="study-plan.csv" noun="study session" />
}
