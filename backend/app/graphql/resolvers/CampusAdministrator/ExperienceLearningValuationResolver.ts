import { FieldResolver, Resolver, Root } from 'type-graphql';
import { InjectRepository } from 'typeorm-typedi-extensions';
import {
    ExperienceLearningRepository, PerformanceLevelRepository,
    StudentRepository
} from '../../../servers/DataSource';
import { ExperienceLearning } from '../../models/CampusAdministrator/ExperienceLearning';
import { ExperienceLearningValuation } from '../../models/CampusAdministrator/ExperienceLearningValuation';
import { Student } from '../../models/GeneralAdministrator/Student';
import { PerformanceLevel } from '../../models/SchoolAdministrator/PerformanceLevel';

@Resolver(ExperienceLearningValuation)
export class ExperienceLearningValuationResolver {

    @InjectRepository(ExperienceLearning)
    private repositoryExperienceLearning = ExperienceLearningRepository;

    @InjectRepository(Student)
    private repositoryStudent = StudentRepository;

    @InjectRepository(PerformanceLevel)
    private repositoryPerformanceLevel = PerformanceLevelRepository;

    @FieldResolver((_type) => ExperienceLearning, { nullable: true })
    async experienceLearning(@Root() data: ExperienceLearningValuation) {
        let id = data.experienceLearningId;
        if (id !== null && id !== undefined) {
            const result = await this.repositoryExperienceLearning.findOneBy(id);
            return result;
        }
        return null;
    }

    @FieldResolver((_type) => Student, { nullable: true })
    async student(@Root() data: ExperienceLearningValuation) {
        let id = data.studentId;
        if (id !== null && id !== undefined) {
            const result = await this.repositoryStudent.findOneBy(id);
            return result;
        }
        return null;
    }

    @FieldResolver((_type) => PerformanceLevel, { nullable: true })
    async performanceLevel(@Root() data: ExperienceLearningValuation) {
        let id = data.performanceLevelId;
        if (id !== null && id !== undefined) {
            const result = await this.repositoryPerformanceLevel.findOneBy(id);
            return result;
        }
        return null;
    }
}

