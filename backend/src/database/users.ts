import {Entity, Unique, PrimaryGeneratedColumn, Column } from 'typeorm'


@Entity({name: 'users'})
export class UserOrm {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column({length: 255})
    username: string

    @Column({length: 255})
    email: string

    @Column({length: 500})
    passwordHash: string

    usernameMail: string
}