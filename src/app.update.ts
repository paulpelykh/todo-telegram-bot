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

  // @Action('list')
  @Hears('📃 Todo list')
  async listTasks(ctx: Context) {
    await ctx.reply(showList(todos));
  }

  @Hears('✅ Complete task')
  async doneTask(ctx: Context) {
    await ctx.reply('Write id of task you want to complete: ');
    ctx.session.type = 'done';
  }

  @On('text')
  async getMessage(@Message('text') idTask: string, @Ctx() ctx: Context) {
    if (!ctx.session.type) return;

    if (ctx.session.type === 'done') {
      const todo = todos.find((todo) => todo.id === Number(idTask));

      if (!todo) {
        await ctx.deleteMessage();
        await ctx.reply('Task not found');
        return;
      }

      todo.isCompleted = !todo.isCompleted;
      await ctx.reply(showList(todos));
    }
  }
}
