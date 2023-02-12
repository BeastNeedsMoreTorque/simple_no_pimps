import React from 'react';
import Table, {SelectColumnFilter, StatusPill} from "./Table";


function App_Table() {
    const columns = React.useMemo(
      () => [
        { Header: 'GP', accessor: 'match.gp' },
        { Header: 'W', accessor: 'match.wins' },
        { Header: 'D', accessor: 'match.draws' },
        { Header: 'L', accessor: 'match.losses' },
        { Header: 'F', accessor: 'match.goalsFor' },
        { Header: 'A', accessor: 'match.goalsAgainst' },
        { Header: 'GD', accessor: 'match.goalsFor - match.goalsAgainst' },
        { Header: 'Pts', accessor: 'match.points' },
        { Header: 'FORM', accessor: 'status', Cell: StatusPill, },
      ],
      []
    );
}