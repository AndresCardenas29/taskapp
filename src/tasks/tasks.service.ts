import { Injectable } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from './entities/task.entity';

type responseData = {
	error: boolean;
	msg: string;
	data: Task | null;
};

type responseDataArr = {
	error: boolean;
	msg: string;
	data: Task[] | null;
};

const listTaks = [
	{
		id: 1,
		title: 'task one',
		description: 'desct one',
		status: 'created',
		created_at: new Date(),
		updated_at: new Date(),
		pendingSync: false,
	},
];
@Injectable()
export class TasksService {
	create(createTaskDto: CreateTaskDto) {
		const dta: Task = {
			id: Math.floor(Math.random() * 100),
			title: createTaskDto.title,
			description: createTaskDto.description,
			status: 'created',
			created_at: new Date(),
			updated_at: new Date(),
			pendingSync: false,
		};
		listTaks.push(dta);
		return dta;
	}

	findAll(status?: string): responseDataArr {
		switch (status) {
			case 'created':
				return {
					error: false,
					msg: 'Taks',
					data: listTaks.filter((task) => task.status == 'created'),
				};
			case 'doing':
				return {
					error: false,
					msg: 'Taks',
					data: listTaks.filter((task) => task.status == 'doing'),
				};
			case 'deleted':
				return {
					error: false,
					msg: 'Taks',
					data: listTaks.filter((task) => task.status == 'deleted'),
				};
			case 'completed':
				return {
					error: false,
					msg: 'Taks',
					data: listTaks.filter((task) => task.status == 'completed'),
				};

			default:
				return {
					error: false,
					msg: 'Taks',
					data: listTaks.filter((task) => task.status != 'deleted'),
				};
		}
	}

	findOne(id: number): responseData {
		const findTask = listTaks.find((task) => task.id === id);

		if (!findTask) {
			return {
				error: true,
				msg: 'Task not found',
				data: null,
			};
		}

		return {
			error: false,
			msg: 'Task find',
			data: findTask,
		};
	}

	update(id: number, updateTaskDto: UpdateTaskDto): responseData {
		const findTask = listTaks.find((task) => task.id === id);

		if (!findTask) {
			return {
				error: true,
				msg: 'Task not found',
				data: null,
			};
		}

		if (updateTaskDto.title !== undefined) {
			findTask.title = updateTaskDto.title;
		}
		if (updateTaskDto.description !== undefined) {
			findTask.description = updateTaskDto.description;
		}
		if (updateTaskDto.status !== undefined) {
			findTask.status = updateTaskDto.status;
		}

		findTask.updated_at = new Date();

		return {
			error: false,
			msg: 'Task updated',
			data: findTask,
		};
	}

	remove(id: number) {
		const findTask = listTaks.find((task) => task.id === id);

		if (!findTask) {
			return {
				error: true,
				msg: 'Task not found',
				data: null,
			};
		}

		// delete
		findTask.status = 'deleted';

		return {
			error: false,
			msg: 'Task find',
			data: findTask,
		};
	}

	sync(tasks: Task[]): responseData {
		// This method is a placeholder for syncing tasks with an external service

		const taskNotSync = tasks.filter((task) => {
			return task.pendingSync;
		});

		taskNotSync.forEach((task) => {
			if (task.id < 0) {
				const newTask: Task = {
					id: Math.floor(Math.random() * 100),
					title: task.title,
					description: task.description,
					status: 'created',
					created_at: new Date(),
					updated_at: new Date(),
					pendingSync: task.pendingSync,
				};
				listTaks.push(newTask);
			} else {
				const findTask = listTaks.find((t) => t.id === task.id);
				if (findTask) {
					findTask.title = task.title;
					findTask.description = task.description;
					findTask.status = task.status;
					findTask.updated_at = new Date();
				}
			}
		});

		return {
			error: false,
			msg: 'Sync completed',
			data: null,
		};
	}
}
