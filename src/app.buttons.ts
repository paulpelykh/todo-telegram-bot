import { Markup } from 'telegraf';

export function actionButtons() {
  return Markup.keyboard(
    [
      Markup.button.callback('➕ Add task', 'create'),
      Markup.button.callback('📃 Todo list', 'list'),
      Markup.button.callback('✅ Complete task', 'complete'),
      Markup.button.callback('✏ Edit task', 'edit'),
      Markup.button.callback('❌ Delete task', 'delete'),
    ],
    {
      columns: 2,
    },
  );
}
