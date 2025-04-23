import { Badge } from "reactstrap";
import styled from 'styled-components';

export const StyledBadge = styled(Badge)`
  background-color: ${(props: any) => {
    return props.background + "!important";
  }};
`;