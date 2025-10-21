import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { randomUUID } from 'crypto';

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());       // 解析 JSON body
app.use(morgan('dev'));        // 請求日誌

// 簡單的 in-memory 資料庫
const db = {
  todos: []
};

// 小工具：驗證輸入
function assertString(name, val, { allowEmpty = false } = {}) {
  if (typeof val !== 'string') throw new Error(`${name} must be a string`);
  if (!allowEmpty && val.trim() === '') throw new Error(`${name} cannot be empty`);
}

function coerceBoolean(val, def = false) {
  if (val === undefined) return def;
  if (typeof val === 'boolean') return val;
  if (val === 'true') return true;
  if (val === 'false') return false;
  throw new Error('completed must be boolean');
}

function findTodoOr404(id) {
  const todo = db.todos.find(t => t.id === id);
  if (!todo) {
    const err = new Error('ToDo not found');
    err.status = 404;
    throw err;
  }
  return todo;
}

// 根目錄健康檢查
app.get('/', (req, res) => {
  res.json({ ok: true, service: 'todo-api', version: '1.0.0' });
});

/**
 * 取得 ToDo 列表
 * 支援查詢:
 *  - completed=true|false
 *  - q=keyword (搜尋 title/description)
 *  - limit / offset (分頁)
 */
app.get('/todos', (req, res) => {
  const { completed, q, limit = '50', offset = '0' } = req.query;

  let list = [...db.todos];

  // 過濾完成狀態
  if (completed !== undefined) {
    const flag = coerceBoolean(completed);
    list = list.filter(t => t.completed === flag);
  }

  // 關鍵字搜尋
  if (q && typeof q === 'string' && q.trim() !== '') {
    const kw = q.toLowerCase();
    list = list.filter(t =>
      t.title.toLowerCase().includes(kw) ||
      (t.description || '').toLowerCase().includes(kw)
    );
  }

  // 分頁
  const l = Math.max(0, Math.min(200, parseInt(limit, 10) || 50));
  const o = Math.max(0, parseInt(offset, 10) || 0);
  const slice = list.slice(o, o + l);

  res.json({
    total: list.length,
    limit: l,
    offset: o,
    items: slice
  });
});

/**
 * 取得單一 ToDo
 */
app.get('/todos/:id', (req, res, next) => {
  try {
    const todo = findTodoOr404(req.params.id);
    res.json(todo);
  } catch (err) { next(err); }
});

/**
 * 建立 ToDo
 * body: { title: string, description?: string, completed?: boolean, dueDate?: string(ISO) }
 */
app.post('/todos', (req, res, next) => {
  try {
    const { title, description, completed, dueDate } = req.body;

    assertString('title', title);

    if (description !== undefined) assertString('description', description, { allowEmpty: true });
    const isCompleted = coerceBoolean(completed, false);

    let due = null;
    if (dueDate !== undefined) {
      if (typeof dueDate !== 'string') throw new Error('dueDate must be ISO string');
      const d = new Date(dueDate);
      if (Number.isNaN(d.getTime())) throw new Error('dueDate is not a valid date');
      due = d.toISOString();
    }

    const now = new Date().toISOString();
    const todo = {
      id: randomUUID(),
      title: title.trim(),
      description: description?.trim() || '',
      completed: isCompleted,
      dueDate: due,
      createdAt: now,
      updatedAt: now
    };

    db.todos.unshift(todo);
    res.status(201).json(todo);
  } catch (err) { next(err); }
});

/**
 * 取代更新（PUT）：全量欄位
 */
app.put('/todos/:id', (req, res, next) => {
  try {
    const todo = findTodoOr404(req.params.id);
    const { title, description, completed, dueDate } = req.body;

    assertString('title', title);
    if (description !== undefined) assertString('description', description, { allowEmpty: true });
    const isCompleted = coerceBoolean(completed, false);

    let due = null;
    if (dueDate !== undefined) {
      if (typeof dueDate !== 'string') throw new Error('dueDate must be ISO string');
      const d = new Date(dueDate);
      if (Number.isNaN(d.getTime())) throw new Error('dueDate is not a valid date');
      due = d.toISOString();
    }

    todo.title = title.trim();
    todo.description = description?.trim() || '';
    todo.completed = isCompleted;
    todo.dueDate = due;
    todo.updatedAt = new Date().toISOString();

    res.json(todo);
  } catch (err) { next(err); }
});

/**
 * 局部更新（PATCH）：只更新提供的欄位
 */
app.patch('/todos/:id', (req, res, next) => {
  try {
    const todo = findTodoOr404(req.params.id);
    const { title, description, completed, dueDate } = req.body;

    if (title !== undefined) {
      assertString('title', title);
      todo.title = title.trim();
    }
    if (description !== undefined) {
      assertString('description', description, { allowEmpty: true });
      todo.description = description.trim();
    }
    if (completed !== undefined) {
      todo.completed = coerceBoolean(completed);
    }
    if (dueDate !== undefined) {
      if (dueDate === null) {
        todo.dueDate = null;
      } else {
        if (typeof dueDate !== 'string') throw new Error('dueDate must be ISO string');
        const d = new Date(dueDate);
        if (Number.isNaN(d.getTime())) throw new Error('dueDate is not a valid date');
        todo.dueDate = d.toISOString();
      }
    }

    todo.updatedAt = new Date().toISOString();
    res.json(todo);
  } catch (err) { next(err); }
});

/**
 * 刪除 ToDo
 */
app.delete('/todos/:id', (req, res, next) => {
  try {
    const idx = db.todos.findIndex(t => t.id === req.params.id);
    if (idx === -1) {
      const err = new Error('ToDo not found');
      err.status = 404;
      throw err;
    }
    const [deleted] = db.todos.splice(idx, 1);
    res.json({ deleted });
  } catch (err) { next(err); }
});

// 全域錯誤處理
app.use((err, req, res, next) => {
  const status = err.status || 400;
  res.status(status).json({
    error: err.message || 'Bad Request'
  });
});

// 啟動服務
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ ToDo API listening on http://localhost:${PORT}`);
});
