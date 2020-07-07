import { v4 } from "https://deno.land/std/uuid/mod.ts";
// interface
import Todo from '../interfaces/Todo.ts';

let todos: Todo[] = [
    {
        id: Number(v4.generate()),
        todo: 'How to Create a Todo API in Deno and Oak',
        isCompleted: true,
    },
    {
        id: Number(v4.generate()),
        todo: 'Eat',
        isCompleted: false,
    },
    {
        id: Number(v4.generate()),
        todo: 'Work',
        isCompleted: false,
    },
    {
        id: Number(v4.generate()),
        todo: 'Sleep',
        isCompleted: false,
    },
    {
        id: Number(v4.generate()),
        todo: 'Repeat',
        isCompleted: false,
    },
];

export default todos;