import { ObjectId } from "mongodb";
import { FieldResolver, Resolver, Root } from "type-graphql";
import { InjectRepository } from "typeorm-typedi-extensions";
import { EvaluativeComponentRepository, EvidenceLearningRepository } from "../../../servers/DataSource";
import { ClassroomPlanExpectedPerformance } from "../../models/CampusAdministrator/ClassroomPlanExpectedPerformance";
import { EvaluativeComponent } from "../../models/SchoolAdministrator/EvaluativeComponent";
import { EvidenceLearning } from "../../models/SchoolAdministrator/EvidenceLearning";

@Resolver(ClassroomPlanExpectedPerformance)
export class ClassroomPlanExpectedPerformanceResolver {

    @InjectRepository(EvaluativeComponent)
    private repositoryEvaluativeComponent = EvaluativeComponentRepository;

    @InjectRepository(EvidenceLearning)
    private repositoryEvidenceLearning = EvidenceLearningRepository;

    @FieldResolver((_type) => EvaluativeComponent, { nullable: true })
    async evaluativeComponent(@Root() data: ClassroomPlanExpectedPerformance) {
        let id = data.evaluativeComponentId;
        if (id !== null && id !== undefined) {
            const result = await this.repositoryEvaluativeComponent.findOneBy(id);
            return result;
        }
        return null;
    }

    @FieldResolver((_type) => [EvidenceLearning], { nullable: true })
    async evidenceLearnings(@Root() data: ClassroomPlanExpectedPerformance) {
        let ids = data.evidenceLearningsId;
        if (ids !== null && ids !== undefined) {
            let dataIds: any[] = [];
            ids.forEach(async (id: any) => {
                dataIds.push(new ObjectId(id));
            });
            const result = await this.repositoryEvidenceLearning.findBy({ where: { _id: { $in: dataIds } } });
            return result;
        }
        return null;
    }


}