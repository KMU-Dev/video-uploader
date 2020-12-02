import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity()
export class Credential {

    @PrimaryColumn()
    id!: string
    /**
     * This field is only present if the access_type parameter was set to offline in the authentication request. For details, see Refresh tokens.
     */
    @Column({ nullable: true})
    refresh_token?: string;
    /**
     * The time in ms at which this token is thought to expire.
     */
    @Column({type: 'bigint'})
    expiry_date?: number;
    /**
     * A token that can be sent to a Google API.
     */
    @Column()
    access_token?: string;
    /**
     * Identifies the type of token returned. At this time, this field always has the value Bearer.
     */
    @Column()
    token_type?: string;
    /**
     * A JWT that contains identity information about the user that is digitally signed by Google.
     */
    @Column({ nullable: true})
    id_token?: string;
    /**
     * The scopes of access granted by the access_token expressed as a list of space-delimited, case-sensitive strings.
     */
    @Column()
    scope?: string;
}