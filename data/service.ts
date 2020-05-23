import { Todo } from '../models/Todo.ts';

const generateId = () => Math.round(Math.random() * 1000);

let randomTodos: Todo[] = [];

for (let count = 0; count < 100; count++) {
  const randomId = generateId();
  randomTodos.push({
    id: randomId,
    text: `Some text for todo with id ${randomId}`,
    solved: false,
  });
}

const replaceTodo = (newTodo: Todo): Todo => {
  randomTodos = randomTodos.map((todo: Todo) =>
    todo.id !== newTodo.id ? todo : newTodo
  );

  return newTodo;
};

export const getTodos = (): Todo[] => randomTodos;
export const getTodo = (id: number): Todo | undefined =>
  randomTodos.find((todo: Todo) => todo.id === id);
export const addTodo = (from: Todo): Todo => {
  const todo: Todo = {
    id: generateId(),
    text: from.text,
    solved: !!from?.solved ?? false,
  };

  randomTodos.push(todo);

  return todo;
};
export const updateTodo = (todo: Todo): Todo =>
  getTodo(todo.id) ? replaceTodo(todo) : addTodo(todo);

export const deleteTodo = (id: number): boolean => {
  if (!id) return false;
  const prevLength = randomTodos.length;
  randomTodos = randomTodos.filter((todo: Todo) => todo.id !== id);
  const newLength = randomTodos.length;

  return newLength < prevLength;
};
