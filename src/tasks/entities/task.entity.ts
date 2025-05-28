export class Task {
	id: number;
	title: string;
	description: string;
	status: string = 'created';
	created_at: Date;
	updated_at: Date;
	pendingSync?: boolean = false;
}
