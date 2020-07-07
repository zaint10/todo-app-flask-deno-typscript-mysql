import { Router } from "https://deno.land/x/oak/mod.ts";
import { oakCors } from "https://deno.land/x/cors/mod.ts"
const router = new Router();
// controller
import todoController from "../controllers/todo.ts";

router
    .get("/todos",  todoController.getAllTodos)
    .post("/todos", oakCors(), todoController.createTodo)
    .get("/todos/:id", todoController.getTodoById)
    .put("/todos/:id", oakCors(), todoController.updateTodoById)
    .delete("/todos/:id", todoController.deleteTodoById);

export default router;