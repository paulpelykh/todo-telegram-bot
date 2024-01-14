export const showList = (todos) =>
  'Your todos: \n' +
  `${todos.map((todo) => `${todo.id}. ` + (todo.isCompleted ? '✅' : '⭕') + ` ${todo.name}`).join('\n')}`;
