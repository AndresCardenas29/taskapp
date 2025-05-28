import { Injectable } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from './entities/task.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';

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

@Injectable()
export class TasksService {
	constructor(
		@InjectRepository(Task)
		private taskRepository: Repository<Task>,
	) {}

	async create(createTaskDto: CreateTaskDto) {
		const dta: Task = {
			id: Math.floor(Math.random() * 100),
			title: createTaskDto.title,
			description: createTaskDto.description,
			status: 'created',
			created_at: new Date(),
			updated_at: new Date(),
			pendingSync: false,
		};
		// listTaks.push(dta);

		const tsk = this.taskRepository.create(dta);

		return this.taskRepository.save(tsk);
	}

	async findAll(status?: string): Promise<responseDataArr> {
		/* switch (status) {
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
		} */

		if (status) {
			return {
				error: false,
				msg: 'Taks',
				data: await this.taskRepository.find({ where: { status } }),
			};
		}
		return {
			error: false,
			msg: 'Taks',
			data: await this.taskRepository.find({
				where: { status: Not('deleted') },
			}),
		};
	}

	async findOne(id: number): Promise<responseData> {
		const findTask = await this.taskRepository.findOneBy({ id });

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

	async update(
		id: number,
		updateTaskDto: UpdateTaskDto,
	): Promise<responseData> {
		const findTask = await this.taskRepository.findOneBy({ id });

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
		findTask.pendingSync = false;

		const response = await this.taskRepository.save(findTask);

		return {
			error: false,
			msg: 'Task updated',
			data: response,
		};
	}

	async remove(id: number) {
		const findTask = await this.taskRepository.findOneBy({ id });

		if (!findTask) {
			return {
				error: true,
				msg: 'Task not found',
				data: null,
			};
		}

		// delete
		findTask.status = 'deleted';
		findTask.updated_at = new Date();
		findTask.pendingSync = false;

		const response = await this.taskRepository.save(findTask);

		return {
			error: false,
			msg: 'Task find',
			data: response,
		};
	}

	async sync(tasks: Task[]): Promise<responseData> {
		// This method is a placeholder for syncing tasks with an external service

		const taskNotSync = tasks.filter((task) => {
			return task.pendingSync;
		});

		for (const task of taskNotSync) {
			if (task.id < 0) {
				const newTask: Task = {
					id: Math.floor(Math.random() * 1000000) * -1, // Assign a temporary negative id for new tasks
					title: task.title,
					description: task.description,
					status: 'created',
					created_at: new Date(),
					updated_at: new Date(),
					pendingSync: false,
				};
				const createTask = this.taskRepository.create({
					...newTask,
					id: undefined, // Deja que la base de datos genere el id automáticamente
				});
				await this.taskRepository.save(createTask);
			} else {
				// const findTask = listTaks.find((t) => t.id === task.id);
				const findTask = await this.taskRepository.findOne({
					where: { id: task.id },
				});

				if (findTask) {
					findTask.title = task.title;
					findTask.description = task.description;
					findTask.status = task.status;
					findTask.updated_at = new Date();
					findTask.pendingSync = false;
					await this.taskRepository.save(findTask);
				}
			}
		}

		return {
			error: false,
			msg: 'Sync completed',
			data: null,
		};
	}
}
