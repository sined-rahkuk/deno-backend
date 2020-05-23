import {
  Application,
  Router,
  RouterContext,
  ContextSendOptions,
} from 'https://deno.land/x/oak/mod.ts';
import { Todo } from './models/Todo.ts';
import {
  getTodos,
  getTodo,
  addTodo,
  updateTodo,
  deleteTodo,
} from './data/service.ts';

const env = Deno.env.toObject();
const PORT = env.PORT || 4000;
const HOST = env.HOST || '127.0.0.1';

const router = new Router();

router.get('/', ({ response }) => {
  response.body = {
    message: 'hello world at root page',
    bodyType: 'should be of type JSON',
    paths: [
      { path: 'todo', supportedMethods: ['GET', 'POST'] },
      { path: 'todo/:id', supportedMethods: ['GET', 'POST', 'DEL'] },
    ],
  };
});

router.get('/todo', ({ response }) => {
  response.body = getTodos();
});

router.post('/todo', async ({ response, request }) => {
  const body = await request.body();

  if (body.type !== 'json' || !body?.value.hasOwnProperty('text')) {
    response.body =
      'Request should have body of type JSON and text property inside of it';
    response.status = 400;
    return;
  }

  response.body = addTodo(body.value);
});

router.get('/todo/:id', ({ response, params }) => {
  if (params?.id) {
    const todoId = +params.id;
    const found: Todo | undefined = getTodo(todoId);

    found ? (response.body = found) : (response.status = 404);
  }
});

router.post('/todo/:id', async ({ response, request }) => {
  const body = await request.body();

  if (body.type !== 'json') {
    response.body = 'Request should have body of type JSON';
    response.status = 400;
    return;
  }

  response.body = updateTodo(body.value);
});

router.delete('/todo/:id', async ({ response, params }) => {
  if (params?.id) {
    const todoId = +params.id;
    const success: boolean = deleteTodo(todoId);
    success ? (response.body = 'success!') : (response.status = 404);
  }
});

const app = new Application();

app.use(router.routes());
app.use(router.allowedMethods());

console.log(`Listening on port: ${PORT}`);

await app.listen(`${HOST}:${PORT}`);
