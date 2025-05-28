import { Entity, PrimaryGeneratedColumn, Column, Generated } from 'typeorm';

@Entity()
export class Task {
	@PrimaryGeneratedColumn()
	@Generated()
	id: number;

	@Column()
	title: string;

	@Column({ nullable: true })
	description: string;

	@Column({ default: 'created' })
	status: string;

	@Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
	created_at: Date;

	@Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
	updated_at: Date;

	@Column({ default: false })
	pendingSync: boolean;
}
