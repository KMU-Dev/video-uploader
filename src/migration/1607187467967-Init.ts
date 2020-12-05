import {MigrationInterface, QueryRunner} from "typeorm";

export class Init1607187467967 implements MigrationInterface {
    name = 'Init1607187467967'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "credential" ("id" character varying NOT NULL, "refresh_token" character varying, "expiry_date" bigint NOT NULL, "access_token" character varying NOT NULL, "token_type" character varying NOT NULL, "id_token" character varying, "scope" character varying NOT NULL, CONSTRAINT "PK_3a5169bcd3d5463cefeec78be82" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "video" ("id" integer NOT NULL, "name" character varying NOT NULL, "url" character varying NOT NULL, "status" text NOT NULL, "targetId" integer, CONSTRAINT "PK_1a2f3856250765d72e7e1636c8e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "target" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "sourceUrl" character varying NOT NULL, "destinationFolder" character varying NOT NULL, CONSTRAINT "UQ_918a4f3804b98f705903f4dbc35" UNIQUE ("name"), CONSTRAINT "UQ_73e0c094fb00804517eb819f0da" UNIQUE ("sourceUrl"), CONSTRAINT "PK_9d962204b13c18851ea88fc72f3" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "video" ADD CONSTRAINT "FK_e986d0e1e59e2bb6d0e88460432" FOREIGN KEY ("targetId") REFERENCES "target"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "video" DROP CONSTRAINT "FK_e986d0e1e59e2bb6d0e88460432"`);
        await queryRunner.query(`DROP TABLE "target"`);
        await queryRunner.query(`DROP TABLE "video"`);
        await queryRunner.query(`DROP TABLE "credential"`);
    }

}
