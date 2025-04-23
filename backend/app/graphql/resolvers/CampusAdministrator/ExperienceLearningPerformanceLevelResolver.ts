import { FieldResolver, Resolver, Root } from 'type-graphql';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { PerformanceLevelRepository } from '../../../servers/DataSource';
import { ExperienceLearningPerformanceLevel } from '../../models/CampusAdministrator/ExperienceLearningPerformanceLevel';
import { PerformanceLevel } from '../../models/SchoolAdministrator/PerformanceLevel';

@Resolver(ExperienceLearningPerformanceLevel)
export class ExperienceLearningPerformanceLevelResolver {
    @InjectRepository(PerformanceLevel)
    private repositoryPerformanceLevel = PerformanceLevelRepository;

    @FieldResolver((_type) => PerformanceLevel, { nullable: true })
    async performanceLevel(@Root() data: ExperienceLearningPerformanceLevel) {
        let id = data.performanceLevelId;
        if (id !== null && id !== undefined) {
            const result = await this.repositoryPerformanceLevel.findOneBy(id);
            return result;
        }
        return null;
    }
}