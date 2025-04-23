import { FieldResolver, Resolver, Root } from "type-graphql";
import { InjectRepository } from "typeorm-typedi-extensions";
import { EvaluativeComponentRepository } from "../../../servers/DataSource";
import { ClassroomPlanPerformanceAppraisalStrategy } from "../../models/CampusAdministrator/ClassroomPlanPerformanceAppraisalStrategy";
import { EvaluativeComponent } from "../../models/SchoolAdministrator/EvaluativeComponent";

@Resolver(ClassroomPlanPerformanceAppraisalStrategy)
export class ClassroomPlanPerformanceAppraisalStrategyResolver {

    @InjectRepository(EvaluativeComponent)
    private repositoryEvaluativeComponent = EvaluativeComponentRepository;

    @FieldResolver((_type) => EvaluativeComponent, { nullable: true })
    async evaluativeComponent(@Root() data: ClassroomPlanPerformanceAppraisalStrategy) {
        let id = data.evaluativeComponentId;
        if (id !== null && id !== undefined) {
            const result = await this.repositoryEvaluativeComponent.findOneBy(id);
            return result;
        }
        return null;
    }
}