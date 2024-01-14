import { AppService } from './app.service';
import {
  Ctx,
  Hears,
  InjectBot,
  Message,
  On,
  Start,
  Update,
} from 'nestjs-telegraf';
import { Telegraf } from 'telegraf';
import { actionButtons } from './app.buttons';
import { Context } from './context.interface';
import { showList } from './app.utils';

const todos = [
  {
    id: 1,
    name: 'Buy goods',
    isCompleted: true,
  },
  {
    id: 2,
    name: 'Go to walk',
    isCompleted: false,
  },
  {
    id: 3,
    name: 'Travel',
    isCompleted: false,
  },
];

@Update()
export class AppUpdate {
  constructor(
    @InjectBot() private readonly bot: Telegraf<Context>,
    private readonly appService: AppService,
  ) {}

  @Start()
  async startCommand(ctx: Context) {
    await ctx.reply('Hi friend');
    await ctx.reply('What do you want?', actionButtons());
  }

  @Hears('📃 Todo list')
  async listTasks(ctx: Context) {
    await ctx.reply(showList(todos));
  }

  @Hears('✅ Complete task')
  async doneTask(ctx: Context) {
    ctx.session.type = 'done';
    await ctx.reply('Write the id of the task you want to complete: ');
  }

  @Hears('✏ Edit task')
  async editTask(ctx: Context) {
    ctx.session.type = 'edit';
    ctx.deleteMessage();
    await ctx.replyWithHTML(
      'Write the ID of the task and the new name: \n\n' +
        'Example: <b>1 | New task</b>',
    );
  }

  @Hears('❌ Delete task')
  async deleteTask(ctx: Context) {
    ctx.session.type = 'remove';
    await ctx.reply('Write id of task you want to complete: ');
  }

  @On('text')
  async getMessage(@Message('text') message: string, @Ctx() ctx: Context) {
    if (!ctx.session.type) return;

    if (ctx.session.type === 'done') {
      const todo = todos.find((todo) => todo.id === Number(message));

      if (!todo) {
        await ctx.deleteMessage();
        await ctx.reply('Task not found');
        return;
      }

      todo.isCompleted = !todo.isCompleted;
      await ctx.reply(showList(todos));
    }

    if (ctx.session.type === 'edit') {
      const [taskId, taskName] = message.split(' | ');
      const todo = todos.find((todo) => todo.id === Number(taskId));

      if (!todo) {
        await ctx.deleteMessage();
        await ctx.reply('Task not found');
        return;
      }

      todo.name = taskName;
      await ctx.reply(showList(todos));
    }

    if (ctx.session.type === 'remove') {
      const todo = todos.find((todo) => todo.id === Number(message));

      if (!todo) {
        await ctx.deleteMessage();
        await ctx.reply('Task not found');
        return;
      }

      await ctx.reply(
        showList(todos.filter((todo) => todo.id !== Number(message))),
      );
    }
  }
}
