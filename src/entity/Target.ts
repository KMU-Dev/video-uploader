import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Video } from "./Video";

@Entity()
export class Target {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ unique: true })
    name!: string;

    @Column({ unique: true })
    sourceUrl!: string;

    @Column()
    destinationFolder!: string;

    @OneToMany(() => Video, video => video.target)
    videos!: Video[];
}
