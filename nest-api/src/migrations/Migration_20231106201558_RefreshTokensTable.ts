import { Migration } from '@mikro-orm/migrations';

export class Migration20231106201558_RefreshTokensTable extends Migration {
    async up(): Promise<void> {
        this.addSql(
            'create table "refresh_tokens" ("id" uuid not null default gen_random_uuid(), "created_at" timestamptz(0) not null default current_timestamp, "account_id" uuid not null, "token" varchar(255) null, "expires" timestamptz(0) null, "created_by_ip" varchar(255) null, "revoked" timestamptz(0) null, "revoked_by_ip" varchar(255) null, "replaced_by_token" varchar(255) null, constraint "refresh_tokens_pkey" primary key ("id"));',
        );

        this.addSql(
            'alter table "refresh_tokens" add constraint "refresh_tokens_account_id_foreign" foreign key ("account_id") references "accounts" ("id") on update cascade;',
        );
    }

    async down(): Promise<void> {
        this.addSql('drop table if exists "refresh_tokens" cascade;');
    }
}
