// import { MigrationInterface, QueryRunner, Table } from 'typeorm';

// export class User1705468988642 implements MigrationInterface {
//   public async up(queryRunner: QueryRunner): Promise<void> {
//     await queryRunner.createTable(
//       new Table({
//         name: 'user',
//         columns:[
//           { name: 'id', type: 'bigint', isPrimary: true, isGenerated: true, generationStrategy: 'increment' },
//           { name: 'email', type: 'varchar', length: '50', isUnique: true},
//           { name: 'password', type: 'varchar', length: '255'},
//           { name: 'name', type: 'varchar', length: '50'},
//           { name: 'user_flg', type: 'tinyint'},
//           { name: 'date_of_birth', type: 'date', isNullable: true},
//           { name: 'phone', type: 'varchar', length: '20', isNullable: true},
//           { name: 'address', type: 'text', isNullable: true},
//           { name: 'del_flg', type: 'tinyint'},
//           { name: 'created_by', type: 'bigint', isNullable: true},
//           { name: 'created_at', type: 'timestamp', default: 'CURRENT_TIMESTAMP', isNullable: true},
//           { name: 'updated_by', type: 'bigint', isNullable: true},
//           { name: 'updated_at', type: 'timestamp', default: 'CURRENT_TIMESTAMP', isNullable: true},
//           { name: 'deleted_by', type: 'bigint', isNullable: true},
//           { name: 'deleted_at', type: 'timestamp', default: 'CURRENT_TIMESTAMP', isNullable: true},
//         ]
//       })
//     )
//   }

//   public async down(queryRunner: QueryRunner): Promise<void> {
//     await queryRunner.dropTable('user');
//   }
// }
