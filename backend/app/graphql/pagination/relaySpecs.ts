import * as Relay from 'graphql-relay';
import { ArgsType, ClassType, Field, ObjectType } from 'type-graphql';

@ArgsType()
export class ConnectionArgs implements Relay.ConnectionArguments {
  @Field((type) => String, {
    nullable: true,
    description: 'Paginate before opaque cursor',
  })
  before?: Relay.ConnectionCursor;

  @Field((type) => String, {
    nullable: true,
    description: 'Paginate after opaque cursor',
  })
  after?: Relay.ConnectionCursor;

  @Field((type) => Number, { nullable: true, description: 'Paginate first' })
  first?: number;

  @Field((type) => Number, { nullable: true, description: 'Paginate last' })
  last?: number;
}

type ExtractNodeType<EdgeType> = EdgeType extends Relay.Edge<infer NodeType> ? NodeType : never;

export function ConnectionType<
  EdgeType extends Relay.Edge<NodeType>,
  NodeType = ExtractNodeType<EdgeType>
>(nodeName: string, edgeClass: ClassType<EdgeType>) {
  @ObjectType(`${nodeName}Connection`)
  abstract class Connection implements Relay.Connection<NodeType> {
    @Field((type) => PageInfo)
    pageInfo!: PageInfo;

    @Field((type) => [edgeClass])
    edges!: EdgeType[];

    @Field((type) => Number, { nullable: true, description: 'Total Count' })
    totalCount?: number;
  }

  return Connection;
}

export function EdgeType<NodeType extends object>(nodeName: string, nodeType: ClassType<NodeType>) {
  @ObjectType(`${nodeName}Edge`)
  abstract class Edge implements Relay.Edge<NodeType> {
    @Field((type) => nodeType)
    node!: NodeType;

    @Field((type) => String, {
      description: 'Used in `before` and `after` args',
    })
    cursor!: Relay.ConnectionCursor;
  }

  return Edge;
}

@ObjectType()
class PageInfo implements Relay.PageInfo {
  @Field((type) => Boolean)
  hasNextPage!: boolean;

  @Field((type) => Boolean)
  hasPreviousPage!: boolean;

  @Field((type) => String, { nullable: true })
  startCursor!: string | null;

  @Field((type) => String, { nullable: true })
  endCursor!: string | null;
}
