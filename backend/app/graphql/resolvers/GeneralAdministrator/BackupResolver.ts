import { LocalFileSystemDuplexConnector, MongoDBDuplexConnector, MongoTransferer } from 'mongodb-snapshot';
import { Ctx, Mutation, Resolver } from "type-graphql";
import { IContext } from "../../interfaces/IContext";

@Resolver()
export class BackupResolver {

    @Mutation(() => Boolean)
    async createBackup(@Ctx() context: IContext): Promise<Boolean> {
        const mongo_connector = new MongoDBDuplexConnector({
            connection: {
                uri: "mongodb://db_user_vivecolegios:db_user_vivecolegios2022@vivecolegios.nortedesantander.gov.co",
                dbname: 'app_db_vivecolegios',
            },
        });

        const localfile_connector = new LocalFileSystemDuplexConnector({
            connection: {
                path: './backup.tar',
            },
            assource: {
                collections: ["user", "role"],
            },
            astarget: {
                collections: ["user", "role"],
            }
        });

        const transferer = new MongoTransferer({
            source: mongo_connector,
            targets: [localfile_connector],
        });

        for await (const { total, write } of transferer) {
            console.log(`remaining bytes to write: ${total - write}`);
        }

        return true;
    }


}