import { useParams } from 'react-router-dom';
import WorkerComments from '../components/WorkerComments';

const WorkerCommentsPage = () => {
  const { id } = useParams();
  return <WorkerComments workerId={id} />;
};

export default WorkerCommentsPage;
