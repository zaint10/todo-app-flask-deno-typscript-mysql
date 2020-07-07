// stubs
import todos from "../stubs/todo.ts";
import Todo from '../interfaces/Todo.ts';
import { v4 } from "https://deno.land/std/uuid/mod.ts";

// handlers
import TodoHandler from '../handlers/todo.ts'

export default {
    getAllTodos: async (
        { request, response, params }:
            {
                request: any,
                response: any,
                params: any
            }) => {
                const data = await TodoHandler.getAll()
        response.status = 200;
        response.body = {
            success: true,
            data
        }
    },
    createTodo: async (
        { request, response, params }: { request: any, response: any, params: any }
    ) => {
        
        const body = await request.body();
        
        if (!request.hasBody) {
            response.status = 400
            response.body = {
                success: false,
                message: 'No Data provided'

            }
            
            return;
        }
        try{
            
            const todoItem = await TodoHandler.add({
                todo: body.value.get('todo'),
                isCompleted: false
            });
            response.status = 200;
            response.body = {
                success: true,
                data: todoItem,
                message: 'Todo created',
            }
            
        }catch(e){
            response.status = 400;
            response.body = {
                success: false,
                message: `Error: ${e}`,
                
            };

        }
        
    },
    getTodoById: (
        { params, response }: { params: { id: string }; response: any }
    ) => {
        const todo: Todo | undefined = todos.find(t => {
            return t.id === Number(params.id)
        })
        if (!todo) {
            response.status = 404;
            response.body = {
                success: false,
                message: "No todo found",
            };
            return;
        }

        // If todo is found
        response.status = 200;
        response.body = {
            success: true,
            data: todo,
        };
    },
    updateTodoById: async (
        { request, response, params }: { request: any, response: any, params: { id: string } }
    ) => {
        try{
            const isAvailable = await TodoHandler.doesExistById({ id: Number(params.id) })

            if (!isAvailable) {
                response.status = 404;
                response.body = {
                    success: false,
                    message: "No todo found",
                };
                return;
            }

            
            const body = await request.body();
            
            const updatedRows = await TodoHandler.update({ 
                id: Number(params.id), 
                todo: body.value.get('todo'),
                isCompleted: JSON.parse(body.value.get('isCompleted'))
            })


            response.status = 200;
            response.body = {
                success: true,
                message: `Successfully updated ${updatedRows} row(s)`,
            };

        }catch(e){
            response.status = 400;
            response.body = {
                success: false,
                message: `Error: ${e}`,
            };
        }
        
    },
    deleteTodoById: async (
        { params, response }: { params: { id: string }; response: any },
    ) => {
        try{
            const isAvailable = await TodoHandler.doesExistById({ id: Number(params.id) })
            if(!isAvailable){
                response.status = 404
                response.body = {
                    success: false,
                    message: `Todo item with id ${params.id} doesn't exist`
                }
                return
            }
            const updatedRows = await TodoHandler.delete({ id: Number(params.id) })
            response.body = {
                success: true,
                message: `Successfully updated ${updatedRows} row(s)`
                
            };

        }catch(e){
            response.status = 400;
            response.body = {
                success: false,
                message: `Error: ${e}`,
            };
        }
        
    },
};

