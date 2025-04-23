import { FieldResolver, Resolver, Root } from 'type-graphql';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { PerformanceLevelRepository } from '../../../servers/DataSource';
import { ExperienceLearningRubricCriteriaPerformanceLevel } from '../../models/CampusAdministrator/ExperienceLearningRubricCriteriaPerformanceLevel';
import { PerformanceLevel } from '../../models/SchoolAdministrator/PerformanceLevel';

@Resolver(ExperienceLearningRubricCriteriaPerformanceLevel)
export class ExperienceLearningRubricCriteriaPerformanceLevelResolver {

    @InjectRepository(PerformanceLevel)
    private repositoryPerformanceLevel = PerformanceLevelRepository;


    @FieldResolver((_type) => PerformanceLevel, { nullable: true })
    async performanceLevel(@Root() data: ExperienceLearningRubricCriteriaPerformanceLevel) {
        let id = data.performanceLevelId;
        if (id !== null && id !== undefined) {
            const result = await this.repositoryPerformanceLevel.findOneBy(id);
            return result;
        }
        return null;
    }

}
