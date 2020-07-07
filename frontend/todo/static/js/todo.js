const domain = 'http://localhost:8080';

$(document).ready(function(e) {
	
    
    $(document).on('change', '.todo-item input.js-tick', function(e){
        const $todo_item = $(this).closest('.todo-item');

        const todoId = $todo_item.attr('data-todoID');
        const todo_text = $.trim($todo_item.find('.the_todo').text());
        const isChecked = $(this).prop('checked');

        const data = {todo: todo_text, isCompleted: isChecked}
        editTodo(todoId, data, function(){
            if(isChecked){
                $todo_item.addClass('done');
            }else{
                $todo_item.removeClass('done');
            }
        })

    });

	$(document).on('click', '.js-delete-todo', function(e) {
        const $todo_item = $(this).closest('.todo-item');
		let todoId = $todo_item.attr('data-todoID');
		deleteTodo(todoId, function(){
            $todo_item.remove();
        });
	});

	$(document).on('click', '.js-edit-todo', function(e) {
		const $todo_item = $(this).closest('.todo-item');
		const $the_todo = $todo_item.find('.the_todo');
		const is_done = $todo_item.hasClass('done');

		$the_todo.attr('data-edited', $the_todo.text());
		if (is_done) {
			$the_todo.css({ 'text-decoration': 'none' });
		}

		$(makeItemEditable($todo_item)).focus();
	});

	$(document).on('blur', '.todo-item .the_todo', function(e) {
		setTimeout(() => {
			const $todo_item = $(this).closest('.todo-item');
			const is_done = $todo_item.hasClass('done');

			if (is_done) {
				$the_todo.css({ 'text-decoration': 'line-through' });
			}
			resetItemToReadOnly($todo_item, $(this));
        }, 500);
        return false
	});

	$(document).on('click', '.js-do-edit-todo', function(e) {
		e.stopPropagation();
        const $todo_item = $(this).closest('.todo-item')
        const $this_todo = $todo_item.find('.the_todo');

		const todoId = $todo_item.attr('data-todoID');
        const todo_text = $this_todo.text();

        $this_todo.attr('data-edited', todo_text);

        const data = {todo: todo_text, isCompleted: $todo_item.hasClass('done')}
		editTodo(todoId, data);
    });
    
    $(document).on('keyup', '.js-todo-input', function(e) {
		let keyCode = e.keyCode;
		if (keyCode === 13) {
			let todo = $.trim($(this).val());
			if (todo) {
				addTodo(todo, renderTodoItem);
				$(this).val('');
			} else {
				show_message('Please enter something to do', 'warning');
			}
		}
	});
	

});

function addTodo(todo, callback) {
	data = { todo: todo, isCompleted: false };
	performCURD({ what: 'c', data: data, callback: callback });
}

function renderTodoItem(todo){
    const item_markup = `<li class="todo-item text-left ${todo.isCompleted ? done : ''}" data-todoID="${todo.id}">
                            <input id="${todo.id}" type="checkbox" class="js-tick" />
                            <label for="${todo.id}" class="tick js-tick"></label>
                            <span class="the_todo">${todo.todo}</span>
                            
                            <button class="delete-todo js-delete-todo px-3">
                                <svg>
                                    <use href="#delete-icon"></use>
                                </svg>
                            </button>
                            <button class="delete-todo js-edit-todo">
                                <svg>
                                    <use href="#edit-icon"></use>
                                </svg>
                            </button>
                            <button class="delete-todo js-do-edit-todo d-none">
                                <svg>
                                    <use href="#tickEdit-icon"></use>
                                </svg>
                            </button>
                        </li>`
    $(".js-todo-list").append(item_markup);
}


function deleteTodo(todoId, callback) {
	performCURD({ what: 'd', todoId: todoId, callback: callback });
}

function editTodo(todoId, data, callback) {
	
	performCURD({ what: 'u', data: data, todoId: todoId, callback: callback });
}

function makeItemEditable($todo_item) {
	$todo_item.find('.js-edit-todo').addClass('d-none');
	$todo_item.find('.js-do-edit-todo').removeClass('d-none');
	const $the_todo = $todo_item.find('.the_todo');
	$the_todo.attr('contentEditable', true);

	return $the_todo;
}

function resetItemToReadOnly($todo_item, $this_todo) {
	$this_todo.attr('contentEditable', false);
	$todo_item.find('.js-do-edit-todo').addClass('d-none');
	$todo_item.find('.js-edit-todo').removeClass('d-none');
	const original_todo_text = $this_todo.attr('data-edited');
	$this_todo.attr('data-edited', original_todo_text);

	$this_todo.text(original_todo_text);
}

function performCURD({ what = '', data = '', todoId='', callback = undefined } = {}) {
	const type = what === 'c' ? 'POST' : what === 'u' ? 'PUT' : what === 'r' ? 'GET' : what === 'd' ? 'DELETE' : '';
	if (!$.trim(type)) {
		return;
	}

	$.ajax({
		url: `${domain}/todos/${todoId}`,
		type: type,
		data: {
			...data,
			csrfmiddlewaretoken: window.csrfToken
		},
		beforeSend: () => {},
		success: (resp) => {
			show_message(resp['message'], 'success');
			if (callback != undefined) {
                if(what === 'c'){
                    callback(resp['data'])
                }else
				    callback();
			}
		},
		error: (resp) => {
			show_message(resp['message'], 'error');
			console.log(resp);
		},
		complete: () => {}
	});
}

function show_message(message = '', type = 'error') {
	$.toast({
		text: message, // Text that is to be shown in the toast

		icon: type, // Type of toast icon
		showHideTransition: 'fade', // fade, slide or plain
		allowToastClose: false, // Boolean value true or false
		hideAfter: 3000, // false to make it sticky or number representing the miliseconds as time after which toast needs to be hidden
		stack: false, // false if there should be only one toast at a time or a number representing the maximum number of toasts to be shown at a time
		position: 'top-center', // bottom-left or bottom-right or bottom-center or top-left or top-right or top-center or mid-center or an object representing the left, right, top, bottom values

		textAlign: 'left', // Text alignment i.e. left, right or center
		loader: false // Whether to show loader or not. True by default
	});
}


How to Create a Todo API in Deno and Oak + MySQL