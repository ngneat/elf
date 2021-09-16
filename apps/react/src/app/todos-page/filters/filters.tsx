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
      <Filter id="SHOW_ALL" onChange={onChange}>
        All
      </Filter>
      <Filter id="SHOW_ACTIVE" onChange={onChange}>
        Active
      </Filter>
      <Filter id="SHOW_COMPLETED" onChange={onChange}>
        Completed
      </Filter>
    </div>
  );
}
