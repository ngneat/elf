import React, { useState } from 'react';
import './add-todo.scss';

export interface AddTodoProps {
  onAdd(text: string): void;
}

export const AddTodo = React.memo(function AddTodo({ onAdd }: AddTodoProps) {
  const [text, setText] = useState('');

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setText(e.target.value);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (text) {
      onAdd(text);
      setText('');
    }
  };

  return (
    <form onSubmit={onSubmit} className="flex">
      <input value={text} onChange={onChange} className="form-control" />
      <button type="submit" className="btn btn-info flex-shrink-0">
        Add Todo
      </button>
    </form>
  );
});
