import client from "../db/client.ts";
// config
import { TABLE } from "../db/config.ts";
// Interface
import Todo from "../interfaces/Todo.ts";



export default {
    /**
    * Takes in the id params & checks if the todo item exists
    * in the database
    * @param id
    * @returns boolean to tell if an entry of todo exits in table
    */
    doesExistById: async ({ id }: Todo) => { 
        const [result] = await client.query(`SELECT COUNT(*) count FROM {TABLE.todo} WHERE id=? LIMIT 1`,[
            id
        ],)

        return result.count > 0;
    },
    /**
    * Will return all todos from the table
    * @param None
    * @returns array of todos items/dict
    */
    getAll: async () => { 

        return await client.query(`SELECT * FROM ${TABLE.TODO}`);
    },
    /**
    * Adds a new Todo item with default isCompleted: false in todo Table
    * @param todo, isCompleted
    * @returns None
    */
    add: async ({ todo, isCompleted }: Todo) => { 
        
        const result = await client.query(
            `INSERT INTO ${TABLE.TODO}(todo, isCompleted) values(?, ?)`,
            [
                todo,
                isCompleted,
            ],
        );
        return { id: result['lastInsertId'], todo: todo, isCompleted: isCompleted}
    },
    /**
    * updates the props of todo item
    * @param id, todo, isCompleted
    * @returns integer (count of effect rows)
    */
    update: async ({ id, todo, isCompleted }: Todo) => { 

        const result = await client.query(`UPDATE {TABLE.TODO} SET todo=?, isCompleted=? WHERE id=?`,[
            todo,
            isCompleted,
            id
        ],)

        // Return count of rows updated
        
        return result.affectedRows;

    },
    /**
    * Deletes the todo item from todo table
    * @param id
    * @returns None
    */

    delete: async ({ id }: Todo) => {
        const result = await client.query(`DELETE FROM ${TABLE.TODO} WHERE id=?`,[
            id
        ],);

        return result.affectedRows

     }
}