import {MigrationInterface, QueryRunner} from "typeorm";

export class miy1631384602307 implements MigrationInterface {
    name = 'miy1631384602307'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "character" ADD "justTest" text`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "character" DROP COLUMN "justTest"`);
    }

}
