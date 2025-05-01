import ScannedEnvironmentHeader from './ScannedEnvironmentHeader';
import ScannedEnvironmentTable from './ScannedEnvironmentTable';

const Environment = () => {
  return (
    <div className="p-6 space-y-8">
      <ScannedEnvironmentHeader />
      <ScannedEnvironmentTable />
    </div>
  );
};
export default Environment;
