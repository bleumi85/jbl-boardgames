import { Migration } from '@mikro-orm/migrations';

export class Migration20231106201125_AccountsTable extends Migration {
    async up(): Promise<void> {
        this.addSql(
            'create table "accounts" ("id" uuid not null default gen_random_uuid(), "created_at" timestamptz(0) not null default current_timestamp, "updated_at" timestamptz(0) null, "first_name" varchar(255) not null, "last_name" varchar(255) not null, "user_name" varchar(255) not null, "email" varchar(255) not null, "role" text check ("role" in (\'Admin\', \'User\', \'Visitor\')) not null default \'Visitor\', "password_hash" varchar(255) not null, "accept_terms" boolean not null default false, "verification_token" varchar(255) null, "verified" timestamptz(0) null, "reset_token" varchar(255) null, "reset_token_expires" timestamptz(0) null, "password_reset" timestamptz(0) null, constraint "accounts_pkey" primary key ("id"));',
        );
        this.addSql('alter table "accounts" add constraint "accounts_user_name_unique" unique ("user_name");');
        this.addSql('alter table "accounts" add constraint "accounts_email_unique" unique ("email");');
        this.addSql('alter table "accounts" add constraint "account_full_name_unique" unique ("first_name", "last_name");');
    }

    async down(): Promise<void> {
        this.addSql('drop table if exists "accounts" cascade;');
    }
}
