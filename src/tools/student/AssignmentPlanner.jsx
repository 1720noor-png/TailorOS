import Planner from '../../components/Planner.jsx'
const fields = [
  { k: 'title', label: 'Title', req: true }, { k: 'subject', label: 'Subject' },
  { k: 'deadline', label: 'Deadline', type: 'date', req: true },
  { k: 'priority', label: 'Priority', options: ['Low', 'Medium', 'High'], def: 'Medium' },
  { k: 'status', label: 'Status', options: ['To do', 'In progress', 'Done'] },
]
export default function AssignmentPlanner() {
  return <Planner storeKey="toolhub.assignments" fields={fields} dateKey="deadline" statusKey="status" doneValue="Done" csv="assignments.csv" noun="assignment" />
}
