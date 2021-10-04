import { TodosProps } from '../todos.repository';

interface FilterProps {
  id: TodosProps['filter'];
  onChange: (filter: FilterProps['id']) => void;
  children: React.ReactNode;
}

export function Filter({ children, onChange, id }: FilterProps) {
  return (
    <button
      className="btn btn-primary"
      onClick={() => onChange(id)}
      style={{ marginLeft: '4px' }}
    >
      {children}
    </button>
  );
}

interface FiltersProps {
  onChange: FilterProps['onChange'];
}

export function Filters({ onChange }: FiltersProps) {
  return (
    <div className="my-2">
      <span>Show: </span>
      <Filter id="ALL" onChange={onChange}>
        All
      </Filter>
      <Filter id="ACTIVE" onChange={onChange}>
        Active
      </Filter>
      <Filter id="COMPLETED" onChange={onChange}>
        Completed
      </Filter>
    </div>
  );
}
