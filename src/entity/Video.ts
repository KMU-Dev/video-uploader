import { Column, Entity, ManyToOne, PrimaryColumn } from "typeorm";
import { Target } from "./Target";

@Entity()
export class Video {
    @PrimaryColumn()
    id!: number;

    @Column()
    name!: string;

    @Column()
    url!: string;

    @Column('text')
    status!: VideoStatus;

    @ManyToOne(() => Target, target => target.videos)
    target!: Target;
}

export enum VideoStatus {
    DISCOVERED = 'DISCOVERED',
    PENDING = 'PENDING',
    UPLOADING = 'UPLOADING',
    UPLOADED = 'UPLOADED',
    FAILED = 'FAILED'
}
