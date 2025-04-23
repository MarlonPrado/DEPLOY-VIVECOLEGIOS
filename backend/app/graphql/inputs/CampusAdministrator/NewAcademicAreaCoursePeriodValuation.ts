import { Field, InputType } from 'type-graphql';
import { ValuationType } from '../../enums/ValuationType';
import { AcademicAreaCoursePeriodValuation } from '../../models/CampusAdministrator/AcademicAreaCoursePeriodValuation';

console.log('Definiendo InputType para valoraciones de áreas académicas (por período)');

@InputType()
export class NewAcademicAreaCoursePeriodValuation implements Partial<AcademicAreaCoursePeriodValuation> {
  @Field({ nullable: true })
  academicAreaId?: string;  // ID del área académica

  @Field({ nullable: true })
  academicPeriodId?: string;  // ID del período (trimestre, bimestre, etc.)

  @Field({ nullable: true })
  studentId?: String;  // ID del estudiante evaluado

  @Field({ nullable: true })
  assessment?: number;  // Nota numérica (ej: 4.5)

  @Field({ nullable: true })
  performanceLevelId?: String;  // ID del nivel de desempeño (ej: "Avanzado")

  @Field(() => ValuationType, { nullable: true })
  valuationType?: ValuationType;  // Tipo de valoración (ej: "FINAL", "PARCIAL")
}